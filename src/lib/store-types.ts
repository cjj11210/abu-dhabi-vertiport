import type {
  FixedRadiusParams,
  DriveTimeParams,
  DemandDensityParams,
  CapacityTierParams,
  TimeDecayParams,
  HybridWeightedParams,
} from "@/lib/models/types";

export interface AppState {
  fixedRadiusParams: FixedRadiusParams;
  driveTimeParams: DriveTimeParams;
  demandDensityParams: DemandDensityParams;
  capacityTierParams: CapacityTierParams;
  timeDecayParams: TimeDecayParams;
  hybridWeightedParams: HybridWeightedParams;
}
