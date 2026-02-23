import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { Vertiport, TimeDecayParams, ZoneResult, ExclusivityLevel } from "./types";

function getDecayFactor(years: number, maxYears: number, curve: string): number {
  if (years >= maxYears) return 0;
  const t = years / maxYears;

  switch (curve) {
    case "linear":
      return 1 - t;
    case "exponential":
      return Math.exp(-3 * t); // Fast initial decay
    case "stepped":
      // 5-year steps: 100%, 75%, 50%, 25%, 0%
      if (t < 0.25) return 1.0;
      if (t < 0.5) return 0.75;
      if (t < 0.75) return 0.5;
      return 0.25;
    default:
      return 1 - t;
  }
}

export function calculateTimeDecay(
  vertiport: Vertiport,
  params: TimeDecayParams
): ZoneResult {
  const decayFactor = getDecayFactor(params.years, params.maxYears, params.decayCurve);
  const effectiveRadius = params.initialRadiusKm * decayFactor;

  if (effectiveRadius < 0.1) {
    return {
      vertiportId: vertiport.id,
      polygon: null,
      exclusivityLevel: "none",
      effectiveRadiusKm: 0,
    };
  }

  const center = turf.point([vertiport.lng, vertiport.lat]);
  const buffered = turf.buffer(center, effectiveRadius, { units: "kilometers" });

  // Determine exclusivity level based on decay progress
  let exclusivityLevel: ExclusivityLevel = "full";
  if (decayFactor < 0.3) exclusivityLevel = "none";
  else if (decayFactor < 0.7) exclusivityLevel = "conditional";

  return {
    vertiportId: vertiport.id,
    polygon: buffered as Feature<Polygon>,
    exclusivityLevel,
    effectiveRadiusKm: effectiveRadius,
  };
}
