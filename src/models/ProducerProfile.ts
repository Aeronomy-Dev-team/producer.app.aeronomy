import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProducerProfile extends Document {
  organizationId: string;
  legalIdentity: {
    displayName?: string;
    orgType?: "producer" | "trader" | "aggregator" | "producer_trader";
    headquartersCountry?: string;
    registeredCountry?: string;
    businessAddress?: string;
    website?: string;
    primaryContactRole?: string;
    yearFounded?: number;
    companyDescription?: string;
    ownershipType?: string;
    parentCompany?: string;
    regionsServed?: string[];
  };
  summary: {
    pathways?: string[];
    feedstocks?: string[];
    targetMarkets?: string[];
    deliveryRegions?: string[];
    airportSupplyCapability?: string[];
    totalExpectedAvailableVolumeMTPerYear?: number;
    currentOperationalCapacityMTPerYear?: number;
    committedVolumeMTPerYear?: number;
    uncommittedVolumeMTPerYear?: number;
    earliestDeliveryDate?: Date;
    firstComplianceEligibleDeliveryDate?: Date;
    deliveryReadiness?: "immediate" | "from_date" | "precommercial" | "pilot_only";
    blendLimitNotes?: string;
    rampUpNotes?: string;
  };
  compliance: {
    lcaMethodology?: string;
    baselineFramework?: "corsia" | "eu_red" | "uk_rtfo";
    fossilBaselineValue?: number;
    coreValue_gCO2ePerMJ?: number;
    ilucValue_gCO2ePerMJ?: number;
    transportValue_gCO2ePerMJ?: number;
    processingValue_gCO2ePerMJ?: number;
    totalLifecycleValue_gCO2ePerMJ?: number;
    reductionPercentVsFossilBaseline?: number;
    defaultOrActual?: "estimated" | "actual";
    independentVerificationStatus?: "not_verified" | "in_review" | "verified";
    verificationBody?: string;
    verificationDate?: Date;
    corsiaEligible?: boolean;
    refuelEUEligible?: boolean;
    ukRTFOEligible?: boolean;
    firstBookAndClaimDeliveryDate?: Date;
    firstPhysicalDeliveryDate?: Date;
    firstComplianceEligibleDeliveryDate?: Date;
    firstCORSIAEligibleDeliveryDate?: Date;
    firstReFuelEUEligibleDeliveryDate?: Date;
    firstUKRTFOEligibleDeliveryDate?: Date;
    chainOfCustodyReadinessDate?: Date;
    proofOfSustainabilityReadinessDate?: Date;
    safcIssuanceReadinessDate?: Date;
    frameworkTimelines?: {
      corsia?: {
        readinessStatus?: string;
        targetEligibilityDate?: Date;
        dependencies?: string[];
      };
      refuelEU?: {
        readinessStatus?: string;
        targetEligibilityDate?: Date;
        dependencies?: string[];
      };
      ukRTFO?: {
        readinessStatus?: string;
        targetEligibilityDate?: Date;
        dependencies?: string[];
      };
    };
  };
  commercial: {
    commercialStatus?:
      | "seeking_offtake"
      | "accepting_spot"
      | "accepting_forward"
      | "under_negotiation"
      | "fully_committed";
    availableVolumeMT?: number;
    availableFromDate?: Date;
    pricingModel?: "fixed" | "indexed" | "negotiable";
    indicativePriceMin?: number;
    indicativePriceMax?: number;
    currency?: string;
    contractTypesSupported?: string[];
    preferredContractTenorMonthsMin?: number;
    preferredContractTenorMonthsMax?: number;
    counterpartyPreferences?: string;
    bookAndClaimSupported?: boolean;
    physicalDeliveryAvailable?: boolean;
  };
  logistics: {
    deliveryReadiness?: "immediate" | "from_date" | "precommercial" | "pilot_only";
    earliestDeliveryDate?: Date;
    minimumLeadTimeDays?: number;
    deliveryModes?: string[];
    deliveryRegions?: string[];
    deliveryCountries?: string[];
    airportDeliveryCapability?: string[];
    marineTerminalCapability?: boolean;
    storageAndBlendingCapability?: boolean;
    seasonalityConstraints?: string[];
  };
  projectReadiness: {
    projectStage?:
      | "concept"
      | "development"
      | "pre_fid"
      | "post_fid"
      | "construction"
      | "commissioning"
      | "operational";
    fidStatus?: "not_reached" | "targeted" | "achieved";
    fidDate?: Date;
    targetFIDDate?: Date;
    financialCloseStatus?: string;
    financialCloseDate?: Date;
    debtFinancingStatus?: string;
    sponsorEquityStatus?: string;
    epcContractSigned?: boolean;
    permitsSecuredPercent?: number;
    feedstockSecuredPercent?: number;
    offtakeSecuredPercent?: number;
    keyRisks?: string[];
    majorDependencies?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const timelineSchema = new Schema(
  {
    readinessStatus: { type: String, default: "" },
    targetEligibilityDate: { type: Date },
    dependencies: { type: [String], default: [] },
  },
  { _id: false }
);

const ProducerProfileSchema = new Schema<IProducerProfile>(
  {
    organizationId: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    legalIdentity: {
      displayName: { type: String, default: "" },
      orgType: {
        type: String,
        enum: ["producer", "trader", "aggregator", "producer_trader"],
        default: "producer",
      },
      headquartersCountry: { type: String, default: "" },
      registeredCountry: { type: String, default: "" },
      businessAddress: { type: String, default: "" },
      website: { type: String, default: "" },
      primaryContactRole: { type: String, default: "" },
      yearFounded: { type: Number },
      companyDescription: { type: String, default: "" },
      ownershipType: { type: String, default: "" },
      parentCompany: { type: String, default: "" },
      regionsServed: { type: [String], default: [] },
    },
    summary: {
      pathways: { type: [String], default: [] },
      feedstocks: { type: [String], default: [] },
      targetMarkets: { type: [String], default: [] },
      deliveryRegions: { type: [String], default: [] },
      airportSupplyCapability: { type: [String], default: [] },
      totalExpectedAvailableVolumeMTPerYear: { type: Number },
      currentOperationalCapacityMTPerYear: { type: Number },
      committedVolumeMTPerYear: { type: Number },
      uncommittedVolumeMTPerYear: { type: Number },
      earliestDeliveryDate: { type: Date },
      firstComplianceEligibleDeliveryDate: { type: Date },
      deliveryReadiness: {
        type: String,
        enum: ["immediate", "from_date", "precommercial", "pilot_only"],
      },
      blendLimitNotes: { type: String, default: "" },
      rampUpNotes: { type: String, default: "" },
    },
    compliance: {
      lcaMethodology: { type: String, default: "" },
      baselineFramework: {
        type: String,
        enum: ["corsia", "eu_red", "uk_rtfo"],
      },
      fossilBaselineValue: { type: Number },
      coreValue_gCO2ePerMJ: { type: Number },
      ilucValue_gCO2ePerMJ: { type: Number },
      transportValue_gCO2ePerMJ: { type: Number },
      processingValue_gCO2ePerMJ: { type: Number },
      totalLifecycleValue_gCO2ePerMJ: { type: Number },
      reductionPercentVsFossilBaseline: { type: Number },
      defaultOrActual: {
        type: String,
        enum: ["estimated", "actual"],
      },
      independentVerificationStatus: {
        type: String,
        enum: ["not_verified", "in_review", "verified"],
      },
      verificationBody: { type: String, default: "" },
      verificationDate: { type: Date },
      corsiaEligible: { type: Boolean, default: false },
      refuelEUEligible: { type: Boolean, default: false },
      ukRTFOEligible: { type: Boolean, default: false },
      firstBookAndClaimDeliveryDate: { type: Date },
      firstPhysicalDeliveryDate: { type: Date },
      firstComplianceEligibleDeliveryDate: { type: Date },
      firstCORSIAEligibleDeliveryDate: { type: Date },
      firstReFuelEUEligibleDeliveryDate: { type: Date },
      firstUKRTFOEligibleDeliveryDate: { type: Date },
      chainOfCustodyReadinessDate: { type: Date },
      proofOfSustainabilityReadinessDate: { type: Date },
      safcIssuanceReadinessDate: { type: Date },
      frameworkTimelines: {
        corsia: { type: timelineSchema, default: () => ({}) },
        refuelEU: { type: timelineSchema, default: () => ({}) },
        ukRTFO: { type: timelineSchema, default: () => ({}) },
      },
    },
    commercial: {
      commercialStatus: {
        type: String,
        enum: [
          "seeking_offtake",
          "accepting_spot",
          "accepting_forward",
          "under_negotiation",
          "fully_committed",
        ],
      },
      availableVolumeMT: { type: Number },
      availableFromDate: { type: Date },
      pricingModel: {
        type: String,
        enum: ["fixed", "indexed", "negotiable"],
      },
      indicativePriceMin: { type: Number },
      indicativePriceMax: { type: Number },
      currency: { type: String, default: "" },
      contractTypesSupported: { type: [String], default: [] },
      preferredContractTenorMonthsMin: { type: Number },
      preferredContractTenorMonthsMax: { type: Number },
      counterpartyPreferences: { type: String, default: "" },
      bookAndClaimSupported: { type: Boolean, default: false },
      physicalDeliveryAvailable: { type: Boolean, default: true },
    },
    logistics: {
      deliveryReadiness: {
        type: String,
        enum: ["immediate", "from_date", "precommercial", "pilot_only"],
      },
      earliestDeliveryDate: { type: Date },
      minimumLeadTimeDays: { type: Number },
      deliveryModes: { type: [String], default: [] },
      deliveryRegions: { type: [String], default: [] },
      deliveryCountries: { type: [String], default: [] },
      airportDeliveryCapability: { type: [String], default: [] },
      marineTerminalCapability: { type: Boolean, default: false },
      storageAndBlendingCapability: { type: Boolean, default: false },
      seasonalityConstraints: { type: [String], default: [] },
    },
    projectReadiness: {
      projectStage: {
        type: String,
        enum: [
          "concept",
          "development",
          "pre_fid",
          "post_fid",
          "construction",
          "commissioning",
          "operational",
        ],
      },
      fidStatus: {
        type: String,
        enum: ["not_reached", "targeted", "achieved"],
      },
      fidDate: { type: Date },
      targetFIDDate: { type: Date },
      financialCloseStatus: { type: String, default: "" },
      financialCloseDate: { type: Date },
      debtFinancingStatus: { type: String, default: "" },
      sponsorEquityStatus: { type: String, default: "" },
      epcContractSigned: { type: Boolean, default: false },
      permitsSecuredPercent: { type: Number },
      feedstockSecuredPercent: { type: Number },
      offtakeSecuredPercent: { type: Number },
      keyRisks: { type: [String], default: [] },
      majorDependencies: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

const ProducerProfile: Model<IProducerProfile> =
  mongoose.models.ProducerProfile ||
  mongoose.model<IProducerProfile>("ProducerProfile", ProducerProfileSchema);

export default ProducerProfile;
