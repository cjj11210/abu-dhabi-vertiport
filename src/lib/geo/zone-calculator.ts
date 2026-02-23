import type { Vertiport, ExclusivityModel, ZoneResult } from "@/lib/models/types";
import { calculateFixedRadius } from "@/lib/models/fixed-radius";
import { calculateDriveTime } from "@/lib/models/drive-time";
import { calculateDemandDensity } from "@/lib/models/demand-density";
import { calculateCapacityTier } from "@/lib/models/capacity-tier";
import { calculateTimeDecay } from "@/lib/models/time-decay";
import { calculateHybridWeighted } from "@/lib/models/hybrid-weighted";
import type { AppState } from "@/lib/store-types";

export function calculateZones(
  vertiports: Vertiport[],
  model: ExclusivityModel,
  state: AppState
): ZoneResult[] {
  const enabledVertiports = vertiports.filter((v) => v.enabled);

  return enabledVertiports.map((vertiport) => {
    switch (model) {
      case "fixed-radius":
        return calculateFixedRadius(vertiport, state.fixedRadiusParams);
      case "drive-time":
        return calculateDriveTime(vertiport, state.driveTimeParams);
      case "demand-density":
        return calculateDemandDensity(vertiport, state.demandDensityParams);
      case "capacity-tier":
        return calculateCapacityTier(vertiport, state.capacityTierParams);
      case "time-decay":
        return calculateTimeDecay(vertiport, state.timeDecayParams);
      case "hybrid-weighted":
        return calculateHybridWeighted(vertiport, state.hybridWeightedParams);
      default:
        return calculateFixedRadius(vertiport, state.fixedRadiusParams);
    }
  });
}
