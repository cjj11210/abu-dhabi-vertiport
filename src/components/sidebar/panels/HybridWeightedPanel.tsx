"use client";

import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { getModelContributions } from "@/lib/models/hybrid-weighted";

export default function HybridWeightedPanel() {
  const params = useStore((s) => s.hybridWeightedParams);
  const setParams = useStore((s) => s.setHybridWeightedParams);
  const vertiports = useStore((s) => s.vertiports);

  // Use first enabled vertiport for radar chart preview
  const sampleVertiport = vertiports.find((v) => v.enabled) || vertiports[0];
  const contributions = getModelContributions(sampleVertiport, params);

  const radarData = contributions.map((c) => ({
    model: c.model,
    weight: c.weight * 100,
    radius: c.radius,
  }));

  const weights = [
    { key: "fixedWeight" as const, label: "Fixed Radius" },
    { key: "driveTimeWeight" as const, label: "Drive-Time" },
    { key: "demandWeight" as const, label: "Demand-Density" },
    { key: "capacityWeight" as const, label: "Capacity Tier" },
    { key: "timeDecayWeight" as const, label: "Time-Decay" },
  ];

  return (
    <div className="space-y-4">
      {weights.map(({ key, label }) => (
        <div key={key} className="space-y-1">
          <div className="flex justify-between items-center">
            <Label className="text-xs">{label}</Label>
            <span className="text-xs font-mono font-semibold text-blue-600">
              {(params[key] * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[params[key]]}
            onValueChange={([v]) => setParams({ [key]: v })}
            min={0}
            max={1}
            step={0.05}
          />
        </div>
      ))}

      <div className="pt-2">
        <Label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Factor Contributions
        </Label>
        <div className="h-[180px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="model"
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 8 }}
              />
              <Radar
                name="Weight"
                dataKey="weight"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
