import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { Vertiport, DemandDensityParams, ZoneResult, ExclusivityLevel } from "./types";

export function calculateDemandDensity(
  vertiport: Vertiport,
  params: DemandDensityParams
): ZoneResult {
  const multiplierMap: Record<string, number> = {
    high: params.highDemandMultiplier,
    medium: params.mediumDemandMultiplier,
    low: params.lowDemandMultiplier,
  };

  const multiplier = multiplierMap[vertiport.demand] || 1.0;
  const effectiveRadius = params.baseRadiusKm * multiplier;

  const center = turf.point([vertiport.lng, vertiport.lat]);
  const buffered = turf.buffer(center, effectiveRadius, { units: "kilometers" });

  // High demand = conditional (competition OK), Low demand = full exclusivity
  const exclusivityLevel: ExclusivityLevel =
    vertiport.demand === "high" ? "conditional" : "full";

  return {
    vertiportId: vertiport.id,
    polygon: buffered as Feature<Polygon>,
    exclusivityLevel,
    effectiveRadiusKm: effectiveRadius,
  };
}
