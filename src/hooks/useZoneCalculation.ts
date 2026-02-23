"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { calculateZones } from "@/lib/geo/zone-calculator";
import type { ZoneResult } from "@/lib/models/types";

export function useZoneCalculation(): ZoneResult[] {
  const vertiports = useStore((s) => s.vertiports);
  const activeModel = useStore((s) => s.activeModel);
  const fixedRadiusParams = useStore((s) => s.fixedRadiusParams);
  const driveTimeParams = useStore((s) => s.driveTimeParams);
  const demandDensityParams = useStore((s) => s.demandDensityParams);
  const capacityTierParams = useStore((s) => s.capacityTierParams);
  const timeDecayParams = useStore((s) => s.timeDecayParams);
  const hybridWeightedParams = useStore((s) => s.hybridWeightedParams);

  return useMemo(() => {
    return calculateZones(vertiports, activeModel, {
      fixedRadiusParams,
      driveTimeParams,
      demandDensityParams,
      capacityTierParams,
      timeDecayParams,
      hybridWeightedParams,
    });
  }, [
    vertiports,
    activeModel,
    fixedRadiusParams,
    driveTimeParams,
    demandDensityParams,
    capacityTierParams,
    timeDecayParams,
    hybridWeightedParams,
  ]);
}
