"use client";

import { useStore } from "@/lib/store";

const modelDescriptions: Record<string, { title: string; summary: string }> = {
  "fixed-radius": {
    title: "Fixed Radius",
    summary: "Equal circular zones around each vertiport. No private operators allowed within the radius.",
  },
  "drive-time": {
    title: "Drive-Time Isochrone",
    summary: "Zone size based on how far you can drive in N minutes. Accounts for road speed by area type.",
  },
  "demand-density": {
    title: "Demand-Density",
    summary: "High-demand areas get smaller zones (competition OK). Low-demand areas get larger protection.",
  },
  "capacity-tier": {
    title: "Capacity Tiers",
    summary: "Zone size scales with vertiport throughput class. Larger hubs get bigger exclusive zones.",
  },
  "time-decay": {
    title: "Time-Decay (Sunset)",
    summary: "Zones shrink over time as the market matures, eventually opening to competition.",
  },
  "hybrid-weighted": {
    title: "Hybrid Weighted",
    summary: "Blends all five models using adjustable weights for each factor.",
  },
};

const pppCategoryColors: { color: string; label: string }[] = [
  { color: "#1d4ed8", label: "Urban Core" },
  { color: "#2563eb", label: "Urban" },
  { color: "#3b82f6", label: "Suburban" },
  { color: "#6b7280", label: "Industrial" },
  { color: "#9ca3af", label: "Remote" },
];

export default function MapLegend() {
  const activeModel = useStore((s) => s.activeModel);
  const layerVisibility = useStore((s) => s.layerVisibility);
  const info = modelDescriptions[activeModel] || { title: "Legend", summary: "" };

  const showConditional =
    activeModel === "demand-density" ||
    activeModel === "capacity-tier" ||
    activeModel === "time-decay" ||
    activeModel === "hybrid-weighted";

  return (
    <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-lg p-3.5 text-xs max-w-[240px] space-y-3">
      {/* Active model info */}
      <div>
        <div className="font-semibold text-sm text-slate-800">{info.title}</div>
        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{info.summary}</div>
      </div>

      <div style={{ borderBottom: "1px solid #e2e8f0" }} />

      {/* Zone types */}
      {layerVisibility.pppVertiports && (
        <>
          <div className="space-y-1.5">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Exclusivity Zones</div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-red-500/60 border border-red-600" />
              <span>Full Exclusivity — no private operators</span>
            </div>
            {showConditional && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-yellow-400/60 border border-yellow-500" />
                <span>Conditional — private allowed with limits</span>
              </div>
            )}
          </div>

          <div style={{ borderBottom: "1px solid #e2e8f0" }} />

          {/* Vertiport categories */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">PPP Vertiports</div>
            {pppCategoryColors.map((c) => (
              <div key={c.label} className="flex items-center gap-2">
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.label}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* NCT&H */}
      {layerVisibility.ncth && (
        <>
          <div style={{ borderBottom: "1px solid #e2e8f0" }} />
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: "#10b981" }}
            />
            <span>NCT&H Locations</span>
          </div>
        </>
      )}

      {/* Heliports */}
      {layerVisibility.heliports && (
        <>
          <div style={{ borderBottom: "1px solid #e2e8f0" }} />
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: "#8b5cf6" }}
            />
            <span>Abu Dhabi Heliports</span>
          </div>
        </>
      )}

      {/* Helipads */}
      {layerVisibility.helipads && (
        <>
          <div style={{ borderBottom: "1px solid #e2e8f0" }} />
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 border-2 border-white shadow"
              style={{ backgroundColor: "#f59e0b", transform: "rotate(45deg)" }}
            />
            <span>Hybrid Helipads</span>
          </div>
        </>
      )}

      {/* VFR Routes */}
      {layerVisibility.vfrRoutes && (
        <>
          <div style={{ borderBottom: "1px solid #e2e8f0" }} />
          <div className="flex items-center gap-2">
            <div style={{ width: "16px", height: "2px", borderTop: "2px dashed #06b6d4" }} />
            <span>VFR Routes</span>
          </div>
        </>
      )}
    </div>
  );
}
