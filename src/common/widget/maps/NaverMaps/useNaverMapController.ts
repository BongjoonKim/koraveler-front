import { useRef, useCallback } from 'react';
import {
  MapBounds,
  MapController,
  MapMarker,
  MapMarkerOptions, MapPolyline,
  MapPolylineOptions,
  MapPosition
} from '../../../../types/maps/mapTypes';

export function useNaverMapController(map: any): MapController | null {
  const markersRef = useRef<Map<string, any>>(new Map());
  const polylinesRef = useRef<Map<string, any>>(new Map());
  const markerIdCounterRef = useRef(0);
  const polylineIdCounterRef = useRef(0);
  
  const getNaver = () => {
    const naver = (window as any).naver?.maps;
    if (!naver) {
      console.warn('Naver Maps API is not loaded');
    }
    return naver;
  };
  
  const setCenter = useCallback((position: MapPosition) => {
    if (!map) return;
    const naver = getNaver();
    if (!naver) return;
    map.setCenter(new naver.LatLng(position.lat, position.lng));
  }, [map]);
  
  const getCenter = useCallback((): MapPosition => {
    if (!map) return { lat: 0, lng: 0 };
    const center = map.getCenter();
    return { lat: center.lat(), lng: center.lng() };
  }, [map]);
  
  const setZoom = useCallback((level: number) => {
    if (map) map.setZoom(level);
  }, [map]);
  
  const getZoom = useCallback((): number => {
    return map ? map.getZoom() : 0;
  }, [map]);
  
  const panTo = useCallback((position: MapPosition) => {
    if (!map) return;
    const naver = getNaver();
    if (!naver) return;
    map.panTo(new naver.LatLng(position.lat, position.lng));
  }, [map]);
  
  const fitBounds = useCallback((bounds: MapBounds, padding = 50) => {
    if (!map) return;
    const naver = getNaver();
    if (!naver) return;
    
    const naverBounds = new naver.LatLngBounds(
      new naver.LatLng(bounds.sw.lat, bounds.sw.lng),
      new naver.LatLng(bounds.ne.lat, bounds.ne.lng)
    );
    map.fitBounds(naverBounds, { top: padding, right: padding, bottom: padding, left: padding });
  }, [map]);
  
  const addMarker = useCallback((options: MapMarkerOptions): MapMarker => {
    if (!map) {
      console.error('Map not initialized');
      throw new Error('Map not initialized');
    }
    
    const naver = getNaver();
    if (!naver) {
      console.error('Naver Maps API not loaded yet');
      throw new Error('Naver Maps API not loaded');
    }
    
    const id = `marker-${++markerIdCounterRef.current}`;
    const markerOptions: any = {
      position: new naver.LatLng(options.position.lat, options.position.lng),
      map: map,
      title: options.title,
      draggable: options.draggable || false
    };
    
    if (options.icon) {
      markerOptions.icon = {
        content: options.icon,
        anchor: new naver.Point(16, 32)
      };
    }
    
    const naverMarker = new naver.Marker(markerOptions);
    
    if (options.onClick) {
      naver.Event.addListener(naverMarker, 'click', options.onClick);
    }
    
    markersRef.current.set(id, naverMarker);
    
    return {
      id,
      setPosition: (position: MapPosition) => {
        naverMarker.setPosition(new naver.LatLng(position.lat, position.lng));
      },
      getPosition: () => {
        const pos = naverMarker.getPosition();
        return { lat: pos.lat(), lng: pos.lng() };
      },
      setVisible: (visible: boolean) => {
        naverMarker.setVisible(visible);
      },
      remove: () => {
        naverMarker.setMap(null);
        markersRef.current.delete(id);
      }
    };
  }, [map]);
  
  const removeMarker = useCallback((marker: MapMarker) => {
    marker.remove();
  }, []);
  
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();
  }, []);
  
  const drawPolyline = useCallback((options: MapPolylineOptions): MapPolyline => {
    if (!map) throw new Error('Map not initialized');
    const naver = getNaver();
    if (!naver) throw new Error('Naver Maps API not loaded');
    
    const id = `polyline-${++polylineIdCounterRef.current}`;
    const path = options.path.map(pos => new naver.LatLng(pos.lat, pos.lng));
    
    const polyline = new naver.Polyline({
      map: map,
      path: path,
      strokeColor: options.strokeColor || '#5347AA',
      strokeWeight: options.strokeWeight || 5,
      strokeOpacity: options.strokeOpacity || 0.8,
      strokeStyle: 'solid'
    });
    
    polylinesRef.current.set(id, polyline);
    
    return {
      id,
      setPath: (newPath: MapPosition[]) => {
        const naverPath = newPath.map(pos => new naver.LatLng(pos.lat, pos.lng));
        polyline.setPath(naverPath);
      },
      getPath: () => {
        const path = polyline.getPath();
        return path.map((latLng: any) => ({ lat: latLng.lat(), lng: latLng.lng() }));
      },
      setVisible: (visible: boolean) => {
        polyline.setVisible(visible);
      },
      remove: () => {
        polyline.setMap(null);
        polylinesRef.current.delete(id);
      }
    };
  }, [map]);
  
  const removePolyline = useCallback((polyline: MapPolyline) => {
    polyline.remove();
  }, []);
  
  const clearPolylines = useCallback(() => {
    polylinesRef.current.forEach(polyline => polyline.setMap(null));
    polylinesRef.current.clear();
  }, []);
  
  const getCurrentLocation = useCallback(async (): Promise<MapPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  }, []);
  
  const getRawMap = useCallback(() => map, [map]);
  
  if (!map) return null;
  
  return {
    setCenter,
    getCenter,
    setZoom,
    getZoom,
    panTo,
    fitBounds,
    addMarker,
    removeMarker,
    clearMarkers,
    drawPolyline,
    removePolyline,
    clearPolylines,
    getCurrentLocation,
    getRawMap
  };
}