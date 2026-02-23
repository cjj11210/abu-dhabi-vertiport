"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function CapacityTierPanel() {
  const params = useStore((s) => s.capacityTierParams);
  const setParams = useStore((s) => s.setCapacityTierParams);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Hub-Large Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.hubLargeRadiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.hubLargeRadiusKm]}
          onValueChange={([v]) => setParams({ hubLargeRadiusKm: v })}
          min={0.5}
          max={10}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Hub-Medium Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.hubMediumRadiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.hubMediumRadiusKm]}
          onValueChange={([v]) => setParams({ hubMediumRadiusKm: v })}
          min={0.5}
          max={8}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Spoke Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.spokeRadiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.spokeRadiusKm]}
          onValueChange={([v]) => setParams({ spokeRadiusKm: v })}
          min={0.5}
          max={6}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Micro Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.microRadiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.microRadiusKm]}
          onValueChange={([v]) => setParams({ microRadiusKm: v })}
          min={0.2}
          max={4}
          step={0.1}
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <Label className="text-sm">Allow Private Over Capacity</Label>
        <Switch
          checked={params.allowPrivateOverCapacity}
          onCheckedChange={(v) => setParams({ allowPrivateOverCapacity: v })}
        />
      </div>

      {params.allowPrivateOverCapacity && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Capacity Threshold</Label>
            <span className="text-sm font-mono font-semibold text-blue-600">
              {params.capacityThreshold}%
            </span>
          </div>
          <Slider
            value={[params.capacityThreshold]}
            onValueChange={([v]) => setParams({ capacityThreshold: v })}
            min={50}
            max={100}
            step={5}
          />
          <p className="text-xs text-muted-foreground">
            Inner core = full exclusivity. Outer ring = private operators
            allowed when public vertiport exceeds capacity threshold.
          </p>
        </div>
      )}
    </div>
  );
}
