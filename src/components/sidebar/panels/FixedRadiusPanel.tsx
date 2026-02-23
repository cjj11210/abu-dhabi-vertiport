"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function FixedRadiusPanel() {
  const params = useStore((s) => s.fixedRadiusParams);
  const setParams = useStore((s) => s.setFixedRadiusParams);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.radiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.radiusKm]}
          onValueChange={([v]) => setParams({ radiusKm: v })}
          min={0.5}
          max={15}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0.5 km</span>
          <span>15 km</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Simple circular exclusivity zones around each vertiport. The default 5km
        radius demonstrates how the proposed policy would blanket Abu Dhabi.
      </p>
    </div>
  );
}
