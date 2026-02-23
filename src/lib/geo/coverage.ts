import * as turf from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import type { ZoneResult, CoverageStats } from "@/lib/models/types";
import { cityBoundary, CITY_AREA_KM2 } from "@/lib/data/city-boundary";

// Merge all zone polygons into a single union
function unionZones(zones: ZoneResult[]): Feature<Polygon | MultiPolygon> | null {
  const validPolygons = zones
    .filter((z) => z.polygon !== null)
    .map((z) => z.polygon!);

  // Also include conditional rings
  const conditionalRings = zones
    .filter((z) => z.conditionalRing != null)
    .map((z) => z.conditionalRing!);

  const allPolygons = [...validPolygons, ...conditionalRings];

  if (allPolygons.length === 0) return null;
  if (allPolygons.length === 1) return allPolygons[0];

  try {
    let merged = allPolygons[0];
    for (let i = 1; i < allPolygons.length; i++) {
      const result = turf.union(
        turf.featureCollection([merged, allPolygons[i]])
      );
      if (result) merged = result as Feature<Polygon | MultiPolygon>;
    }
    return merged;
  } catch {
    return allPolygons[0];
  }
}

// Generate a grid of potential private vertiport sites across the city
function generateSiteGrid(boundary: Feature<Polygon>, spacingKm: number = 1): [number, number][] {
  const bbox = turf.bbox(boundary);
  const grid = turf.pointGrid(bbox, spacingKm, { units: "kilometers" });

  // Filter to only points within the city boundary
  return grid.features
    .filter((pt) => turf.booleanPointInPolygon(pt, boundary))
    .map((pt) => pt.geometry.coordinates as [number, number]);
}

export function calculateCoverageStats(
  zones: ZoneResult[],
  baselineZones?: ZoneResult[]
): CoverageStats {
  const union = unionZones(zones);

  if (!union) {
    return {
      totalExclusiveAreaKm2: 0,
      cityAreaKm2: CITY_AREA_KM2,
      coveragePercent: 0,
      potentialSitesTotal: 0,
      potentialSitesBlocked: 0,
      potentialSitesAllowed: 0,
      comparisonVsBaseline: -100,
    };
  }

  // Calculate total exclusive area
  const totalArea = turf.area(union) / 1_000_000; // m2 to km2

  // Intersect with city boundary for coverage %
  let cityOverlap = 0;
  try {
    const intersection = turf.intersect(
      turf.featureCollection([union, cityBoundary])
    );
    if (intersection) {
      cityOverlap = turf.area(intersection) / 1_000_000;
    }
  } catch {
    cityOverlap = Math.min(totalArea, CITY_AREA_KM2);
  }

  const coveragePercent = (cityOverlap / CITY_AREA_KM2) * 100;

  // Grid-based private site estimation
  const sites = generateSiteGrid(cityBoundary, 1);
  const sitesTotal = sites.length;
  let sitesBlocked = 0;

  for (const site of sites) {
    const pt = turf.point(site);
    try {
      if (turf.booleanPointInPolygon(pt, union)) {
        sitesBlocked++;
      }
    } catch {
      // Skip problematic geometries
    }
  }

  // Baseline comparison (5km fixed radius default)
  let comparisonVsBaseline = 0;
  if (baselineZones) {
    const baselineUnion = unionZones(baselineZones);
    if (baselineUnion) {
      const baselineArea = turf.area(baselineUnion) / 1_000_000;
      comparisonVsBaseline = baselineArea > 0
        ? ((totalArea - baselineArea) / baselineArea) * 100
        : 0;
    }
  }

  return {
    totalExclusiveAreaKm2: Math.round(totalArea * 10) / 10,
    cityAreaKm2: CITY_AREA_KM2,
    coveragePercent: Math.min(Math.round(coveragePercent * 10) / 10, 100),
    potentialSitesTotal: sitesTotal,
    potentialSitesBlocked: sitesBlocked,
    potentialSitesAllowed: sitesTotal - sitesBlocked,
    comparisonVsBaseline: Math.round(comparisonVsBaseline),
  };
}
