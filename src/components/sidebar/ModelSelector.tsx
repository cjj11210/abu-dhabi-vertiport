"use client";

import { useStore } from "@/lib/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExclusivityModel } from "@/lib/models/types";

const models: { value: ExclusivityModel; label: string; description: string; detail: string }[] = [
  { value: "fixed-radius", label: "Fixed Radius", description: "Simple distance-based circles", detail: "Every vertiport gets an identical circular exclusivity zone. Useful as a baseline to understand the raw impact of a uniform policy." },
  { value: "drive-time", label: "Drive-Time Estimate", description: "Speed-based isochrone approximation", detail: "Zone shape reflects how far someone can drive in a given time. Urban areas produce smaller, denser zones; highways extend reach." },
  { value: "demand-density", label: "Demand-Density", description: "Zones scaled by passenger demand", detail: "High-demand areas get smaller zones to encourage competition. Low-demand areas get larger protection to justify investment." },
  { value: "capacity-tier", label: "Capacity Tiers", description: "Based on vertiport throughput class", detail: "Large hubs get bigger exclusive zones than small spoke or micro vertiports. Optionally allows private operators in an outer ring." },
  { value: "time-decay", label: "Time-Decay (Sunset)", description: "Zones shrink over time", detail: "Exclusivity zones gradually shrink according to a decay curve, simulating a sunset clause that opens the market over time." },
  { value: "hybrid-weighted", label: "Hybrid Weighted", description: "Combine all models", detail: "Blends the effective radius from all five models using adjustable weights. Useful for finding a balanced policy position." },
];

export default function ModelSelector() {
  const activeModel = useStore((s) => s.activeModel);
  const setActiveModel = useStore((s) => s.setActiveModel);

  const activeModelInfo = models.find((m) => m.value === activeModel);

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Exclusivity Model
      </label>
      <Select value={activeModel} onValueChange={(v) => setActiveModel(v as ExclusivityModel)}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              <div>
                <div className="font-medium">{m.label}</div>
                <div className="text-xs text-muted-foreground">{m.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {activeModelInfo && (
        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-md px-3 py-2">
          {activeModelInfo.detail}
        </p>
      )}
    </div>
  );
}
