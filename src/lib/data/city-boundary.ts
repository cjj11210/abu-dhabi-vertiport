import type { Feature, Polygon } from "geojson";
import * as turf from "@turf/turf";

// Abu Dhabi urban area boundary — covers the main island, Saadiyat, Yas, Jubail,
// Reem, and the mainland corridor south to MBZ City / Khalifa City.
// Traced to follow the actual coastline and urban extent more closely.
export const cityBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: { name: "Abu Dhabi Urban Area" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        // SW — Hudayriyat Island south
        [54.295, 24.390],
        // W coast — Hudayriyat west
        [54.270, 24.410],
        // NW — Al Bateen coast
        [54.290, 24.440],
        // Corniche west
        [54.305, 24.460],
        // Corniche NW
        [54.320, 24.475],
        // Corniche north
        [54.340, 24.488],
        // N — breakwater / marina
        [54.355, 24.495],
        // Al Reem Island west
        [54.375, 24.505],
        // Al Reem Island north
        [54.400, 24.510],
        // Saadiyat bridge
        [54.420, 24.520],
        // Saadiyat west
        [54.435, 24.540],
        // Saadiyat north coast
        [54.450, 24.555],
        // Saadiyat NE
        [54.480, 24.560],
        // Jubail Island NW
        [54.500, 24.555],
        // Jubail Island NE
        [54.530, 24.545],
        // Between Jubail and Yas
        [54.555, 24.530],
        // Yas Island NW
        [54.580, 24.510],
        // Yas Island north
        [54.600, 24.500],
        // Yas Island NE
        [54.625, 24.490],
        // East of Yas — toward airport
        [54.650, 24.480],
        // Airport NE
        [54.680, 24.470],
        // East boundary
        [54.700, 24.450],
        // Airport SE
        [54.690, 24.420],
        // South of airport
        [54.670, 24.395],
        // Khalifa City east
        [54.630, 24.370],
        // MBZ City east
        [54.580, 24.345],
        // MBZ City south
        [54.550, 24.335],
        // Musaffah east
        [54.520, 24.340],
        // Musaffah
        [54.490, 24.355],
        // South central
        [54.460, 24.370],
        // ADNEC south
        [54.430, 24.380],
        // Al Bateen south
        [54.400, 24.385],
        // SW approach
        [54.360, 24.385],
        // Hudayriyat south
        [54.330, 24.388],
        // Close polygon
        [54.295, 24.390],
      ],
    ],
  },
};

// Compute the actual area from the polygon (in km²)
export const CITY_AREA_KM2 = Math.round(turf.area(cityBoundary) / 1_000_000 * 10) / 10;

// Metro area boundary (~600 km2) - much larger, includes surrounding development
export const metroBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: { name: "Abu Dhabi Metro Area" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [54.1500, 24.3000],
        [54.1500, 24.6000],
        [54.8000, 24.6000],
        [54.8000, 24.3000],
        [54.1500, 24.3000],
      ],
    ],
  },
};

// Water body approximation (Persian Gulf to the north) - used for clipping drive-time zones
export const waterBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: { name: "Persian Gulf (clip zone)" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [54.0000, 24.5800],
        [54.0000, 25.0000],
        [55.0000, 25.0000],
        [55.0000, 24.5800],
        [54.2400, 24.4600],
        [54.2800, 24.4800],
        [54.3200, 24.5100],
        [54.3800, 24.5200],
        [54.4400, 24.5600],
        [54.5000, 24.5800],
        [54.5500, 24.5500],
        [54.6000, 24.5200],
        [54.6500, 24.5100],
        [54.7000, 24.4900],
        [54.7500, 24.4800],
        [55.0000, 24.5800],
        [54.0000, 24.5800],
      ],
    ],
  },
};

// Land-only mask (inverse of water) - rough bounding box minus water
export const landBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: { name: "Abu Dhabi Land Area" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [54.0000, 24.2000],
        [55.0000, 24.2000],
        [55.0000, 24.5800],
        [54.7500, 24.4800],
        [54.7000, 24.4900],
        [54.6500, 24.5100],
        [54.6000, 24.5200],
        [54.5500, 24.5500],
        [54.5000, 24.5800],
        [54.4400, 24.5600],
        [54.3800, 24.5200],
        [54.3200, 24.5100],
        [54.2800, 24.4800],
        [54.2400, 24.4600],
        [54.0000, 24.5800],
        [54.0000, 24.2000],
      ],
    ],
  },
};

export const METRO_AREA_KM2 = 600;
