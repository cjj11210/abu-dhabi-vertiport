"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function DemandDensityPanel() {
  const params = useStore((s) => s.demandDensityParams);
  const setParams = useStore((s) => s.setDemandDensityParams);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Base Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.baseRadiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.baseRadiusKm]}
          onValueChange={([v]) => setParams({ baseRadiusKm: v })}
          min={0.5}
          max={10}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">High Demand Multiplier</Label>
          <span className="text-sm font-mono font-semibold text-yellow-600">
            {params.highDemandMultiplier.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={[params.highDemandMultiplier]}
          onValueChange={([v]) => setParams({ highDemandMultiplier: v })}
          min={0.1}
          max={2.0}
          step={0.1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Smaller zones — enough demand for competition
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Medium Demand Multiplier</Label>
          <span className="text-sm font-mono font-semibold text-orange-600">
            {params.mediumDemandMultiplier.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={[params.mediumDemandMultiplier]}
          onValueChange={([v]) => setParams({ mediumDemandMultiplier: v })}
          min={0.1}
          max={2.0}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Low Demand Multiplier</Label>
          <span className="text-sm font-mono font-semibold text-red-600">
            {params.lowDemandMultiplier.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={[params.lowDemandMultiplier]}
          onValueChange={([v]) => setParams({ lowDemandMultiplier: v })}
          min={0.1}
          max={3.0}
          step={0.1}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Larger zones — protect government investment
        </p>
      </div>
    </div>
  );
}
