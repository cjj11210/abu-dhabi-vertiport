"use client";

import { useCallback, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause } from "lucide-react";
import type { DecayCurve } from "@/lib/models/types";

export default function TimeDecayPanel() {
  const params = useStore((s) => s.timeDecayParams);
  const setParams = useStore((s) => s.setTimeDecayParams);
  const isAnimating = useStore((s) => s.isAnimating);
  const setIsAnimating = useStore((s) => s.setIsAnimating);
  const animRef = useRef<NodeJS.Timeout | null>(null);

  const animate = useCallback(() => {
    if (animRef.current) clearInterval(animRef.current);
    animRef.current = setInterval(() => {
      const current = useStore.getState().timeDecayParams;
      if (current.years >= current.maxYears) {
        setIsAnimating(false);
        if (animRef.current) clearInterval(animRef.current);
        return;
      }
      setParams({ years: current.years + 1 });
    }, 500);
  }, [setParams, setIsAnimating]);

  useEffect(() => {
    if (isAnimating) {
      animate();
    } else if (animRef.current) {
      clearInterval(animRef.current);
    }
    return () => {
      if (animRef.current) clearInterval(animRef.current);
    };
  }, [isAnimating, animate]);

  const toggleAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
    } else {
      if (params.years >= params.maxYears) {
        setParams({ years: 0 });
      }
      setIsAnimating(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Initial Radius</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            {params.initialRadiusKm.toFixed(1)} km
          </span>
        </div>
        <Slider
          value={[params.initialRadiusKm]}
          onValueChange={([v]) => setParams({ initialRadiusKm: v })}
          min={0.5}
          max={15}
          step={0.1}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label className="text-sm">Year</Label>
          <span className="text-sm font-mono font-semibold text-blue-600">
            Year {params.years}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAnimation}
            className="shrink-0"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Slider
            value={[params.years]}
            onValueChange={([v]) => {
              setIsAnimating(false);
              setParams({ years: v });
            }}
            min={0}
            max={params.maxYears}
            step={1}
            className="flex-1"
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Now</span>
          <span>{params.maxYears} years</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Decay Curve</Label>
        <Select
          value={params.decayCurve}
          onValueChange={(v) => setParams({ decayCurve: v as DecayCurve })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linear">Linear</SelectItem>
            <SelectItem value="exponential">Exponential (fast start)</SelectItem>
            <SelectItem value="stepped">Stepped (5-year increments)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        Sunset clause visualization. Exclusivity zones shrink over time as the
        market matures. Red → yellow → none.
      </p>
    </div>
  );
}
