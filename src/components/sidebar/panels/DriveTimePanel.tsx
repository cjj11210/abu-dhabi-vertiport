"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export default function DriveTimePanel() {
  const params = useStore((s) => s.driveTimeParams);
  const setParams = useStore((s) => s.setDriveTimeParams);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Drive Time</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.minutes} min
          </span>
        </div>
        <Slider
          value={[params.minutes]}
          onValueChange={([v]) => setParams({ minutes: v })}
          min={1}
          max={30}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1 min</span>
          <span>30 min</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Circuity Factor</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.circuityFactor.toFixed(1)}x
          </span>
        </div>
        <Slider
          value={[params.circuityFactor]}
          onValueChange={([v]) => setParams({ circuityFactor: v })}
          min={1.0}
          max={1.8}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1.0x (direct)</span>
          <span>1.8x (winding)</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Speed-based isochrone approximation. Urban-core zones use 32 km/h, suburban 60 km/h,
        highway 120 km/h. Zones are clipped to land and have organic shapes reflecting road network indirectness.
      </p>
    </div>
  );
}
