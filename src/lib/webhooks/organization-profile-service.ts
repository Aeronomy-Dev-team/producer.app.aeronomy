import { getInterDashboardHeaders } from "@/lib/jwt";

export interface OrganizationProfilePayload {
  event: "producer.organization.updated";
  organization: {
    organizationId: string;
    companyName: string;
    legalName: string;
    registrationNumber: string;
    vatNumber: string;
    address: string;
    website: string;
    onboardingComplete: boolean;
    primaryContact: {
      name: string;
      email: string;
      phone: string;
    };
    updatedAt?: Date | string;
  };
}

export interface OrganizationProfileSyncResult {
  success: boolean;
  endpoint?: string;
  error?: string;
}

function getOrganizationWebhookConfig() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BUYER_DASHBOARD_URL ||
    process.env.BUYER_DASHBOARD_URL ||
    process.env.MARKETPLACE_BASE_URL ||
    "http://localhost:3004";

  const endpoint =
    process.env.BUYER_ORGANIZATION_WEBHOOK_URL ||
    process.env.BUYER_PROFILE_WEBHOOK_URL ||
    `${baseUrl}/api/webhooks/producer-organization`;

  const apiKey =
    process.env.BUYER_API_KEY ||
    process.env.NEXT_PUBLIC_BUYER_API_KEY ||
    process.env.PRODUCER_API_KEY;

  return { endpoint, apiKey };
}

export async function syncOrganizationProfileToBuyerPortal(
  payload: OrganizationProfilePayload
): Promise<OrganizationProfileSyncResult> {
  const { endpoint, apiKey } = getOrganizationWebhookConfig();

  try {
    const headers = new Headers(
      getInterDashboardHeaders("sync_organization_profile")
    );

    if (apiKey) {
      headers.set("X-API-Key", apiKey);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      let errorMessage = `Webhook sync failed (${response.status})`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = `${errorMessage}: ${response.statusText}`;
      }

      return {
        success: false,
        endpoint,
        error: errorMessage,
      };
    }

    return {
      success: true,
      endpoint,
    };
  } catch (error: unknown) {
    return {
      success: false,
      endpoint,
      error:
        error instanceof Error
          ? error.message
          : "Failed to sync organization profile",
    };
  }
}
