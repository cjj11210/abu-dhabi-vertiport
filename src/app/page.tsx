"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/sidebar/Sidebar";
import MapWrapper from "@/components/map/MapWrapper";
import LoginPage from "@/components/LoginPage";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("archer-auth") === "true") {
      setAuthenticated(true);
    }
  }, []);

  function handleAuth() {
    sessionStorage.setItem("archer-auth", "true");
    setAuthenticated(true);
  }

  if (!authenticated) {
    return <LoginPage onAuth={handleAuth} />;
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="h-14 flex items-center justify-between px-4 shrink-0 z-20"
        style={{ backgroundColor: "#000000" }}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden h-8 w-8 p-0 text-white hover:bg-white/10"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Image
            src="/archer-logo-white.png"
            alt="Archer"
            width={120}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
          <div
            style={{
              width: "1px",
              height: "24px",
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          />
          <div>
            <p
              className="hidden sm:block"
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              VERTIPORT NETWORK PLANNER
            </p>
            <p
              className="hidden sm:block"
              style={{
                fontSize: "12px",
                fontWeight: 100,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              Abu Dhabi Exclusivity Zone Analysis
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
