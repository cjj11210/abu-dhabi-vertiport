"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { calculateZones } from "@/lib/geo/zone-calculator";
import type { MapLocation } from "@/lib/data/layers/types";
import type { Vertiport, ZoneResult, VertiportCategory, DemandLevel, CapacityClass } from "@/lib/models/types";

// Default vertiport properties for each layer type when computing zones
const layerDefaults: Record<string, { category: VertiportCategory; demand: DemandLevel; capacity: CapacityClass }> = {
  ncth: { category: "suburban", demand: "medium", capacity: "spoke" },
  heliport: { category: "urban", demand: "medium", capacity: "spoke" },
  helipad: { category: "urban", demand: "low", capacity: "micro" },
};

function toVirtualVertiport(loc: MapLocation): Vertiport {
  const defaults = layerDefaults[loc.layerType] || layerDefaults.heliport;
  return {
    id: loc.id,
    name: loc.name,
    lat: loc.lat,
    lng: loc.lng,
    category: defaults.category,
    demand: defaults.demand,
    capacity: defaults.capacity,
    enabled: loc.enabled,
  };
}

export function useLayerZoneCalculation(
  locations: MapLocation[],
  layerVisible: boolean
): ZoneResult[] {
  const activeModel = useStore((s) => s.activeModel);
  const fixedRadiusParams = useStore((s) => s.fixedRadiusParams);
  const driveTimeParams = useStore((s) => s.driveTimeParams);
  const demandDensityParams = useStore((s) => s.demandDensityParams);
  const capacityTierParams = useStore((s) => s.capacityTierParams);
  const timeDecayParams = useStore((s) => s.timeDecayParams);
  const hybridWeightedParams = useStore((s) => s.hybridWeightedParams);

  return useMemo(() => {
    if (!layerVisible) return [];
    const virtualVertiports = locations.map(toVirtualVertiport);
    return calculateZones(virtualVertiports, activeModel, {
      fixedRadiusParams,
      driveTimeParams,
      demandDensityParams,
      capacityTierParams,
      timeDecayParams,
      hybridWeightedParams,
    });
  }, [
    locations,
    layerVisible,
    activeModel,
    fixedRadiusParams,
    driveTimeParams,
    demandDensityParams,
    capacityTierParams,
    timeDecayParams,
    hybridWeightedParams,
  ]);
}
