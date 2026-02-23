"use client";

import { useStore } from "@/lib/store";
import FixedRadiusPanel from "./panels/FixedRadiusPanel";
import DriveTimePanel from "./panels/DriveTimePanel";
import DemandDensityPanel from "./panels/DemandDensityPanel";
import CapacityTierPanel from "./panels/CapacityTierPanel";
import TimeDecayPanel from "./panels/TimeDecayPanel";
import HybridWeightedPanel from "./panels/HybridWeightedPanel";

export default function ParameterPanel() {
  const activeModel = useStore((s) => s.activeModel);

  return (
    <div>
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
        Parameters
      </div>
      {activeModel === "fixed-radius" && <FixedRadiusPanel />}
      {activeModel === "drive-time" && <DriveTimePanel />}
      {activeModel === "demand-density" && <DemandDensityPanel />}
      {activeModel === "capacity-tier" && <CapacityTierPanel />}
      {activeModel === "time-decay" && <TimeDecayPanel />}
      {activeModel === "hybrid-weighted" && <HybridWeightedPanel />}
    </div>
  );
}
