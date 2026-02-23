"use client";

import { useStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categoryBadgeColors: Record<string, string> = {
  "urban-core": "bg-blue-100 text-blue-700",
  urban: "bg-sky-100 text-sky-700",
  suburban: "bg-green-100 text-green-700",
  industrial: "bg-gray-100 text-gray-700",
  remote: "bg-orange-100 text-orange-700",
};

export default function VertiportToggles() {
  const vertiports = useStore((s) => s.vertiports);
  const toggleVertiport = useStore((s) => s.toggleVertiport);
  const setAllVertiports = useStore((s) => s.setAllVertiports);

  const allEnabled = vertiports.every((v) => v.enabled);
  const noneEnabled = vertiports.every((v) => !v.enabled);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Vertiports
        </span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setAllVertiports(true)}
            disabled={allEnabled}
          >
            All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => setAllVertiports(false)}
            disabled={noneEnabled}
          >
            None
          </Button>
        </div>
      </div>
      <div className="space-y-1 max-h-[240px] overflow-y-auto pr-1">
        {vertiports.map((v) => (
          <div
            key={v.id}
            className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Switch
                checked={v.enabled}
                onCheckedChange={() => toggleVertiport(v.id)}
                className="shrink-0 scale-75"
              />
              <span className="text-sm truncate">{v.name}</span>
            </div>
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 py-0 shrink-0 ${categoryBadgeColors[v.category] || ""}`}
            >
              {v.capacity}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
