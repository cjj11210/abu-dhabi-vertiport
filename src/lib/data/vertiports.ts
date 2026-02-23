import type { Vertiport } from "@/lib/models/types";

export const vertiports: Vertiport[] = [
  // Urban-Core - High Demand
  {
    id: "saadiyat",
    name: "Saadiyat Island",
    lat: 24.5332124,
    lng: 54.39872372,
    category: "urban-core",
    demand: "high",
    capacity: "hub-large",
    enabled: true,
  },
  {
    id: "adgm",
    name: "ADGM (Al Maryah)",
    lat: 24.50137718,
    lng: 54.38963954,
    category: "urban-core",
    demand: "high",
    capacity: "hub-large",
    enabled: true,
  },
  {
    id: "corniche",
    name: "Corniche",
    lat: 24.46956267,
    lng: 54.3360577,
    category: "urban-core",
    demand: "high",
    capacity: "hub-medium",
    enabled: true,
  },
  {
    id: "emirates-palace",
    name: "Emirates Palace",
    lat: 24.46212302,
    lng: 54.32034056,
    category: "urban-core",
    demand: "high",
    capacity: "hub-medium",
    enabled: true,
  },
  // Urban - High/Medium Demand
  {
    id: "al-bateen",
    name: "Al Bateen",
    lat: 24.4275881,
    lng: 54.45289363,
    category: "urban",
    demand: "high",
    capacity: "hub-medium",
    enabled: true,
  },
  {
    id: "adnec",
    name: "ADNEC",
    lat: 24.4181562,
    lng: 54.43695946,
    category: "urban",
    demand: "medium",
    capacity: "hub-medium",
    enabled: true,
  },
  // Suburban - Medium Demand
  {
    id: "jubail",
    name: "Jubail Island",
    lat: 24.53304094,
    lng: 54.48275627,
    category: "suburban",
    demand: "medium",
    capacity: "spoke",
    enabled: true,
  },
  {
    id: "hudayriyat",
    name: "Hudayriyat Island",
    lat: 24.42418156,
    lng: 54.33876886,
    category: "suburban",
    demand: "medium",
    capacity: "spoke",
    enabled: true,
  },
  {
    id: "mbz",
    name: "MBZ City (Khalifa City)",
    lat: 24.34788084,
    lng: 54.55312796,
    category: "suburban",
    demand: "medium",
    capacity: "spoke",
    enabled: true,
  },
  // Suburban - High Demand (Transport Hubs)
  {
    id: "yas-island",
    name: "Yas Island",
    lat: 24.4569947,
    lng: 54.60039332,
    category: "suburban",
    demand: "high",
    capacity: "hub-large",
    enabled: true,
  },
  {
    id: "auh-airport",
    name: "AUH Airport",
    lat: 24.45318506,
    lng: 54.63892879,
    category: "suburban",
    demand: "high",
    capacity: "hub-large",
    enabled: true,
  },
  // Industrial
  {
    id: "kezad",
    name: "KEZAD",
    lat: 24.67951101,
    lng: 54.74567703,
    category: "industrial",
    demand: "medium",
    capacity: "spoke",
    enabled: true,
  },
  // Remote
  {
    id: "ruwais",
    name: "Ruwais",
    lat: 24.10319034,
    lng: 52.83118809,
    category: "remote",
    demand: "low",
    capacity: "micro",
    enabled: true,
  },
  {
    id: "al-ain",
    name: "Al Ain",
    lat: 24.2395911,
    lng: 55.7051932,
    category: "remote",
    demand: "medium",
    capacity: "spoke",
    enabled: true,
  },
];

// Speed profiles for drive-time model (km/h)
export const speedProfiles: Record<string, number> = {
  "urban-core": 32,
  urban: 40,
  suburban: 60,
  industrial: 80,
  remote: 120,
};

// Demand multipliers for demand-density model
export const demandMultipliers: Record<string, number> = {
  high: 0.5,    // Smaller zones - enough demand for competition
  medium: 1.0,  // Standard zones
  low: 1.5,     // Larger zones - protect investment
};

// Capacity radius multipliers
export const capacityRadii: Record<string, number> = {
  "hub-large": 1.5,
  "hub-medium": 1.0,
  spoke: 0.7,
  micro: 0.4,
};
