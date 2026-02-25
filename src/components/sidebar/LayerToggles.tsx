"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useStore, type LayerVisibility } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MapLocation } from "@/lib/data/layers/types";

const categoryBadgeColors: Record<string, string> = {
  "urban-core": "bg-blue-100 text-blue-700",
  urban: "bg-sky-100 text-sky-700",
  suburban: "bg-green-100 text-green-700",
  industrial: "bg-gray-100 text-gray-700",
  remote: "bg-orange-100 text-orange-700",
};

const heliportCategoryLabels: Record<string, string> = {
  commercial: "Commercial",
  private: "Private",
  hospital: "Hospital",
  hotel: "Hotel",
};

const heliportCategoryBadgeColors: Record<string, string> = {
  commercial: "bg-purple-100 text-purple-700",
  private: "bg-slate-100 text-slate-700",
  hospital: "bg-red-100 text-red-700",
  hotel: "bg-amber-100 text-amber-700",
};

interface LayerSectionProps {
  title: string;
  color: string;
  layerKey: keyof LayerVisibility;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

function LayerSection({ title, color, layerKey, children, defaultExpanded = false }: LayerSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const layerVisibility = useStore((s) => s.layerVisibility);
  const setLayerVisibility = useStore((s) => s.setLayerVisibility);
  const visible = layerVisibility[layerKey];

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <button
          className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: visible ? color : "#d1d5db" }}
          />
          <span>{title}</span>
        </button>
        <Switch
          checked={visible}
          onCheckedChange={(v) => setLayerVisibility(layerKey, v)}
          className="scale-75"
        />
      </div>
      {expanded && visible && children && (
        <div className="ml-5 mt-1">
          {children}
        </div>
      )}
    </div>
  );
}

interface LocationToggleListProps {
  locations: MapLocation[];
  onToggle: (id: string) => void;
  onSetAll: (enabled: boolean) => void;
  showCategory?: boolean;
}

function LocationToggleList({ locations, onToggle, onSetAll, showCategory }: LocationToggleListProps) {
  const allEnabled = locations.every((l) => l.enabled);
  const noneEnabled = locations.every((l) => !l.enabled);

  return (
    <div className="space-y-1">
      <div className="flex justify-end gap-1 mb-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[10px]"
          onClick={() => onSetAll(true)}
          disabled={allEnabled}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[10px]"
          onClick={() => onSetAll(false)}
          disabled={noneEnabled}
        >
          None
        </Button>
      </div>
      <div className="space-y-0.5 max-h-[200px] overflow-y-auto pr-1">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Switch
                checked={loc.enabled}
                onCheckedChange={() => onToggle(loc.id)}
                className="shrink-0 scale-[0.65]"
              />
              <span className="text-[11px] truncate">{loc.name}</span>
            </div>
            {showCategory && loc.category && (
              <Badge
                variant="secondary"
                className={`text-[9px] px-1 py-0 shrink-0 ${heliportCategoryBadgeColors[loc.category] || ""}`}
              >
                {heliportCategoryLabels[loc.category] || loc.category}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LayerToggles() {
  const vertiports = useStore((s) => s.vertiports);
  const toggleVertiport = useStore((s) => s.toggleVertiport);
  const setAllVertiports = useStore((s) => s.setAllVertiports);

  const ncthLocations = useStore((s) => s.ncthLocations);
  const toggleNcthLocation = useStore((s) => s.toggleNcthLocation);
  const setAllNcthLocations = useStore((s) => s.setAllNcthLocations);

  const heliportLocations = useStore((s) => s.heliportLocations);
  const toggleHeliportLocation = useStore((s) => s.toggleHeliportLocation);
  const setAllHeliportLocations = useStore((s) => s.setAllHeliportLocations);

  const helipadLocations = useStore((s) => s.helipadLocations);
  const toggleHelipadLocation = useStore((s) => s.toggleHelipadLocation);
  const setAllHelipadLocations = useStore((s) => s.setAllHelipadLocations);

  // Adapt vertiports to the LocationToggleList interface
  const vertiportItems: MapLocation[] = vertiports.map((v) => ({
    id: v.id,
    name: v.name,
    lat: v.lat,
    lng: v.lng,
    layerType: "ncth" as const, // placeholder, not used
    enabled: v.enabled,
  }));

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
        Map Layers
      </div>

      <div className="space-y-3">
        {/* PPP Vertiports */}
        <LayerSection
          title="PPP Vertiports"
          color="#3b82f6"
          layerKey="pppVertiports"
          defaultExpanded={true}
        >
          <PPPVertiportToggles />
        </LayerSection>

        {/* NCT&H Locations */}
        <LayerSection
          title="NCT&H Locations"
          color="#10b981"
          layerKey="ncth"
        >
          <LocationToggleList
            locations={ncthLocations}
            onToggle={toggleNcthLocation}
            onSetAll={setAllNcthLocations}
          />
        </LayerSection>

        {/* Abu Dhabi Heliports */}
        <LayerSection
          title="Abu Dhabi Heliports"
          color="#8b5cf6"
          layerKey="heliports"
        >
          <LocationToggleList
            locations={heliportLocations}
            onToggle={toggleHeliportLocation}
            onSetAll={setAllHeliportLocations}
            showCategory
          />
        </LayerSection>

        {/* Hybrid Helipads */}
        <LayerSection
          title="Hybrid Helipads"
          color="#f59e0b"
          layerKey="helipads"
        >
          <LocationToggleList
            locations={helipadLocations}
            onToggle={toggleHelipadLocation}
            onSetAll={setAllHelipadLocations}
          />
        </LayerSection>

        {/* VFR Routes */}
        <LayerSection
          title="VFR Routes"
          color="#06b6d4"
          layerKey="vfrRoutes"
        />
      </div>
    </div>
  );
}

function PPPVertiportToggles() {
  const vertiports = useStore((s) => s.vertiports);
  const toggleVertiport = useStore((s) => s.toggleVertiport);
  const setAllVertiports = useStore((s) => s.setAllVertiports);

  const allEnabled = vertiports.every((v) => v.enabled);
  const noneEnabled = vertiports.every((v) => !v.enabled);

  return (
    <div className="space-y-1">
      <div className="flex justify-end gap-1 mb-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[10px]"
          onClick={() => setAllVertiports(true)}
          disabled={allEnabled}
        >
          All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-5 px-1.5 text-[10px]"
          onClick={() => setAllVertiports(false)}
          disabled={noneEnabled}
        >
          None
        </Button>
      </div>
      <div className="space-y-0.5 max-h-[200px] overflow-y-auto pr-1">
        {vertiports.map((v) => (
          <div
            key={v.id}
            className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <Switch
                checked={v.enabled}
                onCheckedChange={() => toggleVertiport(v.id)}
                className="shrink-0 scale-[0.65]"
              />
              <span className="text-[11px] truncate">{v.name}</span>
            </div>
            <Badge
              variant="secondary"
              className={`text-[9px] px-1 py-0 shrink-0 ${categoryBadgeColors[v.category] || ""}`}
            >
              {v.capacity}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
