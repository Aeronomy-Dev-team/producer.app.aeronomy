#!/usr/bin/env node

const args = process.argv.slice(2);

function getArg(name, fallback) {
  const prefix = `--${name}=`;
  const match = args.find((arg) => arg.startsWith(prefix));
  if (match) {
    return match.slice(prefix.length);
  }

  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index !== -1 && args[index + 1]) {
    return args[index + 1];
  }

  return fallback;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function logStep(message) {
  console.log(`\n[step] ${message}`);
}

function logPass(message) {
  console.log(`[pass] ${message}`);
}

function logInfo(message) {
  console.log(`[info] ${message}`);
}

function describeHttpFailure(status, data) {
  if (status === 404) {
    return "Endpoint returned 404. Check that the correct app is running, the route exists, and middleware/auth is not blocking access.";
  }
  if (status === 401) {
    return "Endpoint returned 401 Unauthorized. Check API auth or route protection.";
  }
  if (status === 403) {
    return "Endpoint returned 403 Forbidden. Check auth and route-level access control.";
  }
  if (status >= 500) {
    return `Endpoint returned ${status}. Check server logs for the underlying application error.`;
  }

  if (data?.error) {
    return `Endpoint returned ${status}: ${data.error}`;
  }

  return `Endpoint returned ${status}.`;
}

const baseUrl = getArg("base-url", process.env.TEST_BASE_URL || "http://localhost:3000");
const organizationId = getArg("organization-id", "default");

const samplePayload = {
  organizationId,
  companyName: "Aeronomy Test Producer",
  legalName: "Aeronomy Test Producer Ltd",
  registrationNumber: "TEST-REG-001",
  vatNumber: "TEST-VAT-001",
  address: "1 Test Street, London, United Kingdom",
  website: "https://example.com/test-producer",
  onboardingComplete: true,
  primaryContact: {
    name: "Test Contact",
    email: "test.contact@example.com",
    phone: "+44 20 0000 0000",
  },
};

async function getJson(url, init) {
  let response;
  try {
    response = await fetch(url, init);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown network failure";
    throw new Error(
      `Network request failed for ${url}. Make sure the app server is running and reachable. Original error: ${message}`
    );
  }

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  return { response, data };
}

async function main() {
  console.log("[info] Organization profile integration test script");
  console.log(`[info] Base URL: ${baseUrl}`);
  console.log(`[info] Organization ID: ${organizationId}`);
  console.log("[info] This script mutates organization settings data.");

  logStep("Fetch the generated buyer-facing organization profile");
  const initialProfile = await getJson(
    `${baseUrl}/api/organization-profile?organizationId=${encodeURIComponent(organizationId)}`
  );

  assert(
    initialProfile.response.ok,
    `Initial profile fetch failed. ${describeHttpFailure(
      initialProfile.response.status,
      initialProfile.data
    )}`
  );
  assert(initialProfile.data?.success === true, "Profile endpoint did not return success=true");
  assert(initialProfile.data?.profile, "Profile endpoint did not return a profile object");
  assert(
    typeof initialProfile.data.profile.orgId === "string",
    "Profile orgId is missing or invalid"
  );
  assert(
    initialProfile.data.profile.legalIdentity,
    "Profile legalIdentity section is missing"
  );
  assert(initialProfile.data.profile.summary, "Profile summary section is missing");
  logPass("Profile endpoint returns a structured producer profile");

  logStep("Save organization settings to trigger profile rebuild and buyer sync");
  const putResult = await getJson(`${baseUrl}/api/organization-settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(samplePayload),
  });

  assert(
    putResult.response.ok,
    `Settings save failed. ${describeHttpFailure(
      putResult.response.status,
      putResult.data
    )}`
  );
  assert(
    putResult.data?.organizationId === organizationId,
    "Settings response organizationId does not match"
  );
  assert(
    putResult.data?.webhookSync,
    "Settings response did not include webhookSync"
  );
  logPass("Settings save returns webhookSync metadata");

  if (putResult.data.webhookSync.success) {
    logPass("Buyer portal sync reported success");
  } else {
    logInfo(
      `Buyer portal sync reported failure: ${putResult.data.webhookSync.error || "unknown error"}`
    );
    logInfo(
      `Buyer endpoint used: ${putResult.data.webhookSync.endpoint || "not returned"}`
    );
  }

  logStep("Fetch the organization profile again and validate enriched fields");
  const updatedProfile = await getJson(
    `${baseUrl}/api/organization-profile?organizationId=${encodeURIComponent(organizationId)}`
  );

  assert(
    updatedProfile.response.ok,
    `Updated profile fetch failed. ${describeHttpFailure(
      updatedProfile.response.status,
      updatedProfile.data
    )}`
  );

  const profile = updatedProfile.data?.profile;
  assert(profile, "Updated profile payload is missing");
  assert(
    profile.legalIdentity?.organizationName === samplePayload.companyName,
    "legalIdentity.organizationName did not reflect saved settings"
  );
  assert(
    profile.legalIdentity?.legalEntityName === samplePayload.legalName,
    "legalIdentity.legalEntityName did not reflect saved settings"
  );
  assert(
    profile.legalIdentity?.primaryContactEmail === samplePayload.primaryContact.email,
    "legalIdentity.primaryContactEmail did not reflect saved settings"
  );
  assert(profile.summary, "Updated profile summary is missing");
  assert(Array.isArray(profile.facilities), "Updated profile facilities is not an array");
  assert(Array.isArray(profile.products), "Updated profile products is not an array");
  assert(
    Array.isArray(profile.certifications),
    "Updated profile certifications is not an array"
  );
  assert(
    profile.metadata?.profileVersion === "buyer-portal-v2",
    "Updated profile version is missing or incorrect"
  );
  logPass("Updated profile contains expected top-level buyer-facing sections");

  console.log("\nSummary");
  console.log("- Verified `GET /api/organization-profile` returns a structured profile");
  console.log("- Verified `PUT /api/organization-settings` accepts a producer profile payload");
  console.log("- Verified the settings response includes `webhookSync` details");
  console.log("- Verified saved legal/contact values are reflected in the generated profile");
  console.log("- Verified the rich profile includes summary, facilities, products, certifications, and metadata");

  if (!putResult.data.webhookSync.success) {
    console.log("- Buyer sync is still failing, but the local producer profile pipeline works");
  }
}

main().catch((error) => {
  console.error("\n[fail]", error.message);
  process.exitCode = 1;
});
