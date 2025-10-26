// common/widget/maps/KakaoMaps/useKakaoMapController.ts
import { useRef, useCallback } from 'react';
import {
  MapBounds,
  MapController,
  MapMarker,
  MapMarkerOptions,
  MapPolyline,
  MapPolylineOptions,
  MapPosition
} from '../../../../types/maps/mapTypes';

export function useKakaoMapController(map: kakao.maps.Map | null): MapController | null {
  const markersRef = useRef<Map<string, kakao.maps.Marker>>(new Map());
  const polylinesRef = useRef<Map<string, kakao.maps.Polyline>>(new Map());
  const markerIdCounterRef = useRef(0);
  const polylineIdCounterRef = useRef(0);
  
  const setCenter = useCallback((position: MapPosition) => {
    if (!map) return;
    map.setCenter(new kakao.maps.LatLng(position.lat, position.lng));
  }, [map]);
  
  const getCenter = useCallback((): MapPosition => {
    if (!map) return { lat: 0, lng: 0 };
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  }, [map]);
  
  const setZoom = useCallback((level: number) => {
    if (map) map.setLevel(level);
  }, [map]);
  
  const getZoom = useCallback((): number => {
    return map ? map.getLevel() : 0;
  }, [map]);
  
  const panTo = useCallback((position: MapPosition) => {
    if (!map) return;
    map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
  }, [map]);
  
  const fitBounds = useCallback((bounds: MapBounds, padding = 50) => {
    if (!map) return;
    
    const kakaoBounds = new kakao.maps.LatLngBounds();
    kakaoBounds.extend(new kakao.maps.LatLng(bounds.sw.lat, bounds.sw.lng));
    kakaoBounds.extend(new kakao.maps.LatLng(bounds.ne.lat, bounds.ne.lng));
    
    map.setBounds(kakaoBounds, padding);
  }, [map]);
  
  const addMarker = useCallback((options: MapMarkerOptions): MapMarker => {
    if (!map) {
      console.error('Map not initialized');
      throw new Error('Map not initialized');
    }
    
    const id = `marker-${++markerIdCounterRef.current}`;
    const markerOptions: kakao.maps.MarkerOptions = {
      position: new kakao.maps.LatLng(options.position.lat, options.position.lng),
      map: map,
      title: options.title,
      draggable: options.draggable || false
    };
    
    // 커스텀 아이콘 설정
    if (options.icon) {
      const markerImage = new kakao.maps.MarkerImage(
        options.icon,
        new kakao.maps.Size(32, 32),
        { offset: new kakao.maps.Point(16, 32) }
      );
      markerOptions.image = markerImage;
    }
    
    const kakaoMarker = new kakao.maps.Marker(markerOptions);
    
    // 클릭 이벤트
    if (options.onClick) {
      kakao.maps.event.addListener(kakaoMarker, 'click', options.onClick);
    }
    
    markersRef.current.set(id, kakaoMarker);
    
    return {
      id,
      setPosition: (position: MapPosition) => {
        kakaoMarker.setPosition(new kakao.maps.LatLng(position.lat, position.lng));
      },
      getPosition: () => {
        const pos = kakaoMarker.getPosition();
        return { lat: pos.getLat(), lng: pos.getLng() };
      },
      setVisible: (visible: boolean) => {
        kakaoMarker.setMap(visible ? map : null);
      },
      remove: () => {
        kakaoMarker.setMap(null);
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
    
    const id = `polyline-${++polylineIdCounterRef.current}`;
    const path = options.path.map(pos => new kakao.maps.LatLng(pos.lat, pos.lng));
    
    const polyline = new kakao.maps.Polyline({
      path: path,
      strokeWeight: options.strokeWeight || 5,
      strokeColor: options.strokeColor || '#5347AA',
      strokeOpacity: options.strokeOpacity || 0.8,
      strokeStyle: 'solid' as kakao.maps.StrokeStyles
    });
    
    polyline.setMap(map);
    polylinesRef.current.set(id, polyline);
    
    return {
      id,
      setPath: (newPath: MapPosition[]) => {
        const kakaoPath = newPath.map(pos => new kakao.maps.LatLng(pos.lat, pos.lng));
        polyline.setPath(kakaoPath);
      },
      getPath: () => {
        const path = polyline.getPath();
        return path.map((latLng: any) => ({
          lat: latLng.getLat(),
          lng: latLng.getLng()
        }));
      },
      setVisible: (visible: boolean) => {
        polyline.setMap(visible ? map : null);
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