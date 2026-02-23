"use client";

import dynamic from "next/dynamic";

const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="text-slate-400 text-sm">Loading map...</div>
    </div>
  ),
});

export default function MapWrapper() {
  return <MapContent />;
}
