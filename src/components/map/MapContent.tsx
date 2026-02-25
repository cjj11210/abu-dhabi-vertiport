"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStore } from "@/lib/store";
import { useZoneCalculation } from "@/hooks/useZoneCalculation";
import { useLayerZoneCalculation } from "@/hooks/useLayerZoneCalculation";
import { cityBoundary } from "@/lib/data/city-boundary";
import { vrpWaypoints, vfrRoutes } from "@/lib/data/layers";
import type { ZoneResult, Vertiport } from "@/lib/models/types";
import type { PathOptions } from "leaflet";
import MapLegend from "./MapLegend";

const ABU_DHABI_CENTER: [number, number] = [24.4539, 54.3773];
const DEFAULT_ZOOM = 11;

function getZoneStyle(zone: ZoneResult, opacity: number): PathOptions {
  if (zone.exclusivityLevel === "conditional") {
    return {
      fillColor: "#eab308",
      fillOpacity: opacity,
      color: "#ca8a04",
      weight: 1.5,
      opacity: 0.8,
    };
  }
  return {
    fillColor: "#ef4444",
    fillOpacity: opacity,
    color: "#dc2626",
    weight: 1.5,
    opacity: 0.8,
  };
}

const conditionalRingStyle: PathOptions = {
  fillColor: "#eab308",
  fillOpacity: 0.25,
  color: "#ca8a04",
  weight: 1,
  opacity: 0.6,
  dashArray: "4 4",
};

const cityBoundaryStyle: PathOptions = {
  fillColor: "transparent",
  fillOpacity: 0,
  color: "#475569",
  weight: 2,
  opacity: 0.7,
  dashArray: "8 6",
};

// Category colors for PPP vertiport markers
const categoryColors: Record<string, string> = {
  "urban-core": "#1d4ed8",
  urban: "#2563eb",
  suburban: "#3b82f6",
  industrial: "#6b7280",
  remote: "#9ca3af",
};

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.setView(ABU_DHABI_CENTER, DEFAULT_ZOOM);
  }, [map]);
  return null;
}

function ZoneOverlays() {
  const visible = useStore((s) => s.layerVisibility.pppVertiports);
  const zones = useZoneCalculation();
  const opacity = useStore((s) => s.zoneOpacity);

  if (!visible) return null;

  return (
    <>
      {zones.map((zone) => (
        <span key={zone.vertiportId}>
          {zone.polygon && (
            <GeoJSON
              key={`zone-${zone.vertiportId}-${JSON.stringify(zone.polygon.geometry.coordinates[0]?.slice(0, 2))}`}
              data={zone.polygon}
              style={() => getZoneStyle(zone, opacity)}
            />
          )}
          {zone.conditionalRing && (
            <GeoJSON
              key={`ring-${zone.vertiportId}-${JSON.stringify(zone.conditionalRing.geometry.coordinates[0]?.slice(0, 2))}`}
              data={zone.conditionalRing}
              style={() => conditionalRingStyle}
            />
          )}
        </span>
      ))}
    </>
  );
}

const categoryLabels: Record<string, string> = {
  "urban-core": "Urban Core",
  urban: "Urban",
  suburban: "Suburban",
  industrial: "Industrial",
  remote: "Remote",
};

const capacityLabels: Record<string, string> = {
  "hub-large": "Hub (Large)",
  "hub-medium": "Hub (Medium)",
  spoke: "Spoke",
  micro: "Micro",
};

function createNameLabel(name: string, color?: string) {
  return L.divIcon({
    className: "vertiport-label",
    html: `<span style="
      font-size: 11px;
      font-weight: 600;
      color: ${color || "#1e293b"};
      text-shadow: 0 0 3px white, 0 0 3px white, 0 0 3px white, 0 0 3px white;
      white-space: nowrap;
      pointer-events: none;
    ">${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, -12],
  });
}

function createDiamondIcon(color: string) {
  return L.divIcon({
    className: "helipad-diamond",
    html: `<div style="
      width: 12px;
      height: 12px;
      background-color: ${color};
      border: 2px solid white;
      transform: rotate(45deg);
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function createWaypointLabel(code: string) {
  return L.divIcon({
    className: "waypoint-label",
    html: `<span style="
      font-size: 9px;
      font-weight: 700;
      color: #06b6d4;
      text-shadow: 0 0 2px white, 0 0 2px white, 0 0 2px white;
      white-space: nowrap;
      pointer-events: none;
    ">${code}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, -6],
  });
}

function VertiportMarkers() {
  const visible = useStore((s) => s.layerVisibility.pppVertiports);
  const vertiports = useStore((s) => s.vertiports);
  const zones = useZoneCalculation();

  if (!visible) return null;

  const enabledVertiports = vertiports.filter((v) => v.enabled);
  const zoneMap = new Map(zones.map((z) => [z.vertiportId, z]));

  return (
    <>
      {enabledVertiports.map((v) => {
        const zone = zoneMap.get(v.id);
        const radiusText = zone
          ? `${zone.effectiveRadiusKm.toFixed(1)} km radius`
          : "No zone";

        return (
          <span key={v.id}>
            <CircleMarker
              center={[v.lat, v.lng]}
              radius={8}
              pathOptions={{
                fillColor: categoryColors[v.category] || "#3b82f6",
                fillOpacity: 1,
                color: "#ffffff",
                weight: 2.5,
                opacity: 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <div className="text-xs" style={{ minWidth: 140 }}>
                  <div className="font-bold text-sm">{v.name}</div>
                  <div style={{ borderBottom: "1px solid #e2e8f0", margin: "3px 0" }} />
                  <div className="text-gray-600" style={{ lineHeight: 1.6 }}>
                    <div><strong>Type:</strong> {categoryLabels[v.category]} — {capacityLabels[v.capacity]}</div>
                    <div><strong>Demand:</strong> {v.demand.charAt(0).toUpperCase() + v.demand.slice(1)}</div>
                    <div><strong>Zone:</strong> {radiusText}</div>
                    {zone && zone.exclusivityLevel !== "none" && (
                      <div><strong>Exclusivity:</strong> {zone.exclusivityLevel === "full" ? "Full" : "Conditional"}</div>
                    )}
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
            <Marker
              position={[v.lat, v.lng]}
              icon={createNameLabel(v.name)}
              interactive={false}
            />
          </span>
        );
      })}
    </>
  );
}

function NcthMarkers() {
  const visible = useStore((s) => s.layerVisibility.ncth);
  const locations = useStore((s) => s.ncthLocations);

  if (!visible) return null;

  const enabled = locations.filter((l) => l.enabled);

  return (
    <>
      {enabled.map((loc) => (
        <span key={loc.id}>
          <CircleMarker
            center={[loc.lat, loc.lng]}
            radius={7}
            pathOptions={{
              fillColor: "#10b981",
              fillOpacity: 1,
              color: "#ffffff",
              weight: 2,
              opacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
              <div className="text-xs">
                <div className="font-bold">{loc.name}</div>
                <div className="text-gray-500">NCT&H Location</div>
              </div>
            </Tooltip>
          </CircleMarker>
          <Marker
            position={[loc.lat, loc.lng]}
            icon={createNameLabel(loc.name, "#065f46")}
            interactive={false}
          />
        </span>
      ))}
    </>
  );
}

const heliportCategoryLabels: Record<string, string> = {
  commercial: "Commercial",
  private: "Private",
  hospital: "Hospital",
  hotel: "Hotel",
};

function HeliportMarkers() {
  const visible = useStore((s) => s.layerVisibility.heliports);
  const locations = useStore((s) => s.heliportLocations);

  if (!visible) return null;

  const enabled = locations.filter((l) => l.enabled);

  return (
    <>
      {enabled.map((loc) => (
        <CircleMarker
          key={loc.id}
          center={[loc.lat, loc.lng]}
          radius={6}
          pathOptions={{
            fillColor: "#8b5cf6",
            fillOpacity: 1,
            color: "#ffffff",
            weight: 2,
            opacity: 1,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
            <div className="text-xs">
              <div className="font-bold">{loc.name}</div>
              <div className="text-gray-500">
                Heliport — {loc.category ? heliportCategoryLabels[loc.category] || loc.category : "Unknown"}
              </div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

function HelipadMarkers() {
  const visible = useStore((s) => s.layerVisibility.helipads);
  const locations = useStore((s) => s.helipadLocations);

  if (!visible) return null;

  const enabled = locations.filter((l) => l.enabled);
  const icon = createDiamondIcon("#f59e0b");

  return (
    <>
      {enabled.map((loc) => (
        <span key={loc.id}>
          <Marker
            position={[loc.lat, loc.lng]}
            icon={icon}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              <div className="text-xs">
                <div className="font-bold">{loc.name}</div>
                <div className="text-gray-500">Hybrid Helipad</div>
              </div>
            </Tooltip>
          </Marker>
          <Marker
            position={[loc.lat, loc.lng]}
            icon={createNameLabel(loc.name, "#92400e")}
            interactive={false}
          />
        </span>
      ))}
    </>
  );
}

function VFRRouteOverlay() {
  const visible = useStore((s) => s.layerVisibility.vfrRoutes);

  const waypointMap = useMemo(() => {
    const map = new Map<string, { lat: number; lng: number }>();
    for (const wp of vrpWaypoints) {
      map.set(wp.code, { lat: wp.lat, lng: wp.lng });
    }
    return map;
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Route polylines */}
      {vfrRoutes.map((route) => {
        const positions: [number, number][] = [];
        for (const code of route.waypoints) {
          const wp = waypointMap.get(code);
          if (wp) positions.push([wp.lat, wp.lng]);
        }
        if (positions.length < 2) return null;
        return (
          <Polyline
            key={route.id}
            positions={positions}
            pathOptions={{
              color: "#06b6d4",
              weight: 2,
              opacity: 0.7,
              dashArray: "6 4",
            }}
          >
            <Tooltip sticky opacity={0.95}>
              <div className="text-xs font-medium">{route.name}</div>
            </Tooltip>
          </Polyline>
        );
      })}
      {/* Waypoint markers */}
      {vrpWaypoints.map((wp) => (
        <span key={wp.code}>
          <CircleMarker
            center={[wp.lat, wp.lng]}
            radius={3}
            pathOptions={{
              fillColor: "#06b6d4",
              fillOpacity: 1,
              color: "#ffffff",
              weight: 1.5,
              opacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
              <div className="text-xs">
                <div className="font-bold">{wp.code}</div>
                {wp.name && <div className="text-gray-500">{wp.name}</div>}
              </div>
            </Tooltip>
          </CircleMarker>
          <Marker
            position={[wp.lat, wp.lng]}
            icon={createWaypointLabel(wp.code)}
            interactive={false}
          />
        </span>
      ))}
    </>
  );
}

// Zone colors per layer type
const layerZoneColors: Record<string, { fill: string; stroke: string }> = {
  ncth: { fill: "#10b981", stroke: "#059669" },
  heliport: { fill: "#8b5cf6", stroke: "#7c3aed" },
  helipad: { fill: "#f59e0b", stroke: "#d97706" },
};

function getLayerZoneStyle(
  zone: ZoneResult,
  opacity: number,
  layerType: string
): PathOptions {
  const colors = layerZoneColors[layerType] || layerZoneColors.heliport;
  if (zone.exclusivityLevel === "conditional") {
    return {
      fillColor: colors.fill,
      fillOpacity: opacity * 0.5,
      color: colors.stroke,
      weight: 1,
      opacity: 0.5,
      dashArray: "4 4",
    };
  }
  return {
    fillColor: colors.fill,
    fillOpacity: opacity * 0.7,
    color: colors.stroke,
    weight: 1.5,
    opacity: 0.6,
  };
}

function LayerZoneOverlay({ layerType }: { layerType: "ncth" | "heliport" | "helipad" }) {
  const opacity = useStore((s) => s.zoneOpacity);
  const visible = useStore((s) => s.layerVisibility[layerType === "heliport" ? "heliports" : layerType === "helipad" ? "helipads" : "ncth"]);

  const locationsSelector = layerType === "ncth"
    ? (s: ReturnType<typeof useStore.getState>) => s.ncthLocations
    : layerType === "heliport"
    ? (s: ReturnType<typeof useStore.getState>) => s.heliportLocations
    : (s: ReturnType<typeof useStore.getState>) => s.helipadLocations;

  const locations = useStore(locationsSelector);
  const zones = useLayerZoneCalculation(locations, visible);

  if (!visible || zones.length === 0) return null;

  return (
    <>
      {zones.map((zone) => (
        <span key={`${layerType}-zone-${zone.vertiportId}`}>
          {zone.polygon && (
            <GeoJSON
              key={`${layerType}-z-${zone.vertiportId}-${JSON.stringify(zone.polygon.geometry.coordinates[0]?.slice(0, 2))}`}
              data={zone.polygon}
              style={() => getLayerZoneStyle(zone, opacity, layerType)}
            />
          )}
          {zone.conditionalRing && (
            <GeoJSON
              key={`${layerType}-r-${zone.vertiportId}-${JSON.stringify(zone.conditionalRing.geometry.coordinates[0]?.slice(0, 2))}`}
              data={zone.conditionalRing}
              style={() => getLayerZoneStyle({ ...zone, exclusivityLevel: "conditional" }, opacity, layerType)}
            />
          )}
        </span>
      ))}
    </>
  );
}

function CityBoundaryLayer() {
  const show = useStore((s) => s.showCityBoundary);
  if (!show) return null;
  return <GeoJSON data={cityBoundary} style={() => cityBoundaryStyle} />;
}

export default function MapContent() {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={ABU_DHABI_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={true}
        attributionControl={true}
      >
        <FitBounds />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <CityBoundaryLayer />
        <ZoneOverlays />
        <LayerZoneOverlay layerType="ncth" />
        <LayerZoneOverlay layerType="heliport" />
        <LayerZoneOverlay layerType="helipad" />
        <VertiportMarkers />
        <NcthMarkers />
        <HeliportMarkers />
        <HelipadMarkers />
        <VFRRouteOverlay />
      </MapContainer>
      <MapLegend />
    </div>
  );
}
