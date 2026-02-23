"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar/Sidebar";
import MapWrapper from "@/components/map/MapWrapper";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 w-8 p-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div>
            <h1 className="text-sm font-semibold text-slate-800">
              Abu Dhabi Vertiport Exclusivity Zone Planner
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Visualize how different exclusivity models affect private operator access across 14 government vertiport sites
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:w-[380px] shrink-0">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="lg:hidden absolute inset-0 z-30 flex">
            <div className="w-full max-w-[380px] bg-white shadow-xl">
              <Sidebar />
            </div>
            <div
              className="flex-1 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <MapWrapper />
        </div>
      </div>
    </div>
  );
}
