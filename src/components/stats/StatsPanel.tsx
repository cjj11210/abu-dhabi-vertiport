"use client";

import { useZoneCalculation } from "@/hooks/useZoneCalculation";
import { useLayerZoneCalculation } from "@/hooks/useLayerZoneCalculation";
import { useCoverageStats } from "@/hooks/useCoverageStats";
import { useStore } from "@/lib/store";
import CoverageChart from "./CoverageChart";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ZoneResult } from "@/lib/models/types";

export default function StatsPanel() {
  const layerVisibility = useStore((s) => s.layerVisibility);
  const zoneVisibility = useStore((s) => s.zoneVisibility);

  // PPP vertiport zones
  const pppZones = useZoneCalculation();

  // Other layer zones
  const ncthLocations = useStore((s) => s.ncthLocations);
  const heliportLocations = useStore((s) => s.heliportLocations);
  const helipadLocations = useStore((s) => s.helipadLocations);

  const ncthZones = useLayerZoneCalculation(ncthLocations, layerVisibility.ncth && zoneVisibility.ncth);
  const heliportZones = useLayerZoneCalculation(heliportLocations, layerVisibility.heliports && zoneVisibility.heliports);
  const helipadZones = useLayerZoneCalculation(helipadLocations, layerVisibility.helipads && zoneVisibility.helipads);

  // Combine all active zones for impact analysis
  const allZones: ZoneResult[] = [
    ...(layerVisibility.pppVertiports && zoneVisibility.pppVertiports ? pppZones : []),
    ...ncthZones,
    ...heliportZones,
    ...helipadZones,
  ];

  const stats = useCoverageStats(allZones);

  const compIcon =
    stats.comparisonVsBaseline > 0 ? (
      <ArrowUp className="h-3 w-3 text-red-500" />
    ) : stats.comparisonVsBaseline < 0 ? (
      <ArrowDown className="h-3 w-3 text-green-500" />
    ) : (
      <Minus className="h-3 w-3 text-slate-400" />
    );

  const compColor =
    stats.comparisonVsBaseline > 0
      ? "text-red-600"
      : stats.comparisonVsBaseline < 0
      ? "text-green-600"
      : "text-slate-500";

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Market Impact Analysis
      </div>
      <p className="text-[11px] text-slate-400 leading-snug -mt-1">
        How much of the city is closed to private vertiport operators under these settings?
      </p>

      {/* Coverage gauge */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] text-slate-500">City area blocked by exclusivity zones</span>
        </div>
        <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(stats.coveragePercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-lg font-bold text-slate-800">
            {stats.coveragePercent.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">of city under exclusivity</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-50 rounded-lg p-2.5">
          <div className="text-[11px] text-muted-foreground">Total Exclusive Area</div>
          <div className="text-sm font-semibold">{stats.totalExclusiveAreaKm2} km²</div>
          <div className="text-[10px] text-slate-400">combined zone footprint</div>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5">
          <div className="text-[11px] text-muted-foreground">Abu Dhabi Metro</div>
          <div className="text-sm font-semibold">{stats.cityAreaKm2} km²</div>
          <div className="text-[10px] text-slate-400">reference city area</div>
        </div>
        <div className="bg-red-50 rounded-lg p-2.5">
          <div className="text-[11px] text-muted-foreground">Potential Sites Blocked</div>
          <div className="text-sm font-semibold text-red-700">
            {stats.potentialSitesBlocked}
          </div>
          <div className="text-[10px] text-red-400">private operators excluded</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2.5">
          <div className="text-[11px] text-muted-foreground">Potential Sites Open</div>
          <div className="text-sm font-semibold text-green-700">
            {stats.potentialSitesAllowed}
          </div>
          <div className="text-[10px] text-green-500">available for competition</div>
        </div>
      </div>

      {/* Baseline comparison */}
      <div className="flex items-center gap-1.5 text-xs bg-slate-50 rounded-md px-2.5 py-1.5">
        {compIcon}
        <span className={compColor}>
          {stats.comparisonVsBaseline > 0 ? "+" : ""}
          {stats.comparisonVsBaseline}% area vs 5 km fixed-radius baseline
        </span>
      </div>

      {/* Coverage chart */}
      <div>
        <div className="text-[11px] text-slate-500 mb-1">Site availability breakdown</div>
        <CoverageChart stats={stats} />
      </div>
    </div>
  );
}
