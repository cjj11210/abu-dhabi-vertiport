import type { Feature, Polygon, MultiPolygon } from "geojson";

export type VertiportCategory = "urban-core" | "urban" | "suburban" | "industrial" | "remote";
export type DemandLevel = "high" | "medium" | "low";
export type CapacityClass = "hub-large" | "hub-medium" | "spoke" | "micro";

export interface Vertiport {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: VertiportCategory;
  demand: DemandLevel;
  capacity: CapacityClass;
  enabled: boolean;
}

export type ExclusivityModel =
  | "fixed-radius"
  | "drive-time"
  | "demand-density"
  | "capacity-tier"
  | "time-decay"
  | "hybrid-weighted";

export interface FixedRadiusParams {
  radiusKm: number;
}

export interface DriveTimeParams {
  minutes: number;
  circuityFactor: number;
}

export interface DemandDensityParams {
  baseRadiusKm: number;
  highDemandMultiplier: number;
  mediumDemandMultiplier: number;
  lowDemandMultiplier: number;
}

export interface CapacityTierParams {
  hubLargeRadiusKm: number;
  hubMediumRadiusKm: number;
  spokeRadiusKm: number;
  microRadiusKm: number;
  capacityThreshold: number;
  allowPrivateOverCapacity: boolean;
}

export type DecayCurve = "linear" | "exponential" | "stepped";

export interface TimeDecayParams {
  initialRadiusKm: number;
  years: number;
  maxYears: number;
  decayCurve: DecayCurve;
}

export interface HybridWeightedParams {
  fixedWeight: number;
  driveTimeWeight: number;
  demandWeight: number;
  capacityWeight: number;
  timeDecayWeight: number;
  fixedParams: FixedRadiusParams;
  driveTimeParams: DriveTimeParams;
  demandParams: DemandDensityParams;
  capacityParams: CapacityTierParams;
  timeDecayParams: TimeDecayParams;
}

export type ModelParams =
  | { model: "fixed-radius"; params: FixedRadiusParams }
  | { model: "drive-time"; params: DriveTimeParams }
  | { model: "demand-density"; params: DemandDensityParams }
  | { model: "capacity-tier"; params: CapacityTierParams }
  | { model: "time-decay"; params: TimeDecayParams }
  | { model: "hybrid-weighted"; params: HybridWeightedParams };

export type ExclusivityLevel = "full" | "conditional" | "none";

export interface ZoneResult {
  vertiportId: string;
  polygon: Feature<Polygon | MultiPolygon> | null;
  exclusivityLevel: ExclusivityLevel;
  effectiveRadiusKm: number;
  conditionalRing?: Feature<Polygon | MultiPolygon> | null;
}

export interface CoverageStats {
  totalExclusiveAreaKm2: number;
  cityAreaKm2: number;
  coveragePercent: number;
  potentialSitesTotal: number;
  potentialSitesBlocked: number;
  potentialSitesAllowed: number;
  comparisonVsBaseline: number; // % difference vs 5km baseline
}
