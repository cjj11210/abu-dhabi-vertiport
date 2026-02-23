import { create } from "zustand";
import type {
  ExclusivityModel,
  FixedRadiusParams,
  DriveTimeParams,
  DemandDensityParams,
  CapacityTierParams,
  TimeDecayParams,
  HybridWeightedParams,
  Vertiport,
} from "@/lib/models/types";
import { vertiports as defaultVertiports } from "@/lib/data/vertiports";

interface AppState {
  // Active model
  activeModel: ExclusivityModel;
  setActiveModel: (model: ExclusivityModel) => void;

  // Vertiports
  vertiports: Vertiport[];
  toggleVertiport: (id: string) => void;
  setAllVertiports: (enabled: boolean) => void;

  // Model parameters
  fixedRadiusParams: FixedRadiusParams;
  setFixedRadiusParams: (params: Partial<FixedRadiusParams>) => void;

  driveTimeParams: DriveTimeParams;
  setDriveTimeParams: (params: Partial<DriveTimeParams>) => void;

  demandDensityParams: DemandDensityParams;
  setDemandDensityParams: (params: Partial<DemandDensityParams>) => void;

  capacityTierParams: CapacityTierParams;
  setCapacityTierParams: (params: Partial<CapacityTierParams>) => void;

  timeDecayParams: TimeDecayParams;
  setTimeDecayParams: (params: Partial<TimeDecayParams>) => void;

  hybridWeightedParams: HybridWeightedParams;
  setHybridWeightedParams: (params: Partial<HybridWeightedParams>) => void;

  // UI state
  zoneOpacity: number;
  setZoneOpacity: (opacity: number) => void;
  showCityBoundary: boolean;
  setShowCityBoundary: (show: boolean) => void;
  isAnimating: boolean;
  setIsAnimating: (animating: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  activeModel: "fixed-radius",
  setActiveModel: (model) => set({ activeModel: model }),

  vertiports: defaultVertiports.map((v) => ({ ...v })),
  toggleVertiport: (id) =>
    set((state) => ({
      vertiports: state.vertiports.map((v) =>
        v.id === id ? { ...v, enabled: !v.enabled } : v
      ),
    })),
  setAllVertiports: (enabled) =>
    set((state) => ({
      vertiports: state.vertiports.map((v) => ({ ...v, enabled })),
    })),

  fixedRadiusParams: { radiusKm: 5 },
  setFixedRadiusParams: (params) =>
    set((state) => ({
      fixedRadiusParams: { ...state.fixedRadiusParams, ...params },
    })),

  driveTimeParams: { minutes: 15, circuityFactor: 1.3 },
  setDriveTimeParams: (params) =>
    set((state) => ({
      driveTimeParams: { ...state.driveTimeParams, ...params },
    })),

  demandDensityParams: {
    baseRadiusKm: 3,
    highDemandMultiplier: 0.5,
    mediumDemandMultiplier: 1.0,
    lowDemandMultiplier: 1.5,
  },
  setDemandDensityParams: (params) =>
    set((state) => ({
      demandDensityParams: { ...state.demandDensityParams, ...params },
    })),

  capacityTierParams: {
    hubLargeRadiusKm: 5,
    hubMediumRadiusKm: 3.5,
    spokeRadiusKm: 2,
    microRadiusKm: 1,
    capacityThreshold: 80,
    allowPrivateOverCapacity: true,
  },
  setCapacityTierParams: (params) =>
    set((state) => ({
      capacityTierParams: { ...state.capacityTierParams, ...params },
    })),

  timeDecayParams: {
    initialRadiusKm: 5,
    years: 0,
    maxYears: 20,
    decayCurve: "linear",
  },
  setTimeDecayParams: (params) =>
    set((state) => ({
      timeDecayParams: { ...state.timeDecayParams, ...params },
    })),

  hybridWeightedParams: {
    fixedWeight: 0.2,
    driveTimeWeight: 0.2,
    demandWeight: 0.2,
    capacityWeight: 0.2,
    timeDecayWeight: 0.2,
    fixedParams: { radiusKm: 5 },
    driveTimeParams: { minutes: 15, circuityFactor: 1.3 },
    demandParams: {
      baseRadiusKm: 3,
      highDemandMultiplier: 0.5,
      mediumDemandMultiplier: 1.0,
      lowDemandMultiplier: 1.5,
    },
    capacityParams: {
      hubLargeRadiusKm: 5,
      hubMediumRadiusKm: 3.5,
      spokeRadiusKm: 2,
      microRadiusKm: 1,
      capacityThreshold: 80,
      allowPrivateOverCapacity: true,
    },
    timeDecayParams: {
      initialRadiusKm: 5,
      years: 0,
      maxYears: 20,
      decayCurve: "linear",
    },
  },
  setHybridWeightedParams: (params) =>
    set((state) => ({
      hybridWeightedParams: { ...state.hybridWeightedParams, ...params },
    })),

  zoneOpacity: 0.35,
  setZoneOpacity: (opacity) => set({ zoneOpacity: opacity }),
  showCityBoundary: false,
  setShowCityBoundary: (show) => set({ showCityBoundary: show }),
  isAnimating: false,
  setIsAnimating: (animating) => set({ isAnimating: animating }),
}));
