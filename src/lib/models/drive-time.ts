import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { Vertiport, DriveTimeParams, ZoneResult } from "./types";
import { speedProfiles } from "@/lib/data/vertiports";
import { landBoundary } from "@/lib/data/city-boundary";

// Generate a perturbed isochrone polygon to simulate road network irregularity
function generateIsochrone(
  center: [number, number], // [lng, lat]
  baseRadiusKm: number,
  circuityFactor: number,
  category: string
): Feature<Polygon> {
  const numPoints = 36;
  const coords: [number, number][] = [];

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 360;
    const angleRad = (angle * Math.PI) / 180;

    // Base effective radius adjusted for circuity
    let effectiveRadius = baseRadiusKm / circuityFactor;

    // Directional modifiers
    // North (toward Gulf): reduce by 40% (water penalty)
    if (angle > 315 || angle < 45) {
      effectiveRadius *= 0.6;
    }
    // East-West (E11 highway axis): bonus 20%
    if ((angle > 75 && angle < 105) || (angle > 255 && angle < 285)) {
      effectiveRadius *= 1.2;
    }

    // Random perturbation for organic shape (seeded by angle for consistency)
    const perturbation = 0.85 + 0.3 * Math.abs(Math.sin(angle * 7.3 + center[0] * 100));
    effectiveRadius *= perturbation;

    // Category-based adjustments
    if (category === "urban-core" || category === "urban") {
      effectiveRadius *= 0.85; // Dense streets = slower
    } else if (category === "remote") {
      effectiveRadius *= 1.3; // Open roads = faster
    }

    const dest = turf.destination(
      turf.point(center),
      effectiveRadius,
      angle,
      { units: "kilometers" }
    );

    coords.push(dest.geometry.coordinates as [number, number]);
  }

  // Close the polygon
  coords.push(coords[0]);

  return turf.polygon([coords]) as Feature<Polygon>;
}

export function calculateDriveTime(
  vertiport: Vertiport,
  params: DriveTimeParams
): ZoneResult {
  const speed = speedProfiles[vertiport.category] || 40;
  const baseRadiusKm = (speed * params.minutes) / 60;

  const isochrone = generateIsochrone(
    [vertiport.lng, vertiport.lat],
    baseRadiusKm,
    params.circuityFactor,
    vertiport.category
  );

  // Clip to land (intersect with land boundary)
  let clipped: Feature<Polygon> | null = null;
  try {
    const intersection = turf.intersect(
      turf.featureCollection([isochrone, landBoundary])
    );
    if (intersection) {
      clipped = intersection as Feature<Polygon>;
    }
  } catch {
    clipped = isochrone; // Fallback to unclipped if intersection fails
  }

  return {
    vertiportId: vertiport.id,
    polygon: clipped || isochrone,
    exclusivityLevel: "full",
    effectiveRadiusKm: baseRadiusKm / params.circuityFactor,
  };
}
