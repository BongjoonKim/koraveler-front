export type MapProvider = 'naver' | 'kakao' | 'google';

export interface MapPosition {
  lat: number;
  lng: number;
}

export interface MapMarkerOptions {
  position: MapPosition;
  title?: string;
  icon?: string;
  draggable?: boolean;
  onClick?: () => void;
}

export interface MapPolylineOptions {
  path: MapPosition[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
}

export interface MapBounds {
  sw: MapPosition;
  ne: MapPosition;
}

export interface MapInfoProps {
  provider?: MapProvider;
  center?: MapPosition;
  zoom?: number;
  width?: string;
  height?: string;
  onMapLoad?: (controller: MapController) => void;
}

export interface MapController {
  setCenter: (position: MapPosition) => void;
  getCenter: () => MapPosition;
  setZoom: (level: number) => void;
  getZoom: () => number;
  panTo: (position: MapPosition) => void;
  fitBounds: (bounds: MapBounds, padding?: number) => void;
  
  addMarker: (options: MapMarkerOptions) => MapMarker;
  removeMarker: (marker: MapMarker) => void;
  clearMarkers: () => void;
  
  drawPolyline: (options: MapPolylineOptions) => MapPolyline;
  removePolyline: (polyline: MapPolyline) => void;
  clearPolylines: () => void;
  
  getCurrentLocation: () => Promise<MapPosition>;
  getRawMap: () => any;
}

export interface MapMarker {
  id: string;
  setPosition: (position: MapPosition) => void;
  getPosition: () => MapPosition;
  setVisible: (visible: boolean) => void;
  remove: () => void;
}

export interface MapPolyline {
  id: string;
  setPath: (path: MapPosition[]) => void;
  getPath: () => MapPosition[];
  setVisible: (visible: boolean) => void;
  remove: () => void;
}