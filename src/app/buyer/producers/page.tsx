"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ProducerOrganizationProfile } from "@/lib/producer-profile";

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0176d3] border-t-transparent" />
        <p className="text-sm text-[#706e6b]">Loading producer profile...</p>
      </div>
    </div>
  );
}

// Main page export wrapped in Suspense
export default function BuyerProducerProfilePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BuyerProducerProfileContent />
    </Suspense>
  );
}

// Inner component that uses useSearchParams
function BuyerProducerProfileContent() {
  const searchParams = useSearchParams();
  const producerId = searchParams.get("producer") || "default";

  const [profile, setProfile] = useState<ProducerOrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/organization-profile?organizationId=${encodeURIComponent(producerId)}`
      );

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile || null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "certified":
        return "bg-green-100 text-green-700 border-green-200";
      case "under_review":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "expired":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0176d3] border-t-transparent" />
          <p className="text-sm text-[#706e6b]">Loading producer profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">
            Airline Perspective
          </p>
          <h1 className="text-3xl font-bold text-[#181818]">Producer Profile</h1>
        </div>
        <div className="rounded-xl border border-dashed border-[#e5e5e5] bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f2f2]">
            <svg className="h-8 w-8 text-[#706e6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#181818]">No producer data available</h3>
          <p className="mt-1 text-sm text-[#706e6b]">
            Producers need to set up their plants and certificates first.
          </p>
          <Link
            href="/buyer/marketplace"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0176d3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#014486]"
          >
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const totalCapacity = profile.summary.totalNameplateCapacityMTPerYear || 0;
  const producerName = profile.legalIdentity.displayName || profile.legalIdentity.organizationName;
  const certificationCount = profile.certifications.filter(
    (item) => item.status === "certified"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">
              Airline Perspective
            </p>
            <h1 className="text-3xl font-bold text-[#181818]">
              {producerName} — Producer Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#706e6b]">
              Review legal identity, production capacity, compliance readiness,
              commercial availability, and project maturity before awarding long-term
              offtake agreements.
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-[#706e6b]">
              <span>{profile.facilities.length} Production Facilities</span>
              <span className="h-4 w-px bg-[#e5e5e5]" />
              <span>{profile.summary.feedstocks.join(", ")} Feedstocks</span>
              <span className="h-4 w-px bg-[#e5e5e5]" />
              <span>{certificationCount} Active Certifications</span>
            </div>
          </div>
          <span className="rounded-full bg-[#f5f9ff] px-3 py-1 text-xs font-semibold text-[#0176d3]">
            {profile.projectReadiness.projectStage.replaceAll("_", " ")}
          </span>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">
            Total Capacity
          </p>
          <p className="mt-2 text-2xl font-bold text-[#181818]">{totalCapacity.toLocaleString()} MT/yr</p>
          <p className="text-sm text-[#706e6b]">{profile.summary.feedstocks.join(", ")} • {profile.facilities.length} facilities</p>
        </div>
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">
            Available Volume
          </p>
          <p className="mt-2 text-2xl font-bold text-[#181818]">
            {profile.commercial.availableVolumeMT.toLocaleString()} MT
          </p>
          <p className="text-sm text-[#706e6b]">{profile.commercial.commercialStatus.replaceAll("_", " ")}</p>
        </div>
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">
            Compliance Ready
          </p>
          <p className="mt-2 text-2xl font-bold text-[#181818]">
            {profile.derived.isComplianceEligibleNow ? "Yes" : "Not Yet"}
          </p>
          <p className="text-sm text-[#706e6b]">
            {profile.derived.earliestComplianceEligibleDate
              ? `Earliest: ${new Date(
                  profile.derived.earliestComplianceEligibleDate
                ).toLocaleDateString()}`
              : "Awaiting framework readiness"}
          </p>
        </div>
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">
            Avg GHG Reduction
          </p>
          <p className="mt-2 text-2xl font-bold text-[#181818]">
            {Math.round(profile.derived.headlineReductionPercent || 0)}%
          </p>
          <p className="text-sm text-[#706e6b]">{profile.derived.headlinePathway || "Across all pathways"}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#181818]">Legal Identity</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Organization</dt><dd className="font-medium text-[#181818]">{profile.legalIdentity.organizationName}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Legal Entity</dt><dd className="font-medium text-[#181818]">{profile.legalIdentity.legalEntityName}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">HQ Country</dt><dd className="font-medium text-[#181818]">{profile.legalIdentity.headquartersCountry || "Not provided"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Primary Contact</dt><dd className="font-medium text-[#181818]">{profile.legalIdentity.primaryContactName || "Not provided"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Email</dt><dd className="font-medium text-[#181818]">{profile.legalIdentity.primaryContactEmail || "Not provided"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Website</dt><dd className="font-medium text-[#181818]">{profile.legalIdentity.website || "Not provided"}</dd></div>
          </dl>
        </div>

        <div className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#181818]">Commercial Readiness</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Status</dt><dd className="font-medium text-[#181818]">{profile.commercial.commercialStatus.replaceAll("_", " ")}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Pricing Model</dt><dd className="font-medium text-[#181818]">{profile.commercial.pricingModel || "Negotiable"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Available From</dt><dd className="font-medium text-[#181818]">{profile.commercial.availableFromDate ? new Date(profile.commercial.availableFromDate).toLocaleDateString() : "Not provided"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Contract Types</dt><dd className="font-medium text-[#181818]">{profile.commercial.contractTypesSupported.join(", ")}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Delivery Readiness</dt><dd className="font-medium text-[#181818]">{profile.logistics.deliveryReadiness.replaceAll("_", " ")}</dd></div>
          </dl>
        </div>
      </section>

      <section className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#181818]">Compliance Checks</h2>
            <p className="text-sm text-[#706e6b]">
              Track certification status, eligibility, and framework timelines.
            </p>
          </div>
          <span className="rounded-full bg-[#f8f9fa] px-3 py-1 text-xs font-semibold text-[#706e6b]">
            {profile.certifications.length} certifications on record
          </span>
        </div>
        {profile.certifications.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-[#e5e5e5] bg-[#f8f9fa] p-8 text-center">
            <p className="text-sm text-[#706e6b]">No certificates uploaded yet</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {profile.certifications.slice(0, 6).map((check, index) => (
              <div
                key={`${check.scheme}-${index}`}
                className="flex flex-col justify-between rounded-lg border border-[#e5e5e5] bg-[#f8f9fa] p-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#181818]">{check.scheme}</h3>
                    <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${getComplianceColor(check.status)}`}>
                      {check.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#3e3e3c]">
                    Scope: {check.scope.replaceAll("_", " ")}.
                    {check.certificationBody ? ` Verified by ${check.certificationBody}.` : ""}
                  </p>
                </div>
                <div className="mt-3 text-xs text-[#706e6b]">
                  <p>Issue: {check.issueDate ? new Date(check.issueDate).toLocaleDateString() : "N/A"}</p>
                  <p>Expiry: {check.expiryDate ? new Date(check.expiryDate).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#181818]">Capacity Outlook</h2>
            <p className="text-sm text-[#706e6b]">
              Review facility-level capacity and projected deliverability.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f5e9] px-3 py-1 text-xs font-semibold text-[#2e844a]">
            Based on shared producer profile
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {profile.facilities.map((facility) => (
            <div key={facility.facilityId} className="rounded-xl border border-[#e5e5e5] p-4">
              <p className="text-sm font-semibold text-[#706e6b]">{facility.facilityName}</p>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#706e6b]">Nameplate</p>
                  <p className="text-2xl font-bold text-[#181818]">
                    {Math.round(facility.nameplateCapacityMTPerYear / 1000)}k MT
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-[#706e6b]">Expected Available</p>
                  <p className="text-xl font-semibold text-[#2e844a]">
                    {Math.round(facility.expectedAvailableVolumeMTPerYear / 1000)}k MT
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#706e6b]">
                {facility.country} • {facility.pathwaysProduced.join(", ")} • {facility.feedstocksUsed.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#181818]">Project Readiness</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Stage</dt><dd className="font-medium text-[#181818]">{profile.projectReadiness.projectStage.replaceAll("_", " ")}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">FID Status</dt><dd className="font-medium text-[#181818]">{profile.projectReadiness.fidStatus.replaceAll("_", " ")}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Feedstock Secured</dt><dd className="font-medium text-[#181818]">{profile.projectReadiness.feedstockSecuredPercent ?? "N/A"}%</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-[#706e6b]">Offtake Secured</dt><dd className="font-medium text-[#181818]">{profile.projectReadiness.offtakeSecuredPercent ?? "N/A"}%</dd></div>
          </dl>
          <div className="mt-4 rounded-lg border border-[#f3f2f2] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#706e6b]">Key Risks</p>
            <ul className="mt-2 space-y-2 text-sm text-[#181818]">
              {profile.projectReadiness.keyRisks.length > 0 ? (
                profile.projectReadiness.keyRisks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))
              ) : (
                <li>No key risks reported.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-[#e5e5e5] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#181818]">Profile Signals</h3>
          <p className="mt-1 text-sm text-[#706e6b]">
            Quick reference for buyer-side filtering and diligence.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[#181818]">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#2e844a]" />
              Deliverable now: {profile.derived.isCurrentlyDeliverable ? "Yes" : "No"}.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#2e844a]" />
              Compliance eligible now: {profile.derived.isComplianceEligibleNow ? "Yes" : "No"}.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#ff9800]" />
              Readiness score: {profile.derived.readinessScore ?? "N/A"}.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#0176d3]" />
              Delivery confidence: {profile.derived.deliveryConfidenceScore ?? "N/A"}.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
