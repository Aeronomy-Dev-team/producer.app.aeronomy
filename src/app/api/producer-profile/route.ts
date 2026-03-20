import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OrganizationSettings from "@/models/OrganizationSettings";
import ProducerProfile from "@/models/ProducerProfile";
import { buildProducerOrganizationProfile } from "@/lib/producer-profile";
import { syncOrganizationProfileToBuyerPortal } from "@/lib/webhooks/organization-profile-service";

export const dynamic = "force-dynamic";

function getStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function getDateValue(value: unknown): Date | undefined {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const organizationId =
      request.nextUrl.searchParams.get("organizationId") || "default";

    const [settings, producerProfile] = await Promise.all([
      OrganizationSettings.findOne({ organizationId }).lean(),
      ProducerProfile.findOne({ organizationId }).lean(),
    ]);

    return NextResponse.json(
      {
        organizationId,
        companyName: settings?.companyName || "",
        legalName: settings?.legalName || "",
        registrationNumber: settings?.registrationNumber || "",
        vatNumber: settings?.vatNumber || "",
        address: settings?.address || "",
        website: settings?.website || "",
        onboardingComplete: settings?.onboardingComplete || false,
        primaryContact: settings?.primaryContact || {
          name: "",
          email: "",
          phone: "",
        },
        legalIdentity: producerProfile?.legalIdentity || {},
        summary: producerProfile?.summary || {},
        compliance: producerProfile?.compliance || {},
        commercial: producerProfile?.commercial || {},
        logistics: producerProfile?.logistics || {},
        projectReadiness: producerProfile?.projectReadiness || {},
        updatedAt: producerProfile?.updatedAt || settings?.updatedAt || null,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error fetching producer profile settings:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch producer profile settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const organizationId = body.organizationId || "default";

    const settings = await OrganizationSettings.findOneAndUpdate(
      { organizationId },
      {
        $set: {
          companyName: body.companyName || "",
          legalName: body.legalName || "",
          registrationNumber: body.registrationNumber || "",
          vatNumber: body.vatNumber || "",
          address: body.address || "",
          website: body.website || "",
          onboardingComplete: Boolean(body.onboardingComplete),
          primaryContact: {
            name: body.primaryContact?.name || "",
            email: body.primaryContact?.email || "",
            phone: body.primaryContact?.phone || "",
          },
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    await ProducerProfile.findOneAndUpdate(
      { organizationId },
      {
        $set: {
          legalIdentity: {
            displayName: body.legalIdentity?.displayName || "",
            orgType: body.legalIdentity?.orgType || "producer",
            headquartersCountry: body.legalIdentity?.headquartersCountry || "",
            registeredCountry: body.legalIdentity?.registeredCountry || "",
            businessAddress: body.legalIdentity?.businessAddress || body.address || "",
            website: body.legalIdentity?.website || body.website || "",
            primaryContactRole: body.legalIdentity?.primaryContactRole || "",
            yearFounded: body.legalIdentity?.yearFounded || undefined,
            companyDescription: body.legalIdentity?.companyDescription || "",
            ownershipType: body.legalIdentity?.ownershipType || "",
            parentCompany: body.legalIdentity?.parentCompany || "",
            regionsServed: getStringArray(body.legalIdentity?.regionsServed),
          },
          summary: {
            pathways: getStringArray(body.summary?.pathways),
            feedstocks: getStringArray(body.summary?.feedstocks),
            targetMarkets: getStringArray(body.summary?.targetMarkets),
            deliveryRegions: getStringArray(body.summary?.deliveryRegions),
            airportSupplyCapability: getStringArray(
              body.summary?.airportSupplyCapability
            ),
            totalExpectedAvailableVolumeMTPerYear:
              body.summary?.totalExpectedAvailableVolumeMTPerYear || undefined,
            currentOperationalCapacityMTPerYear:
              body.summary?.currentOperationalCapacityMTPerYear || undefined,
            committedVolumeMTPerYear:
              body.summary?.committedVolumeMTPerYear || undefined,
            uncommittedVolumeMTPerYear:
              body.summary?.uncommittedVolumeMTPerYear || undefined,
            earliestDeliveryDate: getDateValue(body.summary?.earliestDeliveryDate),
            firstComplianceEligibleDeliveryDate: getDateValue(
              body.summary?.firstComplianceEligibleDeliveryDate
            ),
            deliveryReadiness: body.summary?.deliveryReadiness || undefined,
            blendLimitNotes: body.summary?.blendLimitNotes || "",
            rampUpNotes: body.summary?.rampUpNotes || "",
          },
          compliance: {
            lcaMethodology: body.compliance?.lcaMethodology || "",
            baselineFramework: body.compliance?.baselineFramework || undefined,
            fossilBaselineValue: body.compliance?.fossilBaselineValue || undefined,
            coreValue_gCO2ePerMJ:
              body.compliance?.coreValue_gCO2ePerMJ || undefined,
            ilucValue_gCO2ePerMJ:
              body.compliance?.ilucValue_gCO2ePerMJ || undefined,
            transportValue_gCO2ePerMJ:
              body.compliance?.transportValue_gCO2ePerMJ || undefined,
            processingValue_gCO2ePerMJ:
              body.compliance?.processingValue_gCO2ePerMJ || undefined,
            totalLifecycleValue_gCO2ePerMJ:
              body.compliance?.totalLifecycleValue_gCO2ePerMJ || undefined,
            reductionPercentVsFossilBaseline:
              body.compliance?.reductionPercentVsFossilBaseline || undefined,
            defaultOrActual: body.compliance?.defaultOrActual || undefined,
            independentVerificationStatus:
              body.compliance?.independentVerificationStatus || undefined,
            verificationBody: body.compliance?.verificationBody || "",
            verificationDate: getDateValue(body.compliance?.verificationDate),
            corsiaEligible: Boolean(body.compliance?.corsiaEligible),
            refuelEUEligible: Boolean(body.compliance?.refuelEUEligible),
            ukRTFOEligible: Boolean(body.compliance?.ukRTFOEligible),
            firstBookAndClaimDeliveryDate: getDateValue(
              body.compliance?.firstBookAndClaimDeliveryDate
            ),
            firstPhysicalDeliveryDate: getDateValue(
              body.compliance?.firstPhysicalDeliveryDate
            ),
            firstComplianceEligibleDeliveryDate: getDateValue(
              body.compliance?.firstComplianceEligibleDeliveryDate
            ),
            firstCORSIAEligibleDeliveryDate: getDateValue(
              body.compliance?.firstCORSIAEligibleDeliveryDate
            ),
            firstReFuelEUEligibleDeliveryDate: getDateValue(
              body.compliance?.firstReFuelEUEligibleDeliveryDate
            ),
            firstUKRTFOEligibleDeliveryDate: getDateValue(
              body.compliance?.firstUKRTFOEligibleDeliveryDate
            ),
            chainOfCustodyReadinessDate: getDateValue(
              body.compliance?.chainOfCustodyReadinessDate
            ),
            proofOfSustainabilityReadinessDate: getDateValue(
              body.compliance?.proofOfSustainabilityReadinessDate
            ),
            safcIssuanceReadinessDate: getDateValue(
              body.compliance?.safcIssuanceReadinessDate
            ),
            frameworkTimelines: {
              corsia: {
                readinessStatus:
                  body.compliance?.frameworkTimelines?.corsia?.readinessStatus || "",
                targetEligibilityDate: getDateValue(
                  body.compliance?.frameworkTimelines?.corsia?.targetEligibilityDate
                ),
                dependencies: getStringArray(
                  body.compliance?.frameworkTimelines?.corsia?.dependencies
                ),
              },
              refuelEU: {
                readinessStatus:
                  body.compliance?.frameworkTimelines?.refuelEU?.readinessStatus || "",
                targetEligibilityDate: getDateValue(
                  body.compliance?.frameworkTimelines?.refuelEU?.targetEligibilityDate
                ),
                dependencies: getStringArray(
                  body.compliance?.frameworkTimelines?.refuelEU?.dependencies
                ),
              },
              ukRTFO: {
                readinessStatus:
                  body.compliance?.frameworkTimelines?.ukRTFO?.readinessStatus || "",
                targetEligibilityDate: getDateValue(
                  body.compliance?.frameworkTimelines?.ukRTFO?.targetEligibilityDate
                ),
                dependencies: getStringArray(
                  body.compliance?.frameworkTimelines?.ukRTFO?.dependencies
                ),
              },
            },
          },
          commercial: {
            commercialStatus: body.commercial?.commercialStatus || undefined,
            availableVolumeMT: body.commercial?.availableVolumeMT || undefined,
            availableFromDate: getDateValue(body.commercial?.availableFromDate),
            pricingModel: body.commercial?.pricingModel || undefined,
            indicativePriceMin: body.commercial?.indicativePriceMin || undefined,
            indicativePriceMax: body.commercial?.indicativePriceMax || undefined,
            currency: body.commercial?.currency || "",
            contractTypesSupported: getStringArray(
              body.commercial?.contractTypesSupported
            ),
            preferredContractTenorMonthsMin:
              body.commercial?.preferredContractTenorMonthsMin || undefined,
            preferredContractTenorMonthsMax:
              body.commercial?.preferredContractTenorMonthsMax || undefined,
            counterpartyPreferences:
              body.commercial?.counterpartyPreferences || "",
            bookAndClaimSupported: Boolean(body.commercial?.bookAndClaimSupported),
            physicalDeliveryAvailable:
              body.commercial?.physicalDeliveryAvailable !== false,
          },
          logistics: {
            deliveryReadiness: body.logistics?.deliveryReadiness || undefined,
            earliestDeliveryDate: getDateValue(body.logistics?.earliestDeliveryDate),
            minimumLeadTimeDays:
              body.logistics?.minimumLeadTimeDays || undefined,
            deliveryModes: getStringArray(body.logistics?.deliveryModes),
            deliveryRegions: getStringArray(body.logistics?.deliveryRegions),
            deliveryCountries: getStringArray(body.logistics?.deliveryCountries),
            airportDeliveryCapability: getStringArray(
              body.logistics?.airportDeliveryCapability
            ),
            marineTerminalCapability: Boolean(
              body.logistics?.marineTerminalCapability
            ),
            storageAndBlendingCapability: Boolean(
              body.logistics?.storageAndBlendingCapability
            ),
            seasonalityConstraints: getStringArray(
              body.logistics?.seasonalityConstraints
            ),
          },
          projectReadiness: {
            projectStage: body.projectReadiness?.projectStage || undefined,
            fidStatus: body.projectReadiness?.fidStatus || undefined,
            fidDate: getDateValue(body.projectReadiness?.fidDate),
            targetFIDDate: getDateValue(body.projectReadiness?.targetFIDDate),
            financialCloseStatus:
              body.projectReadiness?.financialCloseStatus || "",
            financialCloseDate: getDateValue(
              body.projectReadiness?.financialCloseDate
            ),
            debtFinancingStatus:
              body.projectReadiness?.debtFinancingStatus || "",
            sponsorEquityStatus:
              body.projectReadiness?.sponsorEquityStatus || "",
            epcContractSigned: Boolean(body.projectReadiness?.epcContractSigned),
            permitsSecuredPercent:
              body.projectReadiness?.permitsSecuredPercent || undefined,
            feedstockSecuredPercent:
              body.projectReadiness?.feedstockSecuredPercent || undefined,
            offtakeSecuredPercent:
              body.projectReadiness?.offtakeSecuredPercent || undefined,
            keyRisks: getStringArray(body.projectReadiness?.keyRisks),
            majorDependencies: getStringArray(
              body.projectReadiness?.majorDependencies
            ),
          },
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const profile = await buildProducerOrganizationProfile({
      organizationId,
      settings,
    });

    const webhookSync = await syncOrganizationProfileToBuyerPortal({
      event: "producer.organization.updated",
      organization: {
        organizationId: settings.organizationId,
        companyName: settings.companyName,
        legalName: settings.legalName,
        registrationNumber: settings.registrationNumber,
        vatNumber: settings.vatNumber,
        address: settings.address,
        website: settings.website,
        onboardingComplete: settings.onboardingComplete,
        primaryContact: settings.primaryContact,
        updatedAt: settings.updatedAt,
      },
      profile,
    });

    return NextResponse.json(
      {
        success: true,
        organizationId,
        webhookSync,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating producer profile settings:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update producer profile settings",
      },
      { status: 500 }
    );
  }
}
