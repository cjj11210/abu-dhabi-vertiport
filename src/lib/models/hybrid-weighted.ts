import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { Vertiport, HybridWeightedParams, ZoneResult } from "./types";
import { calculateFixedRadius } from "./fixed-radius";
import { calculateDriveTime } from "./drive-time";
import { calculateDemandDensity } from "./demand-density";
import { calculateCapacityTier } from "./capacity-tier";
import { calculateTimeDecay } from "./time-decay";

export function calculateHybridWeighted(
  vertiport: Vertiport,
  params: HybridWeightedParams
): ZoneResult {
  // Calculate effective radius from each model
  const fixedResult = calculateFixedRadius(vertiport, params.fixedParams);
  const driveTimeResult = calculateDriveTime(vertiport, params.driveTimeParams);
  const demandResult = calculateDemandDensity(vertiport, params.demandParams);
  const capacityResult = calculateCapacityTier(vertiport, params.capacityParams);
  const timeDecayResult = calculateTimeDecay(vertiport, params.timeDecayParams);

  // Weighted average of effective radii
  const totalWeight =
    params.fixedWeight +
    params.driveTimeWeight +
    params.demandWeight +
    params.capacityWeight +
    params.timeDecayWeight;

  if (totalWeight === 0) {
    return {
      vertiportId: vertiport.id,
      polygon: null,
      exclusivityLevel: "none",
      effectiveRadiusKm: 0,
    };
  }

  const weightedRadius =
    (fixedResult.effectiveRadiusKm * params.fixedWeight +
      driveTimeResult.effectiveRadiusKm * params.driveTimeWeight +
      demandResult.effectiveRadiusKm * params.demandWeight +
      capacityResult.effectiveRadiusKm * params.capacityWeight +
      timeDecayResult.effectiveRadiusKm * params.timeDecayWeight) /
    totalWeight;

  if (weightedRadius < 0.1) {
    return {
      vertiportId: vertiport.id,
      polygon: null,
      exclusivityLevel: "none",
      effectiveRadiusKm: 0,
    };
  }

  const center = turf.point([vertiport.lng, vertiport.lat]);
  const buffered = turf.buffer(center, weightedRadius, { units: "kilometers" });

  return {
    vertiportId: vertiport.id,
    polygon: buffered as Feature<Polygon>,
    exclusivityLevel: weightedRadius > 3 ? "full" : "conditional",
    effectiveRadiusKm: weightedRadius,
  };
}

// Get individual model contributions for radar chart
export function getModelContributions(
  vertiport: Vertiport,
  params: HybridWeightedParams
): { model: string; radius: number; weight: number }[] {
  const fixedResult = calculateFixedRadius(vertiport, params.fixedParams);
  const driveTimeResult = calculateDriveTime(vertiport, params.driveTimeParams);
  const demandResult = calculateDemandDensity(vertiport, params.demandParams);
  const capacityResult = calculateCapacityTier(vertiport, params.capacityParams);
  const timeDecayResult = calculateTimeDecay(vertiport, params.timeDecayParams);

  return [
    { model: "Fixed", radius: fixedResult.effectiveRadiusKm, weight: params.fixedWeight },
    { model: "Drive-Time", radius: driveTimeResult.effectiveRadiusKm, weight: params.driveTimeWeight },
    { model: "Demand", radius: demandResult.effectiveRadiusKm, weight: params.demandWeight },
    { model: "Capacity", radius: capacityResult.effectiveRadiusKm, weight: params.capacityWeight },
    { model: "Time-Decay", radius: timeDecayResult.effectiveRadiusKm, weight: params.timeDecayWeight },
  ];
}
