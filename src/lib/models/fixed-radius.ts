import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { Vertiport, FixedRadiusParams, ZoneResult } from "./types";

export function calculateFixedRadius(
  vertiport: Vertiport,
  params: FixedRadiusParams
): ZoneResult {
  const center = turf.point([vertiport.lng, vertiport.lat]);
  const buffered = turf.buffer(center, params.radiusKm, { units: "kilometers" });

  return {
    vertiportId: vertiport.id,
    polygon: buffered as Feature<Polygon>,
    exclusivityLevel: "full",
    effectiveRadiusKm: params.radiusKm,
  };
}
