import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { Vertiport, CapacityTierParams, ZoneResult } from "./types";

export function calculateCapacityTier(
  vertiport: Vertiport,
  params: CapacityTierParams
): ZoneResult {
  const radiusMap: Record<string, number> = {
    "hub-large": params.hubLargeRadiusKm,
    "hub-medium": params.hubMediumRadiusKm,
    spoke: params.spokeRadiusKm,
    micro: params.microRadiusKm,
  };

  const radius = radiusMap[vertiport.capacity] || 2;
  const center = turf.point([vertiport.lng, vertiport.lat]);
  const fullZone = turf.buffer(center, radius, { units: "kilometers" });

  let conditionalRing: Feature<Polygon> | null = null;

  if (params.allowPrivateOverCapacity) {
    // Inner core = full exclusivity (threshold % of radius)
    const coreRadius = radius * (params.capacityThreshold / 100);
    const coreZone = turf.buffer(center, coreRadius, { units: "kilometers" });

    // Outer ring = conditional (private allowed when over capacity)
    try {
      const ring = turf.difference(
        turf.featureCollection([fullZone as Feature<Polygon>, coreZone as Feature<Polygon>])
      );
      conditionalRing = ring as Feature<Polygon>;
    } catch {
      conditionalRing = null;
    }

    return {
      vertiportId: vertiport.id,
      polygon: coreZone as Feature<Polygon>,
      exclusivityLevel: "full",
      effectiveRadiusKm: coreRadius,
      conditionalRing,
    };
  }

  return {
    vertiportId: vertiport.id,
    polygon: fullZone as Feature<Polygon>,
    exclusivityLevel: "full",
    effectiveRadiusKm: radius,
  };
}
