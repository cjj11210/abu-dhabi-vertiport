import type { MapLocation, HeliportCategory } from "./types";

interface HeliportEntry {
  name: string;
  lat: number;
  lng: number;
  category: HeliportCategory;
}

const heliportData: HeliportEntry[] = [
  { name: "Abu Dhabi Cruise Terminal", lat: 24.5325, lng: 54.3803, category: "commercial" },
  { name: "ADNOC Towers", lat: 24.4619, lng: 54.3242, category: "commercial" },
  { name: "Al Rahba Hospital", lat: 24.5744, lng: 54.6950, category: "hospital" },
  { name: "Al Wagan Hospital", lat: 23.6367, lng: 55.5647, category: "hospital" },
  { name: "Burjeel Medical City", lat: 24.3547, lng: 54.5383, category: "hospital" },
  { name: "Cleveland Clinic", lat: 24.4981, lng: 54.3875, category: "hospital" },
  { name: "EGA Al Taweelah", lat: 24.7822, lng: 54.7372, category: "commercial" },
  { name: "Emirates Palace", lat: 24.4622, lng: 54.3206, category: "hotel" },
  { name: "Ghayathi Hospital", lat: 23.8983, lng: 52.8033, category: "hospital" },
  { name: "Liwa Hospital", lat: 23.1481, lng: 53.7983, category: "hospital" },
  { name: "Mafraq Hospital", lat: 24.3281, lng: 54.6131, category: "hospital" },
  { name: "Marina Mall", lat: 24.4781, lng: 54.3281, category: "commercial" },
  { name: "Mezairaa ADNOC Sour Gas", lat: 23.1200, lng: 53.8761, category: "commercial" },
  { name: "Mirfa Hospital", lat: 24.0842, lng: 53.5003, category: "hospital" },
  { name: "Nation Towers", lat: 24.4642, lng: 54.3278, category: "commercial" },
  { name: "Qasr Al Sarab Desert Resort", lat: 22.8986, lng: 54.3392, category: "hotel" },
  { name: "Remah Health Care Center", lat: 24.1800, lng: 55.3339, category: "hospital" },
  { name: "Ruwais Hospital", lat: 24.0858, lng: 52.6669, category: "hospital" },
  { name: "Sheikh Shakhbout Medical City", lat: 24.3261, lng: 54.6122, category: "hospital" },
  { name: "Sweihan Disease Prevention Center", lat: 24.4642, lng: 55.3256, category: "hospital" },
  { name: "Zaya Nurai Island Resort", lat: 24.6189, lng: 54.4742, category: "hotel" },
];

export const heliportLocations: MapLocation[] = heliportData.map((h, i) => ({
  id: `heliport-${i + 1}`,
  name: h.name,
  lat: h.lat,
  lng: h.lng,
  layerType: "heliport" as const,
  category: h.category,
  enabled: true,
}));
