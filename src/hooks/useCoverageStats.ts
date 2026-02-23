"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { calculateCoverageStats } from "@/lib/geo/coverage";
import { calculateZones } from "@/lib/geo/zone-calculator";
import type { ZoneResult, CoverageStats } from "@/lib/models/types";

export function useCoverageStats(zones: ZoneResult[]): CoverageStats {
  const vertiports = useStore((s) => s.vertiports);

  return useMemo(() => {
    // Calculate baseline (5km fixed radius) for comparison
    const baselineZones = calculateZones(vertiports, "fixed-radius", {
      fixedRadiusParams: { radiusKm: 5 },
      driveTimeParams: { minutes: 15, circuityFactor: 1.3 },
      demandDensityParams: {
        baseRadiusKm: 3,
        highDemandMultiplier: 0.5,
        mediumDemandMultiplier: 1.0,
        lowDemandMultiplier: 1.5,
      },
      capacityTierParams: {
        hubLargeRadiusKm: 5,
        hubMediumRadiusKm: 3.5,
        spokeRadiusKm: 2,
        microRadiusKm: 1,
        capacityThreshold: 80,
        allowPrivateOverCapacity: true,
      },
      timeDecayParams: {
        initialRadiusKm: 5,
        years: 0,
        maxYears: 20,
        decayCurve: "linear",
      },
      hybridWeightedParams: {
        fixedWeight: 1,
        driveTimeWeight: 0,
        demandWeight: 0,
        capacityWeight: 0,
        timeDecayWeight: 0,
        fixedParams: { radiusKm: 5 },
        driveTimeParams: { minutes: 15, circuityFactor: 1.3 },
        demandParams: {
          baseRadiusKm: 3,
          highDemandMultiplier: 0.5,
          mediumDemandMultiplier: 1.0,
          lowDemandMultiplier: 1.5,
        },
        capacityParams: {
          hubLargeRadiusKm: 5,
          hubMediumRadiusKm: 3.5,
          spokeRadiusKm: 2,
          microRadiusKm: 1,
          capacityThreshold: 80,
          allowPrivateOverCapacity: true,
        },
        timeDecayParams: {
          initialRadiusKm: 5,
          years: 0,
          maxYears: 20,
          decayCurve: "linear",
        },
      },
    });

    return calculateCoverageStats(zones, baselineZones);
  }, [zones, vertiports]);
}
