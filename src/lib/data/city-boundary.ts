import type { Feature, Polygon } from "geojson";

// Abu Dhabi city proper boundary (approximate polygon covering the main island and near-shore)
// This covers ~87 km2 of the main urban area
export const cityBoundary: Feature<Polygon> = {
  type: "Feature",
  properties: { name: "Abu Dhabi City Proper" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [54.2600, 24.3800], // SW - south of Hudayriyat
        [54.2700, 24.4100], // W coast
        [54.2500, 24.4300], // Hudayriyat west
        [54.2400, 24.4500], // NW tip
        [54.2800, 24.4700], // Corniche west
        [54.3000, 24.4900], // Corniche NW
        [54.3200, 24.5000], // Corniche north
        [54.3500, 24.5100], // N coast
        [54.3800, 24.5150], // N toward Saadiyat
        [54.4100, 24.5200], // Saadiyat approach
        [54.4400, 24.5500], // Saadiyat north
        [54.4700, 24.5600], // Saadiyat NE
        [54.5000, 24.5700], // NE Jubail area
        [54.5300, 24.5600], // Jubail
        [54.5500, 24.5400], // East of Jubail
        [54.5800, 24.5200], // Yas approach
        [54.6200, 24.5100], // Yas north
        [54.6500, 24.5000], // Yas NE
        [54.7000, 24.4800], // East toward KEZAD
        [54.7300, 24.4500], // KEZAD area
        [54.7500, 24.4200], // Airport east
        [54.7300, 24.3800], // SE
        [54.7000, 24.3600], // South
        [54.6500, 24.3500], // S toward MBZ
        [54.6000, 24.3700], // MBZ south
        [54.5500, 24.3800], // SW of airport
        [54.5000, 24.3900], // Mid-south
        [54.4500, 24.3900], // ADNEC south
        [54.4000, 24.3800], // S coast
        [54.3500, 24.3700], // SW approach
        [54.3000, 24.3700], // SW
        [54.2600, 24.3800], // Close polygon
      ],
    ],
  },
};

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

export const CITY_AREA_KM2 = 87;
export const METRO_AREA_KM2 = 600;
