"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ModelSelector from "./ModelSelector";
import ParameterPanel from "./ParameterPanel";
import LayerToggles from "./LayerToggles";
import StatsPanel from "@/components/stats/StatsPanel";

export default function Sidebar() {
  const zoneOpacity = useStore((s) => s.zoneOpacity);
  const setZoneOpacity = useStore((s) => s.setZoneOpacity);
  const showCityBoundary = useStore((s) => s.showCityBoundary);
  const setShowCityBoundary = useStore((s) => s.setShowCityBoundary);

  return (
    <aside className="w-full lg:w-[380px] h-full flex flex-col bg-white border-r border-slate-200 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <ModelSelector />

        <div className="border-t border-slate-100 pt-4">
          <ParameterPanel />
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-3">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Display Options
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-xs">Zone Opacity</Label>
              <span className="text-xs font-mono text-slate-500">
                {Math.round(zoneOpacity * 100)}%
              </span>
            </div>
            <Slider
              value={[zoneOpacity]}
              onValueChange={([v]) => setZoneOpacity(v)}
              min={0.05}
              max={0.8}
              step={0.05}
            />
          </div>
          <div className="flex items-center justify-between py-1">
            <Label className="text-xs">Show City Boundary</Label>
            <Switch
              checked={showCityBoundary}
              onCheckedChange={setShowCityBoundary}
              className="scale-75"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <LayerToggles />
        </div>

        <div className="border-t border-slate-100 pt-4">
          <StatsPanel />
        </div>
      </div>
    </aside>
  );
}
