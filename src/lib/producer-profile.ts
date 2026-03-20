import OrganizationSettings, {
  type IOrganizationSettings,
} from "@/models/OrganizationSettings";
import Plant from "@/models/Plant";
import Product from "@/models/Product";
import Certificate from "@/models/Certificate";
import ComplianceDoc from "@/models/ComplianceDoc";
import ProductionBatch from "@/models/ProductionBatch";
import Contract from "@/models/Contract";
import ProducerProfile from "@/models/ProducerProfile";

const FOSSIL_BASELINE_GCO2E_PER_MJ = 89;

type DeliveryReadiness =
  | "immediate"
  | "from_date"
  | "precommercial"
  | "pilot_only";

type ProjectStage =
  | "concept"
  | "development"
  | "pre_fid"
  | "post_fid"
  | "construction"
  | "commissioning"
  | "operational";

type CommissioningStatus =
  | "planned"
  | "pre_fid"
  | "post_fid"
  | "under_construction"
  | "mechanical_completion"
  | "commissioning"
  | "operational";

type FIDStatus = "not_reached" | "targeted" | "achieved";
type BaselineFramework = "corsia" | "eu_red" | "uk_rtfo";

export interface ProducerOrganizationProfile {
  orgId: string;
  legalIdentity: {
    organizationName: string;
    legalEntityName: string;
    displayName: string;
    orgType: "producer";
    headquartersCountry: string;
    registeredCountry: string;
    businessAddress: string;
    website: string;
    primaryContactName: string;
    primaryContactEmail: string;
    primaryContactRole: string;
  };
  summary: {
    organizationName: string;
    pathways: string[];
    feedstocks: string[];
    totalNameplateCapacityMTPerYear: number;
    totalExpectedAvailableVolumeMTPerYear: number;
    currentOperationalCapacityMTPerYear: number;
    committedVolumeMTPerYear: number;
    uncommittedVolumeMTPerYear: number;
    earliestDeliveryDate?: string;
    firstComplianceEligibleDeliveryDate?: string;
    deliveryReadiness: DeliveryReadiness;
  };
  facilities: Array<{
    facilityId: string;
    facilityName: string;
    city?: string;
    stateOrRegion?: string;
    country: string;
    pathwaysProduced: string[];
    feedstocksUsed: string[];
    nameplateCapacityMTPerYear: number;
    expectedAvailableVolumeMTPerYear: number;
    annualUtilizationAssumptionPercent?: number;
    commissioningStatus: CommissioningStatus;
    fidStatus: FIDStatus;
    currentStatusAsOfDate?: string;
    minContractVolumeMT?: number;
    maxContractVolumeMT?: number;
    monthlyDeliverabilityMT?: number;
    quarterlyDeliverabilityMT?: number;
    storageCapacityMT?: number;
    loadingModes?: string[];
    exportCapability?: boolean;
  }>;
  feedstockProfile: Array<{
    feedstockType: string;
    category: "waste" | "residue" | "crop" | "synthetic" | "mixed";
    originCountry?: string;
    originRegion?: string;
    feedstockIsWasteResidue?: boolean;
    highILUCRisk?: boolean;
    deforestationRisk?: "low" | "medium" | "high";
    annualRequirementTonnes?: number;
    securedTonnes?: number;
    securedPercent?: number;
  }>;
  products: Array<{
    productName: string;
    pathway: string;
    feedstockType: string;
    astmStandard?: string;
    maxBlendPercentage?: number;
    bookAndClaimEligible: boolean;
    physicalDeliveryAvailable: boolean;
    lca: {
      methodology: string;
      baselineFramework: "corsia" | "eu_red" | "uk_rtfo";
      fossilBaselineValue: number;
      totalLifecycleValue_gCO2ePerMJ: number;
      reductionPercentVsFossilBaseline: number;
      defaultOrActual: "estimated" | "actual";
      independentVerificationStatus: "not_verified" | "in_review" | "verified";
    };
    complianceEligibility: {
      corsiaEligible: boolean;
      refuelEUEligible: boolean;
      ukRTFOEligible: boolean;
    };
  }>;
  certifications: Array<{
    scheme: string;
    scope:
      | "organization"
      | "facility"
      | "product"
      | "feedstock"
      | "chain_of_custody";
    status:
      | "not_started"
      | "planned"
      | "in_progress"
      | "audit_scheduled"
      | "under_review"
      | "certified"
      | "suspended"
      | "expired";
    certificationBody?: string;
    certificateNumber?: string;
    issueDate?: string;
    expiryDate?: string;
    expectedCompletionDate?: string;
    linkedFacilityId?: string;
    linkedProductName?: string;
  }>;
  complianceTimelines: {
    firstBookAndClaimDeliveryDate?: string;
    firstPhysicalDeliveryDate?: string;
    firstComplianceEligibleDeliveryDate?: string;
    firstCORSIAEligibleDeliveryDate?: string;
    firstReFuelEUEligibleDeliveryDate?: string;
    firstUKRTFOEligibleDeliveryDate?: string;
    proofOfSustainabilityReadinessDate?: string;
    frameworkTimelines: {
      corsia: {
        readinessStatus: string;
        targetEligibilityDate?: string;
        dependencies?: string[];
      };
      refuelEU: {
        readinessStatus: string;
        targetEligibilityDate?: string;
        dependencies?: string[];
      };
      ukRTFO: {
        readinessStatus: string;
        targetEligibilityDate?: string;
        dependencies?: string[];
      };
    };
  };
  commercial: {
    commercialStatus:
      | "seeking_offtake"
      | "accepting_spot"
      | "accepting_forward"
      | "under_negotiation"
      | "fully_committed";
    availableVolumeMT: number;
    availableFromDate?: string;
    pricingModel?: "fixed" | "indexed" | "negotiable";
    contractTypesSupported: Array<
      "spot_volume" | "forward_commitment" | "offtake_agreement"
    >;
  };
  logistics: {
    deliveryReadiness: DeliveryReadiness;
    earliestDeliveryDate?: string;
    deliveryRegions: string[];
    deliveryCountries: string[];
    bookAndClaimSupported: boolean;
    physicalDeliveryAvailable: boolean;
  };
  projectReadiness: {
    projectStage: ProjectStage;
    fidStatus: FIDStatus;
    feedstockSecuredPercent?: number;
    offtakeSecuredPercent?: number;
    keyRisks: string[];
  };
  supportingDocuments: Array<{
    documentType: string;
    title: string;
    status?: string;
    issueDate?: string;
    expiryDate?: string;
  }>;
  derived: {
    isCurrentlyDeliverable: boolean;
    isComplianceEligibleNow: boolean;
    isPreCertificationSupply: boolean;
    earliestComplianceEligibleDate?: string;
    headlineReductionPercent?: number;
    headlinePathway?: string;
    headlineFeedstock?: string;
    headlineAvailableVolumeMT?: number;
    headlineCertificationStatus?: string;
    readinessScore?: number;
    complianceReadinessScore?: number;
    deliveryConfidenceScore?: number;
  };
  metadata: {
    profileVersion: string;
    source: "producer-portal";
    generatedAt: string;
    updatedAt?: string;
  };
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  return [...new Set(values.map((v) => v?.trim()).filter(Boolean) as string[])];
}

function getStringArraySafe(values?: string[] | null): string[] {
  return Array.isArray(values)
    ? values.map((value) => String(value).trim()).filter(Boolean)
    : [];
}

function formatDate(date?: Date | string | null): string | undefined {
  if (!date) return undefined;
  return new Date(date).toISOString();
}

function average(values: number[]): number | undefined {
  if (!values.length) return undefined;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2));
}

function maxDate(dates: Array<Date | string | undefined | null>): string | undefined {
  const validDates = dates
    .filter(Boolean)
    .map((date) => new Date(date as Date | string))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (!validDates.length) return undefined;
  return new Date(Math.max(...validDates.map((date) => date.getTime()))).toISOString();
}

function minDate(dates: Array<Date | string | undefined | null>): string | undefined {
  const validDates = dates
    .filter(Boolean)
    .map((date) => new Date(date as Date | string))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (!validDates.length) return undefined;
  return new Date(Math.min(...validDates.map((date) => date.getTime()))).toISOString();
}

function splitLocation(location?: string) {
  const parts = (location || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    city: parts[0] || undefined,
    stateOrRegion: parts.length > 2 ? parts[1] : undefined,
    country: parts[parts.length - 1] || "Unknown",
  };
}

function classifyFeedstockCategory(
  feedstock: string
): "waste" | "residue" | "crop" | "synthetic" | "mixed" {
  const value = feedstock.toLowerCase();
  if (
    value.includes("uco") ||
    value.includes("used cooking") ||
    value.includes("tallow") ||
    value.includes("waste")
  ) {
    return "waste";
  }
  if (value.includes("residue") || value.includes("msw") || value.includes("municipal")) {
    return "residue";
  }
  if (value.includes("ptl") || value.includes("e-fuel") || value.includes("synthetic")) {
    return "synthetic";
  }
  if (
    value.includes("corn") ||
    value.includes("sugar") ||
    value.includes("ethanol") ||
    value.includes("crop")
  ) {
    return "crop";
  }
  return "mixed";
}

function isWasteResidue(feedstock: string) {
  const category = classifyFeedstockCategory(feedstock);
  return category === "waste" || category === "residue";
}

function hasAnyKeyword(values: string[], keywords: string[]): boolean {
  return values.some((value) =>
    keywords.some((keyword) => value.toLowerCase().includes(keyword.toLowerCase()))
  );
}

function mapCertificateStatus(
  status: string
):
  | "not_started"
  | "planned"
  | "in_progress"
  | "audit_scheduled"
  | "under_review"
  | "certified"
  | "suspended"
  | "expired" {
  if (status === "valid") return "certified";
  if (status === "expiring") return "under_review";
  if (status === "expired") return "expired";
  return "planned";
}

function mapPlantStatusToCommissioningStatus(status: string): CommissioningStatus {
  if (status === "active") return "operational";
  if (status === "maintenance") return "commissioning";
  return "planned";
}

function mapPlantStatusToFIDStatus(status: string): FIDStatus {
  return status === "active" ? "achieved" : "targeted";
}

function mapPlantsToProjectStage(statuses: string[]): ProjectStage {
  if (statuses.includes("active")) return "operational";
  if (statuses.includes("maintenance")) return "commissioning";
  if (statuses.length > 0) return "development";
  return "concept";
}

function calculateLifecycleValue(reductionPercent: number) {
  return Number(
    (
      FOSSIL_BASELINE_GCO2E_PER_MJ *
      (1 - Math.min(Math.max(reductionPercent, 0), 100) / 100)
    ).toFixed(2)
  );
}

function buildFrameworkTimeline(
  eligibleNow: boolean,
  targetEligibilityDate?: string,
  dependencies?: string[]
) {
  return {
    readinessStatus: eligibleNow ? "eligible_now" : targetEligibilityDate ? "in_progress" : "not_ready",
    targetEligibilityDate,
    dependencies: eligibleNow ? [] : dependencies,
  };
}

function calculateScore(parts: number[]) {
  if (!parts.length) return undefined;
  return Math.round(parts.reduce((sum, value) => sum + value, 0) / parts.length);
}

export async function buildProducerOrganizationProfile(input?: {
  organizationId?: string;
  settings?: IOrganizationSettings | null;
}): Promise<ProducerOrganizationProfile> {
  const organizationId = input?.organizationId || input?.settings?.organizationId || "default";
  const settings =
    input?.settings || (await OrganizationSettings.findOne({ organizationId }));
  const manualProfile = await ProducerProfile.findOne({ organizationId }).lean();

  const [
    plants,
    allProducts,
    allCertificates,
    allComplianceDocs,
    productionBatches,
    contracts,
  ] = await Promise.all([
    Plant.find().sort({ name: 1 }),
    Product.find().sort({ name: 1 }),
    Certificate.find().sort({ expiryDate: 1 }),
    ComplianceDoc.find().sort({ issueDate: -1 }),
    ProductionBatch.find().sort({ productionDate: 1 }),
    Contract.find({ status: { $in: ["active", "scheduled", "draft"] } }).sort({
      effectiveDate: 1,
    }),
  ]);

  const products =
    allProducts.filter(
      (product) =>
        product.producerId === organizationId || product.producerId === "default"
    ).length > 0
      ? allProducts.filter(
          (product) =>
            product.producerId === organizationId || product.producerId === "default"
        )
      : allProducts;

  const certificates =
    allCertificates.filter(
      (certificate) =>
        certificate.producerId === organizationId ||
        certificate.producerId === "default"
    ).length > 0
      ? allCertificates.filter(
          (certificate) =>
            certificate.producerId === organizationId ||
            certificate.producerId === "default"
        )
      : allCertificates;

  const complianceDocs =
    allComplianceDocs.filter(
      (doc) =>
        !doc.producerId ||
        doc.producerId === organizationId ||
        doc.producerId === "default"
    ).length > 0
      ? allComplianceDocs.filter(
          (doc) =>
            !doc.producerId ||
            doc.producerId === organizationId ||
            doc.producerId === "default"
        )
      : allComplianceDocs;

  const pathways = uniqueStrings([
    ...(manualProfile?.summary?.pathways || []),
    ...plants.map((plant) => plant.pathway),
    ...products.map((product) => product.pathway),
  ]);

  const feedstocks = uniqueStrings([
    ...(manualProfile?.summary?.feedstocks || []),
    ...plants.map((plant) => plant.primaryFeedstock),
    ...products.map((product) => product.feedstock),
    ...productionBatches.map((batch) => batch.feedstockType),
  ]);

  const totalNameplateCapacityMTPerYear = plants.reduce(
    (sum, plant) => sum + (plant.annualCapacity || 0),
    0
  );

  const currentOperationalCapacityMTPerYear = plants
    .filter((plant) => plant.status === "active")
    .reduce((sum, plant) => sum + (plant.annualCapacity || 0), 0);

  const availableVolumeFromBatches = productionBatches.reduce(
    (sum, batch) => sum + (batch.availableVolume || 0),
    0
  );

  const committedVolumeMTPerYear = contracts.reduce(
    (sum, contract) => sum + (contract.totalVolume || 0),
    0
  );

  const totalExpectedAvailableVolumeMTPerYear =
    manualProfile?.summary?.totalExpectedAvailableVolumeMTPerYear ||
    (availableVolumeFromBatches > 0
      ? availableVolumeFromBatches
      : Math.max(totalNameplateCapacityMTPerYear - committedVolumeMTPerYear, 0));

  const uncommittedVolumeMTPerYear =
    manualProfile?.summary?.uncommittedVolumeMTPerYear ||
    Math.max(totalExpectedAvailableVolumeMTPerYear - committedVolumeMTPerYear, 0);

  const earliestBatchDate = minDate(productionBatches.map((batch) => batch.productionDate));
  const earliestCertifiedDate = minDate(
    certificates
      .filter((certificate) => certificate.status === "valid")
      .map((certificate) => certificate.issueDate)
  );

  const certificateSchemes = uniqueStrings(certificates.map((certificate) => certificate.certificateType));
  const productSchemes = uniqueStrings(products.flatMap((product) => product.eligibleSchemes || []));
  const allSchemes = uniqueStrings([...certificateSchemes, ...productSchemes]);

  const corsiaEligibleNow = hasAnyKeyword(allSchemes, ["corsia"]);
  const refuelEUEligibleNow = hasAnyKeyword(allSchemes, ["iscc eu", "red ii", "eu"]);
  const ukRTFOEligibleNow = hasAnyKeyword(allSchemes, ["rtfo", "uk"]);

  const firstPhysicalDeliveryDate =
    formatDate(manualProfile?.compliance?.firstPhysicalDeliveryDate) ||
    formatDate(manualProfile?.logistics?.earliestDeliveryDate) ||
    formatDate(manualProfile?.summary?.earliestDeliveryDate) ||
    earliestBatchDate || (plants.some((plant) => plant.status === "active") ? new Date().toISOString() : undefined);

  const firstComplianceEligibleDeliveryDate =
    formatDate(manualProfile?.compliance?.firstComplianceEligibleDeliveryDate) ||
    formatDate(manualProfile?.summary?.firstComplianceEligibleDeliveryDate) ||
    corsiaEligibleNow || refuelEUEligibleNow || ukRTFOEligibleNow
      ? firstPhysicalDeliveryDate || earliestCertifiedDate
      : earliestCertifiedDate;

  const deliveryReadiness: DeliveryReadiness =
    manualProfile?.summary?.deliveryReadiness ||
    manualProfile?.logistics?.deliveryReadiness ||
    firstPhysicalDeliveryDate && totalExpectedAvailableVolumeMTPerYear > 0
      ? "immediate"
      : plants.length > 0
        ? "from_date"
        : "pilot_only";

  const organizationName =
    settings?.companyName ||
    manualProfile?.legalIdentity?.displayName ||
    settings?.legalName ||
    plants[0]?.name?.split(" - ")[0] ||
    "Producer";

  const registeredLocation = splitLocation(settings?.address);

  const facilities = plants.map((plant) => {
    const plantId = String(plant._id);
    const facilityBatches = productionBatches.filter(
      (batch) => batch.plantId?.toString() === plantId
    );
    const facilityContracts = contracts.filter((contract) =>
      contract.deliveries?.some((delivery) =>
        delivery.batchIds?.some((id) => id.toString() === plantId)
      )
    );
    const averageMonthly = facilityBatches.length
      ? facilityBatches.reduce((sum, batch) => sum + (batch.availableVolume || 0), 0) / 12
      : plant.annualCapacity / 12;
    const location = splitLocation(plant.location);

    return {
      facilityId: plantId,
      facilityName: plant.name,
      city: location.city,
      stateOrRegion: location.stateOrRegion,
      country: location.country,
      pathwaysProduced: uniqueStrings([plant.pathway]),
      feedstocksUsed: uniqueStrings([plant.primaryFeedstock]),
      nameplateCapacityMTPerYear: plant.annualCapacity || 0,
      expectedAvailableVolumeMTPerYear: facilityBatches.reduce(
        (sum, batch) => sum + (batch.availableVolume || 0),
        0
      ) || plant.annualCapacity || 0,
      annualUtilizationAssumptionPercent: plant.status === "active" ? 85 : 35,
      commissioningStatus: mapPlantStatusToCommissioningStatus(plant.status),
      fidStatus: mapPlantStatusToFIDStatus(plant.status),
      currentStatusAsOfDate: formatDate(plant.updatedAt),
      minContractVolumeMT: facilityContracts.length ? Math.min(...facilityContracts.map((contract) => contract.totalVolume || 0)) : undefined,
      maxContractVolumeMT: facilityContracts.length ? Math.max(...facilityContracts.map((contract) => contract.totalVolume || 0)) : undefined,
      monthlyDeliverabilityMT: Math.round(averageMonthly),
      quarterlyDeliverabilityMT: Math.round(averageMonthly * 3),
      storageCapacityMT: facilityBatches.reduce((sum, batch) => sum + (batch.volume || 0), 0) || undefined,
      loadingModes: ["truck"],
      exportCapability: true,
    };
  });

  const feedstockProfile = feedstocks.map((feedstock) => {
    const relevantBatches = productionBatches.filter(
      (batch) => batch.feedstockType === feedstock
    );
    const origin = splitLocation(relevantBatches[0]?.feedstockOrigin);
    const securedTonnes = relevantBatches.reduce(
      (sum, batch) => sum + (batch.volume || 0),
      0
    );

    const deforestationRisk: "low" | "medium" | "high" =
      classifyFeedstockCategory(feedstock) === "crop" ? "medium" : "low";

    return {
      feedstockType: feedstock,
      category: classifyFeedstockCategory(feedstock),
      originCountry: origin.country !== "Unknown" ? origin.country : undefined,
      originRegion: origin.stateOrRegion,
      feedstockIsWasteResidue: isWasteResidue(feedstock),
      highILUCRisk: classifyFeedstockCategory(feedstock) === "crop",
      deforestationRisk,
      annualRequirementTonnes: securedTonnes || undefined,
      securedTonnes: securedTonnes || undefined,
      securedPercent: securedTonnes ? 100 : undefined,
    };
  });

  const productProfiles = products.map((product) => {
    const reduction = product.ghgReduction || 0;
    const schemes = uniqueStrings(product.eligibleSchemes || []);
    const baselineFramework: BaselineFramework = hasAnyKeyword(schemes, ["corsia"])
      ? "corsia"
      : hasAnyKeyword(schemes, ["eu", "red"])
        ? "eu_red"
        : "uk_rtfo";
    const defaultOrActual: "estimated" | "actual" = "estimated";
    const independentVerificationStatus: "not_verified" | "in_review" | "verified" =
      schemes.length ? "verified" : "not_verified";

    return {
      productName: product.name,
      pathway: product.pathway,
      feedstockType: product.feedstock,
      astmStandard: product.specifications?.astmAnnex
        ? `ASTM D7566 ${product.specifications.astmAnnex}`
        : undefined,
      maxBlendPercentage: product.specifications?.maxBlendRatio,
      bookAndClaimEligible: hasAnyKeyword(schemes, ["corsia", "iscc", "rsb"]),
      physicalDeliveryAvailable: true,
      lca: {
        methodology: schemes.length ? "scheme-backed-estimate" : "producer-estimated",
        baselineFramework,
        fossilBaselineValue: FOSSIL_BASELINE_GCO2E_PER_MJ,
        totalLifecycleValue_gCO2ePerMJ: calculateLifecycleValue(reduction),
        reductionPercentVsFossilBaseline: reduction,
        defaultOrActual,
        independentVerificationStatus,
      },
      complianceEligibility: {
        corsiaEligible: hasAnyKeyword(schemes, ["corsia"]),
        refuelEUEligible: hasAnyKeyword(schemes, ["eu", "red"]),
        ukRTFOEligible: hasAnyKeyword(schemes, ["rtfo", "uk"]),
      },
    };
  });

  const certifications = [
    ...certificates.map((certificate) => ({
      scheme: certificate.certificateType,
      scope: certificate.appliesTo?.entireCompany
        ? ("organization" as const)
        : certificate.appliesTo?.plants?.length
          ? ("facility" as const)
          : certificate.appliesTo?.products?.length
            ? ("product" as const)
            : ("organization" as const),
      status: mapCertificateStatus(certificate.status),
      certificationBody: certificate.issuingBody,
      certificateNumber: certificate.certificateNumber,
      issueDate: formatDate(certificate.issueDate),
      expiryDate: formatDate(certificate.expiryDate),
      expectedCompletionDate:
        certificate.status !== "valid" ? formatDate(certificate.expiryDate) : undefined,
      linkedFacilityId: certificate.appliesTo?.plants?.[0]?.plantId?.toString(),
      linkedProductName: certificate.appliesTo?.products?.[0]?.productName,
    })),
    ...plants.flatMap((plant) =>
      (plant.certifications || []).map((certification) => ({
        scheme: certification.name,
        scope: "facility" as const,
        status: mapCertificateStatus(certification.status),
        certificationBody: undefined,
        certificateNumber: undefined,
        issueDate: undefined,
        expiryDate: formatDate(certification.validUntil),
        expectedCompletionDate: undefined,
        linkedFacilityId: String(plant._id),
        linkedProductName: undefined,
      }))
    ),
  ];

  const supportingDocuments = [
    ...certificates.map((certificate) => ({
      documentType: "certificate",
      title: certificate.name,
      status: certificate.status,
      issueDate: formatDate(certificate.issueDate),
      expiryDate: formatDate(certificate.expiryDate),
    })),
    ...complianceDocs.map((doc) => ({
      documentType: doc.documentType,
      title: doc.title,
      status: doc.status,
      issueDate: formatDate(doc.issueDate),
      expiryDate: formatDate(doc.expiryDate),
    })),
  ];

  const firstCORSIAEligibleDeliveryDate = corsiaEligibleNow
    ? firstPhysicalDeliveryDate || earliestCertifiedDate
    : undefined;
  const firstReFuelEUEligibleDeliveryDate = refuelEUEligibleNow
    ? firstPhysicalDeliveryDate || earliestCertifiedDate
    : undefined;
  const firstUKRTFOEligibleDeliveryDate = ukRTFOEligibleNow
    ? firstPhysicalDeliveryDate || earliestCertifiedDate
    : undefined;

  const complianceTimelines = {
    firstBookAndClaimDeliveryDate:
      productProfiles.some((product) => product.bookAndClaimEligible)
        ? firstPhysicalDeliveryDate
        : undefined,
    firstPhysicalDeliveryDate,
    firstComplianceEligibleDeliveryDate,
    firstCORSIAEligibleDeliveryDate,
    firstReFuelEUEligibleDeliveryDate,
    firstUKRTFOEligibleDeliveryDate,
    proofOfSustainabilityReadinessDate: earliestCertifiedDate,
    frameworkTimelines: {
      corsia: buildFrameworkTimeline(
        corsiaEligibleNow,
        firstCORSIAEligibleDeliveryDate,
        corsiaEligibleNow ? [] : ["CORSIA-aligned certification required"]
      ),
      refuelEU: buildFrameworkTimeline(
      manualProfile?.compliance?.refuelEUEligible || refuelEUEligibleNow,
      formatDate(
        manualProfile?.compliance?.firstReFuelEUEligibleDeliveryDate
      ) || firstReFuelEUEligibleDeliveryDate,
      getStringArraySafe(
        manualProfile?.compliance?.frameworkTimelines?.refuelEU?.dependencies
      ).length
        ? getStringArraySafe(
            manualProfile?.compliance?.frameworkTimelines?.refuelEU?.dependencies
          )
        : ["EU scheme certification required"]
      ),
      ukRTFO: buildFrameworkTimeline(
        manualProfile?.compliance?.ukRTFOEligible || ukRTFOEligibleNow,
        formatDate(manualProfile?.compliance?.firstUKRTFOEligibleDeliveryDate) ||
          firstUKRTFOEligibleDeliveryDate,
        getStringArraySafe(
          manualProfile?.compliance?.frameworkTimelines?.ukRTFO?.dependencies
        ).length
          ? getStringArraySafe(
              manualProfile?.compliance?.frameworkTimelines?.ukRTFO?.dependencies
            )
          : ["UK RTFO recognition required"]
      ),
    },
  };

  const commercialStatus =
    manualProfile?.commercial?.commercialStatus ||
    uncommittedVolumeMTPerYear > 0
      ? "seeking_offtake"
      : committedVolumeMTPerYear > 0
        ? "under_negotiation"
        : "accepting_spot";

  const averageFeedstockSecured = average(
    feedstockProfile
      .map((item) => item.securedPercent)
      .filter((value): value is number => typeof value === "number")
  );

  const offtakeSecuredPercent =
    totalExpectedAvailableVolumeMTPerYear > 0
      ? Number(
          Math.min(
            (committedVolumeMTPerYear / totalExpectedAvailableVolumeMTPerYear) * 100,
            100
          ).toFixed(2)
        )
      : undefined;

  const projectStage =
    manualProfile?.projectReadiness?.projectStage ||
    mapPlantsToProjectStage(plants.map((plant) => plant.status));
  const fidStatus: FIDStatus =
    manualProfile?.projectReadiness?.fidStatus ||
    (plants.some((plant) => plant.status === "active")
      ? "achieved"
      : plants.length
        ? "targeted"
        : "not_reached");

  const headlineReductionPercent =
    average(productProfiles.map((product) => product.lca.reductionPercentVsFossilBaseline)) ||
    average(plants.map((plant) => plant.ghgReduction));

  const headlineCertificationStatus =
    certifications.find((certification) => certification.status === "certified")?.status ||
    certifications[0]?.status;

  const isCurrentlyDeliverable =
    deliveryReadiness === "immediate" && totalExpectedAvailableVolumeMTPerYear > 0;
  const isComplianceEligibleNow =
    corsiaEligibleNow || refuelEUEligibleNow || ukRTFOEligibleNow;

  const readinessScore = calculateScore([
    plants.length > 0 ? 100 : 20,
    isCurrentlyDeliverable ? 100 : 40,
    fidStatus === "achieved" ? 100 : fidStatus === "targeted" ? 60 : 20,
  ]);

  const complianceReadinessScore = calculateScore([
    isComplianceEligibleNow ? 100 : 40,
    certifications.some((certification) => certification.status === "certified") ? 100 : 40,
    firstComplianceEligibleDeliveryDate ? 90 : 20,
  ]);

  const deliveryConfidenceScore = calculateScore([
    totalExpectedAvailableVolumeMTPerYear > 0 ? 100 : 30,
    plants.some((plant) => plant.status === "active") ? 100 : 40,
    productionBatches.length > 0 ? 90 : 40,
  ]);

  const keyRisks = uniqueStrings([
    !certifications.some((certification) => certification.status === "certified")
      ? "No active certification on file"
      : undefined,
    !plants.some((plant) => plant.status === "active")
      ? "No operational facility currently marked active"
      : undefined,
    !productionBatches.length ? "No production batches logged yet" : undefined,
    !isComplianceEligibleNow ? "Compliance eligibility not yet confirmed for target frameworks" : undefined,
  ]);

  return {
    orgId: organizationId,
    legalIdentity: {
      organizationName,
      legalEntityName: settings?.legalName || organizationName,
      displayName: manualProfile?.legalIdentity?.displayName || organizationName,
      orgType:
        manualProfile?.legalIdentity?.orgType === "producer"
          ? "producer"
          : "producer",
      headquartersCountry:
        manualProfile?.legalIdentity?.headquartersCountry ||
        registeredLocation.country,
      registeredCountry:
        manualProfile?.legalIdentity?.registeredCountry ||
        registeredLocation.country,
      businessAddress:
        manualProfile?.legalIdentity?.businessAddress || settings?.address || "",
      website: manualProfile?.legalIdentity?.website || settings?.website || "",
      primaryContactName: settings?.primaryContact?.name || "",
      primaryContactEmail: settings?.primaryContact?.email || "",
      primaryContactRole:
        manualProfile?.legalIdentity?.primaryContactRole || "Primary Contact",
    },
    summary: {
      organizationName,
      pathways,
      feedstocks,
      totalNameplateCapacityMTPerYear,
      totalExpectedAvailableVolumeMTPerYear,
      currentOperationalCapacityMTPerYear:
        manualProfile?.summary?.currentOperationalCapacityMTPerYear ||
        currentOperationalCapacityMTPerYear,
      committedVolumeMTPerYear:
        manualProfile?.summary?.committedVolumeMTPerYear ||
        committedVolumeMTPerYear,
      uncommittedVolumeMTPerYear,
      earliestDeliveryDate: firstPhysicalDeliveryDate,
      firstComplianceEligibleDeliveryDate,
      deliveryReadiness,
    },
    facilities,
    feedstockProfile,
    products: productProfiles,
    certifications,
    complianceTimelines,
    commercial: {
      commercialStatus,
      availableVolumeMT:
        manualProfile?.commercial?.availableVolumeMT ||
        totalExpectedAvailableVolumeMTPerYear,
      availableFromDate:
        formatDate(manualProfile?.commercial?.availableFromDate) ||
        firstPhysicalDeliveryDate,
      pricingModel: manualProfile?.commercial?.pricingModel || "negotiable",
      contractTypesSupported:
        (manualProfile?.commercial?.contractTypesSupported as Array<
          "spot_volume" | "forward_commitment" | "offtake_agreement"
        >) || ["spot_volume", "forward_commitment", "offtake_agreement"],
    },
    logistics: {
      deliveryReadiness,
      earliestDeliveryDate:
        formatDate(manualProfile?.logistics?.earliestDeliveryDate) ||
        firstPhysicalDeliveryDate,
      deliveryRegions:
        getStringArraySafe(manualProfile?.logistics?.deliveryRegions).length > 0
          ? getStringArraySafe(manualProfile?.logistics?.deliveryRegions)
          : uniqueStrings(facilities.map((facility) => facility.stateOrRegion)),
      deliveryCountries:
        getStringArraySafe(manualProfile?.logistics?.deliveryCountries).length > 0
          ? getStringArraySafe(manualProfile?.logistics?.deliveryCountries)
          : uniqueStrings(facilities.map((facility) => facility.country)),
      bookAndClaimSupported:
        manualProfile?.commercial?.bookAndClaimSupported ??
        productProfiles.some((product) => product.bookAndClaimEligible),
      physicalDeliveryAvailable:
        manualProfile?.commercial?.physicalDeliveryAvailable ??
        productProfiles.some((product) => product.physicalDeliveryAvailable),
    },
    projectReadiness: {
      projectStage,
      fidStatus,
      feedstockSecuredPercent:
        manualProfile?.projectReadiness?.feedstockSecuredPercent ||
        averageFeedstockSecured,
      offtakeSecuredPercent:
        manualProfile?.projectReadiness?.offtakeSecuredPercent ||
        offtakeSecuredPercent,
      keyRisks:
        getStringArraySafe(manualProfile?.projectReadiness?.keyRisks).length > 0
          ? getStringArraySafe(manualProfile?.projectReadiness?.keyRisks)
          : keyRisks,
    },
    supportingDocuments,
    derived: {
      isCurrentlyDeliverable,
      isComplianceEligibleNow,
      isPreCertificationSupply: !isComplianceEligibleNow && plants.length > 0,
      earliestComplianceEligibleDate: firstComplianceEligibleDeliveryDate,
      headlineReductionPercent,
      headlinePathway: pathways[0],
      headlineFeedstock: feedstocks[0],
      headlineAvailableVolumeMT: totalExpectedAvailableVolumeMTPerYear,
      headlineCertificationStatus,
      readinessScore,
      complianceReadinessScore,
      deliveryConfidenceScore,
    },
    metadata: {
      profileVersion: "buyer-portal-v2",
      source: "producer-portal",
      generatedAt: new Date().toISOString(),
      updatedAt: maxDate([
        settings?.updatedAt,
        manualProfile?.updatedAt,
        ...plants.map((plant) => plant.updatedAt),
        ...products.map((product) => product.updatedAt),
        ...certificates.map((certificate) => certificate.updatedAt),
        ...complianceDocs.map((doc) => doc.updatedAt),
        ...productionBatches.map((batch) => batch.updatedAt),
        ...contracts.map((contract) => contract.updatedAt),
      ]),
    },
  };
}
