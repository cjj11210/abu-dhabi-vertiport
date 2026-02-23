"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useStore } from "@/lib/store";
import { useZoneCalculation } from "@/hooks/useZoneCalculation";
import { cityBoundary } from "@/lib/data/city-boundary";
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

// Category colors for markers
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
  const zones = useZoneCalculation();
  const opacity = useStore((s) => s.zoneOpacity);

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

function createNameLabel(name: string) {
  return L.divIcon({
    className: "vertiport-label",
    html: `<span style="
      font-size: 11px;
      font-weight: 600;
      color: #1e293b;
      text-shadow: 0 0 3px white, 0 0 3px white, 0 0 3px white, 0 0 3px white;
      white-space: nowrap;
      pointer-events: none;
    ">${name}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, -12],
  });
}

function VertiportMarkers() {
  const vertiports = useStore((s) => s.vertiports);
  const zones = useZoneCalculation();
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
        <VertiportMarkers />
      </MapContainer>
      <MapLegend />
    </div>
  );
}
