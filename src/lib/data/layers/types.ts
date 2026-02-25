export type LayerType = "ncth" | "heliport" | "helipad";

export type HeliportCategory = "commercial" | "private" | "hospital" | "hotel";

export interface MapLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  layerType: LayerType;
  category?: HeliportCategory;
  enabled: boolean;
}

export interface VRPWaypoint {
  code: string;
  name?: string;
  lat: number;
  lng: number;
}

export interface VFRRoute {
  id: string;
  name: string;
  waypoints: string[]; // waypoint codes in order
}
