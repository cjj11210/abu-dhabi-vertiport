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
import type { MapLocation } from "@/lib/data/layers/types";
import { ncthLocations as defaultNcth } from "@/lib/data/layers/ncth-locations";
import { heliportLocations as defaultHeliports } from "@/lib/data/layers/heliports";
import { helipadLocations as defaultHelipads } from "@/lib/data/layers/helipads";

export interface LayerVisibility {
  pppVertiports: boolean;
  ncth: boolean;
  heliports: boolean;
  helipads: boolean;
  vfrRoutes: boolean;
}

interface AppState {
  // Active model
  activeModel: ExclusivityModel;
  setActiveModel: (model: ExclusivityModel) => void;

  // Vertiports
  vertiports: Vertiport[];
  toggleVertiport: (id: string) => void;
  setAllVertiports: (enabled: boolean) => void;

  // Layer visibility
  layerVisibility: LayerVisibility;
  setLayerVisibility: (layer: keyof LayerVisibility, visible: boolean) => void;

  // New location layers
  ncthLocations: MapLocation[];
  toggleNcthLocation: (id: string) => void;
  setAllNcthLocations: (enabled: boolean) => void;

  heliportLocations: MapLocation[];
  toggleHeliportLocation: (id: string) => void;
  setAllHeliportLocations: (enabled: boolean) => void;

  helipadLocations: MapLocation[];
  toggleHelipadLocation: (id: string) => void;
  setAllHelipadLocations: (enabled: boolean) => void;

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

  // Layer visibility
  layerVisibility: {
    pppVertiports: false,
    ncth: false,
    heliports: false,
    helipads: false,
    vfrRoutes: false,
  },
  setLayerVisibility: (layer, visible) =>
    set((state) => ({
      layerVisibility: { ...state.layerVisibility, [layer]: visible },
    })),

  // NCT&H locations
  ncthLocations: defaultNcth.map((l) => ({ ...l })),
  toggleNcthLocation: (id) =>
    set((state) => ({
      ncthLocations: state.ncthLocations.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      ),
    })),
  setAllNcthLocations: (enabled) =>
    set((state) => ({
      ncthLocations: state.ncthLocations.map((l) => ({ ...l, enabled })),
    })),

  // Heliport locations
  heliportLocations: defaultHeliports.map((l) => ({ ...l })),
  toggleHeliportLocation: (id) =>
    set((state) => ({
      heliportLocations: state.heliportLocations.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      ),
    })),
  setAllHeliportLocations: (enabled) =>
    set((state) => ({
      heliportLocations: state.heliportLocations.map((l) => ({ ...l, enabled })),
    })),

  // Helipad locations
  helipadLocations: defaultHelipads.map((l) => ({ ...l })),
  toggleHelipadLocation: (id) =>
    set((state) => ({
      helipadLocations: state.helipadLocations.map((l) =>
        l.id === id ? { ...l, enabled: !l.enabled } : l
      ),
    })),
  setAllHelipadLocations: (enabled) =>
    set((state) => ({
      helipadLocations: state.helipadLocations.map((l) => ({ ...l, enabled })),
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
