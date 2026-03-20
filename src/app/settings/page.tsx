"use client";

import { useEffect, useState } from "react";

type DeliveryReadiness =
  | "immediate"
  | "from_date"
  | "precommercial"
  | "pilot_only";

type CommercialStatus =
  | "seeking_offtake"
  | "accepting_spot"
  | "accepting_forward"
  | "under_negotiation"
  | "fully_committed";

type ProjectStage =
  | "concept"
  | "development"
  | "pre_fid"
  | "post_fid"
  | "construction"
  | "commissioning"
  | "operational";

type FIDStatus = "not_reached" | "targeted" | "achieved";

interface ProducerProfileForm {
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
  legalIdentity: {
    displayName: string;
    orgType: string;
    headquartersCountry: string;
    registeredCountry: string;
    businessAddress: string;
    primaryContactRole: string;
    yearFounded: string;
    companyDescription: string;
    ownershipType: string;
    parentCompany: string;
    regionsServed: string;
  };
  summary: {
    pathways: string;
    feedstocks: string;
    targetMarkets: string;
    deliveryRegions: string;
    airportSupplyCapability: string;
    totalExpectedAvailableVolumeMTPerYear: string;
    currentOperationalCapacityMTPerYear: string;
    committedVolumeMTPerYear: string;
    uncommittedVolumeMTPerYear: string;
    earliestDeliveryDate: string;
    firstComplianceEligibleDeliveryDate: string;
    deliveryReadiness: DeliveryReadiness;
    blendLimitNotes: string;
    rampUpNotes: string;
  };
  compliance: {
    lcaMethodology: string;
    baselineFramework: "corsia" | "eu_red" | "uk_rtfo" | "";
    fossilBaselineValue: string;
    coreValue_gCO2ePerMJ: string;
    ilucValue_gCO2ePerMJ: string;
    transportValue_gCO2ePerMJ: string;
    processingValue_gCO2ePerMJ: string;
    totalLifecycleValue_gCO2ePerMJ: string;
    reductionPercentVsFossilBaseline: string;
    defaultOrActual: "estimated" | "actual" | "";
    independentVerificationStatus: "not_verified" | "in_review" | "verified" | "";
    verificationBody: string;
    verificationDate: string;
    corsiaEligible: boolean;
    refuelEUEligible: boolean;
    ukRTFOEligible: boolean;
    firstBookAndClaimDeliveryDate: string;
    firstPhysicalDeliveryDate: string;
    firstComplianceEligibleDeliveryDate: string;
    firstCORSIAEligibleDeliveryDate: string;
    firstReFuelEUEligibleDeliveryDate: string;
    firstUKRTFOEligibleDeliveryDate: string;
    chainOfCustodyReadinessDate: string;
    proofOfSustainabilityReadinessDate: string;
    safcIssuanceReadinessDate: string;
    corsiaReadinessStatus: string;
    corsiaTargetEligibilityDate: string;
    corsiaDependencies: string;
    refuelEUReadinessStatus: string;
    refuelEUTargetEligibilityDate: string;
    refuelEUDependencies: string;
    ukRTFOReadinessStatus: string;
    ukRTFOTargetEligibilityDate: string;
    ukRTFODependencies: string;
  };
  commercial: {
    commercialStatus: CommercialStatus;
    availableVolumeMT: string;
    availableFromDate: string;
    pricingModel: "fixed" | "indexed" | "negotiable" | "";
    indicativePriceMin: string;
    indicativePriceMax: string;
    currency: string;
    contractTypesSupported: string;
    preferredContractTenorMonthsMin: string;
    preferredContractTenorMonthsMax: string;
    counterpartyPreferences: string;
    bookAndClaimSupported: boolean;
    physicalDeliveryAvailable: boolean;
  };
  logistics: {
    deliveryReadiness: DeliveryReadiness;
    earliestDeliveryDate: string;
    minimumLeadTimeDays: string;
    deliveryModes: string;
    deliveryRegions: string;
    deliveryCountries: string;
    airportDeliveryCapability: string;
    marineTerminalCapability: boolean;
    storageAndBlendingCapability: boolean;
    seasonalityConstraints: string;
  };
  projectReadiness: {
    projectStage: ProjectStage;
    fidStatus: FIDStatus;
    fidDate: string;
    targetFIDDate: string;
    financialCloseStatus: string;
    financialCloseDate: string;
    debtFinancingStatus: string;
    sponsorEquityStatus: string;
    epcContractSigned: boolean;
    permitsSecuredPercent: string;
    feedstockSecuredPercent: string;
    offtakeSecuredPercent: string;
    keyRisks: string;
    majorDependencies: string;
  };
}

function emptyForm(): ProducerProfileForm {
  return {
    organizationId: "default",
    companyName: "",
    legalName: "",
    registrationNumber: "",
    vatNumber: "",
    address: "",
    website: "",
    onboardingComplete: false,
    primaryContact: { name: "", email: "", phone: "" },
    legalIdentity: {
      displayName: "",
      orgType: "producer",
      headquartersCountry: "",
      registeredCountry: "",
      businessAddress: "",
      primaryContactRole: "",
      yearFounded: "",
      companyDescription: "",
      ownershipType: "",
      parentCompany: "",
      regionsServed: "",
    },
    summary: {
      pathways: "",
      feedstocks: "",
      targetMarkets: "",
      deliveryRegions: "",
      airportSupplyCapability: "",
      totalExpectedAvailableVolumeMTPerYear: "",
      currentOperationalCapacityMTPerYear: "",
      committedVolumeMTPerYear: "",
      uncommittedVolumeMTPerYear: "",
      earliestDeliveryDate: "",
      firstComplianceEligibleDeliveryDate: "",
      deliveryReadiness: "from_date",
      blendLimitNotes: "",
      rampUpNotes: "",
    },
    compliance: {
      lcaMethodology: "",
      baselineFramework: "",
      fossilBaselineValue: "",
      coreValue_gCO2ePerMJ: "",
      ilucValue_gCO2ePerMJ: "",
      transportValue_gCO2ePerMJ: "",
      processingValue_gCO2ePerMJ: "",
      totalLifecycleValue_gCO2ePerMJ: "",
      reductionPercentVsFossilBaseline: "",
      defaultOrActual: "",
      independentVerificationStatus: "",
      verificationBody: "",
      verificationDate: "",
      corsiaEligible: false,
      refuelEUEligible: false,
      ukRTFOEligible: false,
      firstBookAndClaimDeliveryDate: "",
      firstPhysicalDeliveryDate: "",
      firstComplianceEligibleDeliveryDate: "",
      firstCORSIAEligibleDeliveryDate: "",
      firstReFuelEUEligibleDeliveryDate: "",
      firstUKRTFOEligibleDeliveryDate: "",
      chainOfCustodyReadinessDate: "",
      proofOfSustainabilityReadinessDate: "",
      safcIssuanceReadinessDate: "",
      corsiaReadinessStatus: "",
      corsiaTargetEligibilityDate: "",
      corsiaDependencies: "",
      refuelEUReadinessStatus: "",
      refuelEUTargetEligibilityDate: "",
      refuelEUDependencies: "",
      ukRTFOReadinessStatus: "",
      ukRTFOTargetEligibilityDate: "",
      ukRTFODependencies: "",
    },
    commercial: {
      commercialStatus: "seeking_offtake",
      availableVolumeMT: "",
      availableFromDate: "",
      pricingModel: "negotiable",
      indicativePriceMin: "",
      indicativePriceMax: "",
      currency: "USD",
      contractTypesSupported: "spot_volume, forward_commitment, offtake_agreement",
      preferredContractTenorMonthsMin: "",
      preferredContractTenorMonthsMax: "",
      counterpartyPreferences: "",
      bookAndClaimSupported: false,
      physicalDeliveryAvailable: true,
    },
    logistics: {
      deliveryReadiness: "from_date",
      earliestDeliveryDate: "",
      minimumLeadTimeDays: "",
      deliveryModes: "",
      deliveryRegions: "",
      deliveryCountries: "",
      airportDeliveryCapability: "",
      marineTerminalCapability: false,
      storageAndBlendingCapability: false,
      seasonalityConstraints: "",
    },
    projectReadiness: {
      projectStage: "development",
      fidStatus: "targeted",
      fidDate: "",
      targetFIDDate: "",
      financialCloseStatus: "",
      financialCloseDate: "",
      debtFinancingStatus: "",
      sponsorEquityStatus: "",
      epcContractSigned: false,
      permitsSecuredPercent: "",
      feedstockSecuredPercent: "",
      offtakeSecuredPercent: "",
      keyRisks: "",
      majorDependencies: "",
    },
  };
}

function csvToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function numOrUndefined(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function dateOnly(value?: string | null) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function SettingsPage() {
  const [form, setForm] = useState<ProducerProfileForm>(emptyForm());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch("/api/producer-profile");
        if (!response.ok) {
          throw new Error("Failed to fetch producer profile");
        }
        const data = await response.json();
        setForm({
          organizationId: data.organizationId || "default",
          companyName: data.companyName || "",
          legalName: data.legalName || "",
          registrationNumber: data.registrationNumber || "",
          vatNumber: data.vatNumber || "",
          address: data.address || "",
          website: data.website || "",
          onboardingComplete: Boolean(data.onboardingComplete),
          primaryContact: {
            name: data.primaryContact?.name || "",
            email: data.primaryContact?.email || "",
            phone: data.primaryContact?.phone || "",
          },
          legalIdentity: {
            displayName: data.legalIdentity?.displayName || "",
            orgType: data.legalIdentity?.orgType || "producer",
            headquartersCountry: data.legalIdentity?.headquartersCountry || "",
            registeredCountry: data.legalIdentity?.registeredCountry || "",
            businessAddress: data.legalIdentity?.businessAddress || "",
            primaryContactRole: data.legalIdentity?.primaryContactRole || "",
            yearFounded: data.legalIdentity?.yearFounded
              ? String(data.legalIdentity.yearFounded)
              : "",
            companyDescription: data.legalIdentity?.companyDescription || "",
            ownershipType: data.legalIdentity?.ownershipType || "",
            parentCompany: data.legalIdentity?.parentCompany || "",
            regionsServed: (data.legalIdentity?.regionsServed || []).join(", "),
          },
          summary: {
            pathways: (data.summary?.pathways || []).join(", "),
            feedstocks: (data.summary?.feedstocks || []).join(", "),
            targetMarkets: (data.summary?.targetMarkets || []).join(", "),
            deliveryRegions: (data.summary?.deliveryRegions || []).join(", "),
            airportSupplyCapability: (data.summary?.airportSupplyCapability || []).join(", "),
            totalExpectedAvailableVolumeMTPerYear: data.summary?.totalExpectedAvailableVolumeMTPerYear
              ? String(data.summary.totalExpectedAvailableVolumeMTPerYear)
              : "",
            currentOperationalCapacityMTPerYear: data.summary?.currentOperationalCapacityMTPerYear
              ? String(data.summary.currentOperationalCapacityMTPerYear)
              : "",
            committedVolumeMTPerYear: data.summary?.committedVolumeMTPerYear
              ? String(data.summary.committedVolumeMTPerYear)
              : "",
            uncommittedVolumeMTPerYear: data.summary?.uncommittedVolumeMTPerYear
              ? String(data.summary.uncommittedVolumeMTPerYear)
              : "",
            earliestDeliveryDate: dateOnly(data.summary?.earliestDeliveryDate),
            firstComplianceEligibleDeliveryDate: dateOnly(
              data.summary?.firstComplianceEligibleDeliveryDate
            ),
            deliveryReadiness: data.summary?.deliveryReadiness || "from_date",
            blendLimitNotes: data.summary?.blendLimitNotes || "",
            rampUpNotes: data.summary?.rampUpNotes || "",
          },
          compliance: {
            lcaMethodology: data.compliance?.lcaMethodology || "",
            baselineFramework: data.compliance?.baselineFramework || "",
            fossilBaselineValue: data.compliance?.fossilBaselineValue
              ? String(data.compliance.fossilBaselineValue)
              : "",
            coreValue_gCO2ePerMJ: data.compliance?.coreValue_gCO2ePerMJ
              ? String(data.compliance.coreValue_gCO2ePerMJ)
              : "",
            ilucValue_gCO2ePerMJ: data.compliance?.ilucValue_gCO2ePerMJ
              ? String(data.compliance.ilucValue_gCO2ePerMJ)
              : "",
            transportValue_gCO2ePerMJ: data.compliance?.transportValue_gCO2ePerMJ
              ? String(data.compliance.transportValue_gCO2ePerMJ)
              : "",
            processingValue_gCO2ePerMJ: data.compliance?.processingValue_gCO2ePerMJ
              ? String(data.compliance.processingValue_gCO2ePerMJ)
              : "",
            totalLifecycleValue_gCO2ePerMJ: data.compliance?.totalLifecycleValue_gCO2ePerMJ
              ? String(data.compliance.totalLifecycleValue_gCO2ePerMJ)
              : "",
            reductionPercentVsFossilBaseline:
              data.compliance?.reductionPercentVsFossilBaseline
                ? String(data.compliance.reductionPercentVsFossilBaseline)
                : "",
            defaultOrActual: data.compliance?.defaultOrActual || "",
            independentVerificationStatus:
              data.compliance?.independentVerificationStatus || "",
            verificationBody: data.compliance?.verificationBody || "",
            verificationDate: dateOnly(data.compliance?.verificationDate),
            corsiaEligible: Boolean(data.compliance?.corsiaEligible),
            refuelEUEligible: Boolean(data.compliance?.refuelEUEligible),
            ukRTFOEligible: Boolean(data.compliance?.ukRTFOEligible),
            firstBookAndClaimDeliveryDate: dateOnly(
              data.compliance?.firstBookAndClaimDeliveryDate
            ),
            firstPhysicalDeliveryDate: dateOnly(
              data.compliance?.firstPhysicalDeliveryDate
            ),
            firstComplianceEligibleDeliveryDate: dateOnly(
              data.compliance?.firstComplianceEligibleDeliveryDate
            ),
            firstCORSIAEligibleDeliveryDate: dateOnly(
              data.compliance?.firstCORSIAEligibleDeliveryDate
            ),
            firstReFuelEUEligibleDeliveryDate: dateOnly(
              data.compliance?.firstReFuelEUEligibleDeliveryDate
            ),
            firstUKRTFOEligibleDeliveryDate: dateOnly(
              data.compliance?.firstUKRTFOEligibleDeliveryDate
            ),
            chainOfCustodyReadinessDate: dateOnly(
              data.compliance?.chainOfCustodyReadinessDate
            ),
            proofOfSustainabilityReadinessDate: dateOnly(
              data.compliance?.proofOfSustainabilityReadinessDate
            ),
            safcIssuanceReadinessDate: dateOnly(
              data.compliance?.safcIssuanceReadinessDate
            ),
            corsiaReadinessStatus:
              data.compliance?.frameworkTimelines?.corsia?.readinessStatus || "",
            corsiaTargetEligibilityDate: dateOnly(
              data.compliance?.frameworkTimelines?.corsia?.targetEligibilityDate
            ),
            corsiaDependencies: (
              data.compliance?.frameworkTimelines?.corsia?.dependencies || []
            ).join(", "),
            refuelEUReadinessStatus:
              data.compliance?.frameworkTimelines?.refuelEU?.readinessStatus || "",
            refuelEUTargetEligibilityDate: dateOnly(
              data.compliance?.frameworkTimelines?.refuelEU?.targetEligibilityDate
            ),
            refuelEUDependencies: (
              data.compliance?.frameworkTimelines?.refuelEU?.dependencies || []
            ).join(", "),
            ukRTFOReadinessStatus:
              data.compliance?.frameworkTimelines?.ukRTFO?.readinessStatus || "",
            ukRTFOTargetEligibilityDate: dateOnly(
              data.compliance?.frameworkTimelines?.ukRTFO?.targetEligibilityDate
            ),
            ukRTFODependencies: (
              data.compliance?.frameworkTimelines?.ukRTFO?.dependencies || []
            ).join(", "),
          },
          commercial: {
            commercialStatus: data.commercial?.commercialStatus || "seeking_offtake",
            availableVolumeMT: data.commercial?.availableVolumeMT
              ? String(data.commercial.availableVolumeMT)
              : "",
            availableFromDate: dateOnly(data.commercial?.availableFromDate),
            pricingModel: data.commercial?.pricingModel || "negotiable",
            indicativePriceMin: data.commercial?.indicativePriceMin
              ? String(data.commercial.indicativePriceMin)
              : "",
            indicativePriceMax: data.commercial?.indicativePriceMax
              ? String(data.commercial.indicativePriceMax)
              : "",
            currency: data.commercial?.currency || "USD",
            contractTypesSupported: (
              data.commercial?.contractTypesSupported || []
            ).join(", "),
            preferredContractTenorMonthsMin:
              data.commercial?.preferredContractTenorMonthsMin
                ? String(data.commercial.preferredContractTenorMonthsMin)
                : "",
            preferredContractTenorMonthsMax:
              data.commercial?.preferredContractTenorMonthsMax
                ? String(data.commercial.preferredContractTenorMonthsMax)
                : "",
            counterpartyPreferences: data.commercial?.counterpartyPreferences || "",
            bookAndClaimSupported: Boolean(data.commercial?.bookAndClaimSupported),
            physicalDeliveryAvailable:
              data.commercial?.physicalDeliveryAvailable !== false,
          },
          logistics: {
            deliveryReadiness: data.logistics?.deliveryReadiness || "from_date",
            earliestDeliveryDate: dateOnly(data.logistics?.earliestDeliveryDate),
            minimumLeadTimeDays: data.logistics?.minimumLeadTimeDays
              ? String(data.logistics.minimumLeadTimeDays)
              : "",
            deliveryModes: (data.logistics?.deliveryModes || []).join(", "),
            deliveryRegions: (data.logistics?.deliveryRegions || []).join(", "),
            deliveryCountries: (data.logistics?.deliveryCountries || []).join(", "),
            airportDeliveryCapability: (
              data.logistics?.airportDeliveryCapability || []
            ).join(", "),
            marineTerminalCapability: Boolean(
              data.logistics?.marineTerminalCapability
            ),
            storageAndBlendingCapability: Boolean(
              data.logistics?.storageAndBlendingCapability
            ),
            seasonalityConstraints: (
              data.logistics?.seasonalityConstraints || []
            ).join(", "),
          },
          projectReadiness: {
            projectStage: data.projectReadiness?.projectStage || "development",
            fidStatus: data.projectReadiness?.fidStatus || "targeted",
            fidDate: dateOnly(data.projectReadiness?.fidDate),
            targetFIDDate: dateOnly(data.projectReadiness?.targetFIDDate),
            financialCloseStatus: data.projectReadiness?.financialCloseStatus || "",
            financialCloseDate: dateOnly(data.projectReadiness?.financialCloseDate),
            debtFinancingStatus:
              data.projectReadiness?.debtFinancingStatus || "",
            sponsorEquityStatus:
              data.projectReadiness?.sponsorEquityStatus || "",
            epcContractSigned: Boolean(data.projectReadiness?.epcContractSigned),
            permitsSecuredPercent:
              data.projectReadiness?.permitsSecuredPercent
                ? String(data.projectReadiness.permitsSecuredPercent)
                : "",
            feedstockSecuredPercent:
              data.projectReadiness?.feedstockSecuredPercent
                ? String(data.projectReadiness.feedstockSecuredPercent)
                : "",
            offtakeSecuredPercent:
              data.projectReadiness?.offtakeSecuredPercent
                ? String(data.projectReadiness.offtakeSecuredPercent)
                : "",
            keyRisks: (data.projectReadiness?.keyRisks || []).join(", "),
            majorDependencies: (
              data.projectReadiness?.majorDependencies || []
            ).join(", "),
          },
        });
      } catch (error) {
        console.error("Failed to fetch producer profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, []);

  function updateSection<K extends keyof ProducerProfileForm>(
    section: K,
    field: keyof ProducerProfileForm[K],
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [section]: {
        ...(current[section] as object),
        [field]: value,
      },
    }));
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const payload = {
        organizationId: form.organizationId,
        companyName: form.companyName,
        legalName: form.legalName,
        registrationNumber: form.registrationNumber,
        vatNumber: form.vatNumber,
        address: form.address,
        website: form.website,
        onboardingComplete: form.onboardingComplete,
        primaryContact: form.primaryContact,
        legalIdentity: {
          ...form.legalIdentity,
          yearFounded: numOrUndefined(form.legalIdentity.yearFounded),
          regionsServed: csvToArray(form.legalIdentity.regionsServed),
          businessAddress: form.legalIdentity.businessAddress || form.address,
          website: form.website,
        },
        summary: {
          ...form.summary,
          pathways: csvToArray(form.summary.pathways),
          feedstocks: csvToArray(form.summary.feedstocks),
          targetMarkets: csvToArray(form.summary.targetMarkets),
          deliveryRegions: csvToArray(form.summary.deliveryRegions),
          airportSupplyCapability: csvToArray(form.summary.airportSupplyCapability),
          totalExpectedAvailableVolumeMTPerYear: numOrUndefined(
            form.summary.totalExpectedAvailableVolumeMTPerYear
          ),
          currentOperationalCapacityMTPerYear: numOrUndefined(
            form.summary.currentOperationalCapacityMTPerYear
          ),
          committedVolumeMTPerYear: numOrUndefined(
            form.summary.committedVolumeMTPerYear
          ),
          uncommittedVolumeMTPerYear: numOrUndefined(
            form.summary.uncommittedVolumeMTPerYear
          ),
        },
        compliance: {
          ...form.compliance,
          fossilBaselineValue: numOrUndefined(form.compliance.fossilBaselineValue),
          coreValue_gCO2ePerMJ: numOrUndefined(form.compliance.coreValue_gCO2ePerMJ),
          ilucValue_gCO2ePerMJ: numOrUndefined(form.compliance.ilucValue_gCO2ePerMJ),
          transportValue_gCO2ePerMJ: numOrUndefined(
            form.compliance.transportValue_gCO2ePerMJ
          ),
          processingValue_gCO2ePerMJ: numOrUndefined(
            form.compliance.processingValue_gCO2ePerMJ
          ),
          totalLifecycleValue_gCO2ePerMJ: numOrUndefined(
            form.compliance.totalLifecycleValue_gCO2ePerMJ
          ),
          reductionPercentVsFossilBaseline: numOrUndefined(
            form.compliance.reductionPercentVsFossilBaseline
          ),
          frameworkTimelines: {
            corsia: {
              readinessStatus: form.compliance.corsiaReadinessStatus,
              targetEligibilityDate: form.compliance.corsiaTargetEligibilityDate,
              dependencies: csvToArray(form.compliance.corsiaDependencies),
            },
            refuelEU: {
              readinessStatus: form.compliance.refuelEUReadinessStatus,
              targetEligibilityDate: form.compliance.refuelEUTargetEligibilityDate,
              dependencies: csvToArray(form.compliance.refuelEUDependencies),
            },
            ukRTFO: {
              readinessStatus: form.compliance.ukRTFOReadinessStatus,
              targetEligibilityDate: form.compliance.ukRTFOTargetEligibilityDate,
              dependencies: csvToArray(form.compliance.ukRTFODependencies),
            },
          },
        },
        commercial: {
          ...form.commercial,
          availableVolumeMT: numOrUndefined(form.commercial.availableVolumeMT),
          indicativePriceMin: numOrUndefined(form.commercial.indicativePriceMin),
          indicativePriceMax: numOrUndefined(form.commercial.indicativePriceMax),
          contractTypesSupported: csvToArray(form.commercial.contractTypesSupported),
          preferredContractTenorMonthsMin: numOrUndefined(
            form.commercial.preferredContractTenorMonthsMin
          ),
          preferredContractTenorMonthsMax: numOrUndefined(
            form.commercial.preferredContractTenorMonthsMax
          ),
        },
        logistics: {
          ...form.logistics,
          minimumLeadTimeDays: numOrUndefined(form.logistics.minimumLeadTimeDays),
          deliveryModes: csvToArray(form.logistics.deliveryModes),
          deliveryRegions: csvToArray(form.logistics.deliveryRegions),
          deliveryCountries: csvToArray(form.logistics.deliveryCountries),
          airportDeliveryCapability: csvToArray(
            form.logistics.airportDeliveryCapability
          ),
          seasonalityConstraints: csvToArray(form.logistics.seasonalityConstraints),
        },
        projectReadiness: {
          ...form.projectReadiness,
          permitsSecuredPercent: numOrUndefined(
            form.projectReadiness.permitsSecuredPercent
          ),
          feedstockSecuredPercent: numOrUndefined(
            form.projectReadiness.feedstockSecuredPercent
          ),
          offtakeSecuredPercent: numOrUndefined(
            form.projectReadiness.offtakeSecuredPercent
          ),
          keyRisks: csvToArray(form.projectReadiness.keyRisks),
          majorDependencies: csvToArray(form.projectReadiness.majorDependencies),
        },
      };

      const response = await fetch("/api/producer-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save producer profile");
      }

      setSaveMessage({
        type: data.webhookSync?.success === false ? "error" : "success",
        text:
          data.webhookSync?.success === false
            ? "Profile saved, but buyer portal sync failed."
            : "Producer profile saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save producer profile:", error);
      setSaveMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Failed to save producer profile.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const sectionClass = "rounded-xl border border-[#e5e5e5] bg-white p-6 shadow-sm";
  const inputClass =
    "mt-1.5 rounded-lg border border-[#c9c9c9] px-3 py-2.5 text-sm";

  return (
    <div className="flex flex-col gap-6">
      <div className={sectionClass}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#181818]">Producer Profile Settings</h1>
            <p className="mt-1 text-base text-[#706e6b]">
              Configure the organization, commercial, compliance, logistics, and
              project-readiness information shared with the buyer portal.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#181818]">
              <input
                type="checkbox"
                checked={form.onboardingComplete}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    onboardingComplete: e.target.checked,
                  }))
                }
              />
              Onboarding complete
            </label>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="rounded-lg bg-[#0176d3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#014486] disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Producer Profile"}
            </button>
          </div>
        </div>
        {saveMessage && (
          <div
            className={`mt-4 rounded-lg px-4 py-3 text-sm font-medium ${
              saveMessage.type === "success"
                ? "bg-[#e8f5e9] text-[#2e844a]"
                : "bg-[#ffebee] text-[#c62828]"
            }`}
          >
            {saveMessage.text}
          </div>
        )}
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#181818]">Legal Identity</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Company Name
            <input className={inputClass} value={form.companyName} onChange={(e) => setForm((c) => ({ ...c, companyName: e.target.value }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Legal Name
            <input className={inputClass} value={form.legalName} onChange={(e) => setForm((c) => ({ ...c, legalName: e.target.value }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Display Name
            <input className={inputClass} value={form.legalIdentity.displayName} onChange={(e) => updateSection("legalIdentity", "displayName", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Organization Type
            <select className={inputClass} value={form.legalIdentity.orgType} onChange={(e) => updateSection("legalIdentity", "orgType", e.target.value)}>
              <option value="producer">Producer</option>
              <option value="trader">Trader</option>
              <option value="aggregator">Aggregator</option>
              <option value="producer_trader">Producer + Trader</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Registration Number
            <input className={inputClass} value={form.registrationNumber} onChange={(e) => setForm((c) => ({ ...c, registrationNumber: e.target.value }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            VAT Number
            <input className={inputClass} value={form.vatNumber} onChange={(e) => setForm((c) => ({ ...c, vatNumber: e.target.value }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Headquarters Country
            <input className={inputClass} value={form.legalIdentity.headquartersCountry} onChange={(e) => updateSection("legalIdentity", "headquartersCountry", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Registered Country
            <input className={inputClass} value={form.legalIdentity.registeredCountry} onChange={(e) => updateSection("legalIdentity", "registeredCountry", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Registered Address
            <input className={inputClass} value={form.address} onChange={(e) => setForm((c) => ({ ...c, address: e.target.value }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Website
            <input className={inputClass} value={form.website} onChange={(e) => setForm((c) => ({ ...c, website: e.target.value }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Primary Contact Role
            <input className={inputClass} value={form.legalIdentity.primaryContactRole} onChange={(e) => updateSection("legalIdentity", "primaryContactRole", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Primary Contact Name
            <input className={inputClass} value={form.primaryContact.name} onChange={(e) => setForm((c) => ({ ...c, primaryContact: { ...c.primaryContact, name: e.target.value } }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Primary Contact Email
            <input className={inputClass} value={form.primaryContact.email} onChange={(e) => setForm((c) => ({ ...c, primaryContact: { ...c.primaryContact, email: e.target.value } }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Primary Contact Phone
            <input className={inputClass} value={form.primaryContact.phone} onChange={(e) => setForm((c) => ({ ...c, primaryContact: { ...c.primaryContact, phone: e.target.value } }))} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Year Founded
            <input className={inputClass} value={form.legalIdentity.yearFounded} onChange={(e) => updateSection("legalIdentity", "yearFounded", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Ownership Type
            <input className={inputClass} value={form.legalIdentity.ownershipType} onChange={(e) => updateSection("legalIdentity", "ownershipType", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Parent Company
            <input className={inputClass} value={form.legalIdentity.parentCompany} onChange={(e) => updateSection("legalIdentity", "parentCompany", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Regions Served
            <input className={inputClass} value={form.legalIdentity.regionsServed} onChange={(e) => updateSection("legalIdentity", "regionsServed", e.target.value)} placeholder="Europe, UK, Middle East" />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Company Description
            <textarea className={inputClass} rows={4} value={form.legalIdentity.companyDescription} onChange={(e) => updateSection("legalIdentity", "companyDescription", e.target.value)} />
          </label>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#181818]">Production Summary</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Pathways
            <input className={inputClass} value={form.summary.pathways} onChange={(e) => updateSection("summary", "pathways", e.target.value)} placeholder="HEFA, ATJ, PtL" />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Feedstocks
            <input className={inputClass} value={form.summary.feedstocks} onChange={(e) => updateSection("summary", "feedstocks", e.target.value)} placeholder="UCO, Tallow, Ethanol" />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Target Markets
            <input className={inputClass} value={form.summary.targetMarkets} onChange={(e) => updateSection("summary", "targetMarkets", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Airport Supply Capability
            <input className={inputClass} value={form.summary.airportSupplyCapability} onChange={(e) => updateSection("summary", "airportSupplyCapability", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Expected Available Volume MT/Yr
            <input className={inputClass} value={form.summary.totalExpectedAvailableVolumeMTPerYear} onChange={(e) => updateSection("summary", "totalExpectedAvailableVolumeMTPerYear", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Current Operational Capacity MT/Yr
            <input className={inputClass} value={form.summary.currentOperationalCapacityMTPerYear} onChange={(e) => updateSection("summary", "currentOperationalCapacityMTPerYear", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Committed Volume MT/Yr
            <input className={inputClass} value={form.summary.committedVolumeMTPerYear} onChange={(e) => updateSection("summary", "committedVolumeMTPerYear", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Uncommitted Volume MT/Yr
            <input className={inputClass} value={form.summary.uncommittedVolumeMTPerYear} onChange={(e) => updateSection("summary", "uncommittedVolumeMTPerYear", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Earliest Delivery Date
            <input type="date" className={inputClass} value={form.summary.earliestDeliveryDate} onChange={(e) => updateSection("summary", "earliestDeliveryDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            First Compliance-Eligible Delivery Date
            <input type="date" className={inputClass} value={form.summary.firstComplianceEligibleDeliveryDate} onChange={(e) => updateSection("summary", "firstComplianceEligibleDeliveryDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Delivery Readiness
            <select className={inputClass} value={form.summary.deliveryReadiness} onChange={(e) => updateSection("summary", "deliveryReadiness", e.target.value)}>
              <option value="immediate">Immediate</option>
              <option value="from_date">From Date</option>
              <option value="precommercial">Precommercial</option>
              <option value="pilot_only">Pilot Only</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Blend Limit Notes
            <textarea className={inputClass} rows={3} value={form.summary.blendLimitNotes} onChange={(e) => updateSection("summary", "blendLimitNotes", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Ramp-up Notes
            <textarea className={inputClass} rows={3} value={form.summary.rampUpNotes} onChange={(e) => updateSection("summary", "rampUpNotes", e.target.value)} />
          </label>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#181818]">Compliance & GHG</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            LCA Methodology
            <input className={inputClass} value={form.compliance.lcaMethodology} onChange={(e) => updateSection("compliance", "lcaMethodology", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Baseline Framework
            <select className={inputClass} value={form.compliance.baselineFramework} onChange={(e) => updateSection("compliance", "baselineFramework", e.target.value)}>
              <option value="">Select</option>
              <option value="corsia">CORSIA</option>
              <option value="eu_red">EU RED</option>
              <option value="uk_rtfo">UK RTFO</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Fossil Baseline Value
            <input className={inputClass} value={form.compliance.fossilBaselineValue} onChange={(e) => updateSection("compliance", "fossilBaselineValue", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Total Lifecycle Value gCO2e/MJ
            <input className={inputClass} value={form.compliance.totalLifecycleValue_gCO2ePerMJ} onChange={(e) => updateSection("compliance", "totalLifecycleValue_gCO2ePerMJ", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Core Value gCO2e/MJ
            <input className={inputClass} value={form.compliance.coreValue_gCO2ePerMJ} onChange={(e) => updateSection("compliance", "coreValue_gCO2ePerMJ", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            ILUC Value gCO2e/MJ
            <input className={inputClass} value={form.compliance.ilucValue_gCO2ePerMJ} onChange={(e) => updateSection("compliance", "ilucValue_gCO2ePerMJ", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Transport Value gCO2e/MJ
            <input className={inputClass} value={form.compliance.transportValue_gCO2ePerMJ} onChange={(e) => updateSection("compliance", "transportValue_gCO2ePerMJ", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Processing Value gCO2e/MJ
            <input className={inputClass} value={form.compliance.processingValue_gCO2ePerMJ} onChange={(e) => updateSection("compliance", "processingValue_gCO2ePerMJ", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Reduction % vs Fossil Baseline
            <input className={inputClass} value={form.compliance.reductionPercentVsFossilBaseline} onChange={(e) => updateSection("compliance", "reductionPercentVsFossilBaseline", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Default or Actual
            <select className={inputClass} value={form.compliance.defaultOrActual} onChange={(e) => updateSection("compliance", "defaultOrActual", e.target.value)}>
              <option value="">Select</option>
              <option value="estimated">Estimated</option>
              <option value="actual">Actual</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Verification Status
            <select className={inputClass} value={form.compliance.independentVerificationStatus} onChange={(e) => updateSection("compliance", "independentVerificationStatus", e.target.value)}>
              <option value="">Select</option>
              <option value="not_verified">Not Verified</option>
              <option value="in_review">In Review</option>
              <option value="verified">Verified</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Verification Body
            <input className={inputClass} value={form.compliance.verificationBody} onChange={(e) => updateSection("compliance", "verificationBody", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Verification Date
            <input type="date" className={inputClass} value={form.compliance.verificationDate} onChange={(e) => updateSection("compliance", "verificationDate", e.target.value)} />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-4 text-sm text-[#181818]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.compliance.corsiaEligible} onChange={(e) => updateSection("compliance", "corsiaEligible", e.target.checked)} /> CORSIA Eligible</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.compliance.refuelEUEligible} onChange={(e) => updateSection("compliance", "refuelEUEligible", e.target.checked)} /> ReFuelEU Eligible</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.compliance.ukRTFOEligible} onChange={(e) => updateSection("compliance", "ukRTFOEligible", e.target.checked)} /> UK RTFO Eligible</label>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#181818]">Commercial & Logistics</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Commercial Status
            <select className={inputClass} value={form.commercial.commercialStatus} onChange={(e) => updateSection("commercial", "commercialStatus", e.target.value)}>
              <option value="seeking_offtake">Seeking Offtake</option>
              <option value="accepting_spot">Accepting Spot</option>
              <option value="accepting_forward">Accepting Forward</option>
              <option value="under_negotiation">Under Negotiation</option>
              <option value="fully_committed">Fully Committed</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Pricing Model
            <select className={inputClass} value={form.commercial.pricingModel} onChange={(e) => updateSection("commercial", "pricingModel", e.target.value)}>
              <option value="">Select</option>
              <option value="fixed">Fixed</option>
              <option value="indexed">Indexed</option>
              <option value="negotiable">Negotiable</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Available Volume MT
            <input className={inputClass} value={form.commercial.availableVolumeMT} onChange={(e) => updateSection("commercial", "availableVolumeMT", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Available From Date
            <input type="date" className={inputClass} value={form.commercial.availableFromDate} onChange={(e) => updateSection("commercial", "availableFromDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Indicative Price Min
            <input className={inputClass} value={form.commercial.indicativePriceMin} onChange={(e) => updateSection("commercial", "indicativePriceMin", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Indicative Price Max
            <input className={inputClass} value={form.commercial.indicativePriceMax} onChange={(e) => updateSection("commercial", "indicativePriceMax", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Currency
            <input className={inputClass} value={form.commercial.currency} onChange={(e) => updateSection("commercial", "currency", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Contract Types Supported
            <input className={inputClass} value={form.commercial.contractTypesSupported} onChange={(e) => updateSection("commercial", "contractTypesSupported", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Min Tenor Months
            <input className={inputClass} value={form.commercial.preferredContractTenorMonthsMin} onChange={(e) => updateSection("commercial", "preferredContractTenorMonthsMin", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Max Tenor Months
            <input className={inputClass} value={form.commercial.preferredContractTenorMonthsMax} onChange={(e) => updateSection("commercial", "preferredContractTenorMonthsMax", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Counterparty Preferences
            <textarea className={inputClass} rows={3} value={form.commercial.counterpartyPreferences} onChange={(e) => updateSection("commercial", "counterpartyPreferences", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Delivery Modes
            <input className={inputClass} value={form.logistics.deliveryModes} onChange={(e) => updateSection("logistics", "deliveryModes", e.target.value)} placeholder="truck, rail, marine" />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Delivery Countries
            <input className={inputClass} value={form.logistics.deliveryCountries} onChange={(e) => updateSection("logistics", "deliveryCountries", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Delivery Regions
            <input className={inputClass} value={form.logistics.deliveryRegions} onChange={(e) => updateSection("logistics", "deliveryRegions", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Airport Delivery Capability
            <input className={inputClass} value={form.logistics.airportDeliveryCapability} onChange={(e) => updateSection("logistics", "airportDeliveryCapability", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Earliest Logistics Delivery Date
            <input type="date" className={inputClass} value={form.logistics.earliestDeliveryDate} onChange={(e) => updateSection("logistics", "earliestDeliveryDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Minimum Lead Time Days
            <input className={inputClass} value={form.logistics.minimumLeadTimeDays} onChange={(e) => updateSection("logistics", "minimumLeadTimeDays", e.target.value)} />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-4 text-sm text-[#181818]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.commercial.bookAndClaimSupported} onChange={(e) => updateSection("commercial", "bookAndClaimSupported", e.target.checked)} /> Book-and-claim supported</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.commercial.physicalDeliveryAvailable} onChange={(e) => updateSection("commercial", "physicalDeliveryAvailable", e.target.checked)} /> Physical delivery available</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.logistics.marineTerminalCapability} onChange={(e) => updateSection("logistics", "marineTerminalCapability", e.target.checked)} /> Marine terminal capability</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.logistics.storageAndBlendingCapability} onChange={(e) => updateSection("logistics", "storageAndBlendingCapability", e.target.checked)} /> Storage and blending capability</label>
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <h2 className="text-lg font-bold text-[#181818]">Project Readiness</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Project Stage
            <select className={inputClass} value={form.projectReadiness.projectStage} onChange={(e) => updateSection("projectReadiness", "projectStage", e.target.value)}>
              <option value="concept">Concept</option>
              <option value="development">Development</option>
              <option value="pre_fid">Pre-FID</option>
              <option value="post_fid">Post-FID</option>
              <option value="construction">Construction</option>
              <option value="commissioning">Commissioning</option>
              <option value="operational">Operational</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            FID Status
            <select className={inputClass} value={form.projectReadiness.fidStatus} onChange={(e) => updateSection("projectReadiness", "fidStatus", e.target.value)}>
              <option value="not_reached">Not Reached</option>
              <option value="targeted">Targeted</option>
              <option value="achieved">Achieved</option>
            </select>
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            FID Date
            <input type="date" className={inputClass} value={form.projectReadiness.fidDate} onChange={(e) => updateSection("projectReadiness", "fidDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Target FID Date
            <input type="date" className={inputClass} value={form.projectReadiness.targetFIDDate} onChange={(e) => updateSection("projectReadiness", "targetFIDDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Financial Close Status
            <input className={inputClass} value={form.projectReadiness.financialCloseStatus} onChange={(e) => updateSection("projectReadiness", "financialCloseStatus", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Financial Close Date
            <input type="date" className={inputClass} value={form.projectReadiness.financialCloseDate} onChange={(e) => updateSection("projectReadiness", "financialCloseDate", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Debt Financing Status
            <input className={inputClass} value={form.projectReadiness.debtFinancingStatus} onChange={(e) => updateSection("projectReadiness", "debtFinancingStatus", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Sponsor Equity Status
            <input className={inputClass} value={form.projectReadiness.sponsorEquityStatus} onChange={(e) => updateSection("projectReadiness", "sponsorEquityStatus", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Permits Secured %
            <input className={inputClass} value={form.projectReadiness.permitsSecuredPercent} onChange={(e) => updateSection("projectReadiness", "permitsSecuredPercent", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Feedstock Secured %
            <input className={inputClass} value={form.projectReadiness.feedstockSecuredPercent} onChange={(e) => updateSection("projectReadiness", "feedstockSecuredPercent", e.target.value)} />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c]">
            Offtake Secured %
            <input className={inputClass} value={form.projectReadiness.offtakeSecuredPercent} onChange={(e) => updateSection("projectReadiness", "offtakeSecuredPercent", e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm text-[#181818]">
            <input type="checkbox" checked={form.projectReadiness.epcContractSigned} onChange={(e) => updateSection("projectReadiness", "epcContractSigned", e.target.checked)} />
            EPC contract signed
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Key Risks
            <textarea className={inputClass} rows={3} value={form.projectReadiness.keyRisks} onChange={(e) => updateSection("projectReadiness", "keyRisks", e.target.value)} placeholder="No active certification, construction timeline risk" />
          </label>
          <label className="flex flex-col text-sm font-medium text-[#3e3e3c] md:col-span-2">
            Major Dependencies
            <textarea className={inputClass} rows={3} value={form.projectReadiness.majorDependencies} onChange={(e) => updateSection("projectReadiness", "majorDependencies", e.target.value)} placeholder="Feedstock contracts, utility connection, project finance" />
          </label>
        </div>
      </div>
    </div>
  );
}

















