import {useRef, useCallback, useState, useEffect} from 'react';
import {
  MapBounds,
  MapController,
  MapMarker,
  MapMarkerOptions, MapPolyline,
  MapPolylineOptions,
  MapPosition,
  MapProvider
} from '../../../../types/maps/mapTypes';
import {isNaverMapLoaded, loadNaverMapScript} from "../../../../utils/loadNaverMapScript";
import {NaverMapProps} from "./NaverMap";

export function useNaverMapController(props: NaverMapProps) {
  const {
    center,
    zoom,
    onMapLoad,
    provider
  } = props;
  
  const markersRef = useRef<Map<string, any>>(new Map());
  const polylinesRef = useRef<Map<string, any>>(new Map());
  const markerIdCounterRef = useRef(0);
  const polylineIdCounterRef = useRef(0);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadNaverMapScript()
      .then(() => {
        console.log('NaverMap: Script loaded successfully');
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Failed to load Naver Maps:', err);
        setError('Naver Maps API load fail');
      });
  }, []);
  
  const initializeMap = useCallback(() => {
    console.log("initializeMap mapRef", mapRef);
    console.log("initializeMap mapInstanceRef", mapInstanceRef);
    
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const naverMaps = (window as any).naver?.maps;
    if (!naverMaps) {
      console.error('NaverMap: naver.maps not available');
      return;
    }
    
    try {
      console.log('NaverMap: Creating map instance...');
      const mapOptions = {
        center: new naverMaps.LatLng(center?.lat, center?.lng),
        zoom: zoom,
        draggable: true,
        pinchZoom: true,
        scrollWheel: true,
        disableKineticPan: false,
        zoomControl: true,
        zoomControlOptions: {
          style: naverMaps.ZoomControlStyle.SMALL,
          position: naverMaps.Position.TOP_RIGHT
        },
        mapDataControl: false,
        scaleControl: false,
        logoControl: false,
        mapTypeControl: false
      };
      
      const mapInstance = new naverMaps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = mapInstance;
      console.log("mapInstance 정보", mapInstance);
      console.log('NaverMap: Map instance created');
      
      setTimeout(() => {
        if (mapInstanceRef.current) {
          const naverEvent = naverMaps.Event;
          naverEvent.trigger(mapInstanceRef.current, 'resize');
          console.log('NaverMap: Map resized');
        }
      }, 100);
      
      let isFirstIdle = true;
      naverMaps.Event.addListener(mapInstance, 'idle', () => {
        if (isFirstIdle) {
          isFirstIdle = false;
          console.log('NaverMap: Map idle event fired');
          
          const naverEvent = naverMaps.Event;
          naverEvent.trigger(mapInstance, 'resize');
          
          if (onMapLoad) {
            setTimeout(() => {
              onMapLoad(mapInstance);
            }, 100);
          }
        }
      });
      
    } catch (err: any) {
      console.error('Map initialization error:', err);
      setError(`initial map error: ${err.message}`);
    }
  }, []);
  
  useEffect(() => {
    if (!isReady || !mapRef.current || mapInstanceRef.current) return;
    console.log("여기여기", isNaverMapLoaded());
    
    const checkAndInit = () => {
      if (isNaverMapLoaded()) {
        initializeMap();
      } else {
        setTimeout(checkAndInit, 100);
      }
    };
    
    checkAndInit();
  }, [isReady, isNaverMapLoaded]);
  
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [zoom]);
  
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const handleResize = () => {
      const naverMaps = (window as any).naver?.maps;
      if (naverMaps && mapInstanceRef.current) {
        const naverEvent = naverMaps.Event;
        naverEvent.trigger(mapInstanceRef.current, 'resize');
      }
    };
    
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    
    if (mapRef.current) {
      resizeObserver.observe(mapRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [mapInstanceRef.current]);
  
  const getNaver = () => {
    const naver = (window as any).naver?.maps;
    if (!naver) {
      console.warn('Naver Maps API is not loaded');
    }
    return naver;
  };
  
  const setCenter = useCallback((position: MapPosition) => {
    console.log("여기 setCenter 오나", position, mapInstanceRef.current);
    if (!mapInstanceRef.current) return;
    const naver = getNaver();
    if (!naver) return;
    mapInstanceRef.current.setCenter(new naver.LatLng(position.lat, position.lng));
  }, []);
  
  const getCenter = useCallback((): MapPosition => {
    if (!mapInstanceRef.current) return { lat: 0, lng: 0 };
    const center = mapInstanceRef.current.getCenter();
    return { lat: center.lat(), lng: center.lng() };
  }, []);
  
  const setZoom = useCallback((level: number) => {
    if (mapInstanceRef.current) mapInstanceRef.current.setZoom(level);
  }, []);
  
  const getZoom = useCallback((): number => {
    return mapInstanceRef.current ? mapInstanceRef.current.getZoom() : 0;
  }, []);
  
  const panTo = useCallback((position: MapPosition) => {
    if (!mapInstanceRef.current) return;
    const naver = getNaver();
    if (!naver) return;
    mapInstanceRef.current.panTo(new naver.LatLng(position.lat, position.lng));
  }, []);
  
  const fitBounds = useCallback((bounds: MapBounds, padding = 50) => {
    if (!mapInstanceRef.current) return;
    const naver = getNaver();
    if (!naver) return;
    
    const naverBounds = new naver.LatLngBounds(
      new naver.LatLng(bounds.sw.lat, bounds.sw.lng),
      new naver.LatLng(bounds.ne.lat, bounds.ne.lng)
    );
    mapInstanceRef.current.fitBounds(naverBounds, {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    });
  }, []);
  
  const addMarker = useCallback((options: MapMarkerOptions): MapMarker => {
    if (!mapInstanceRef.current) {
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
      map: mapInstanceRef.current,
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
  }, []);
  
  const removeMarker = useCallback((marker: MapMarker) => {
    marker.remove();
  }, []);
  
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current.clear();
  }, []);
  
  const drawPolyline = useCallback((options: MapPolylineOptions): MapPolyline => {
    if (!mapInstanceRef.current) throw new Error('Map not initialized');
    const naver = getNaver();
    if (!naver) throw new Error('Naver Maps API not loaded');
    
    const id = `polyline-${++polylineIdCounterRef.current}`;
    const path = options.path.map(pos => new naver.LatLng(pos.lat, pos.lng));
    
    const polyline = new naver.Polyline({
      map: mapInstanceRef.current,
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
  }, []);
  
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
  
  const getRawMap = useCallback(() => mapInstanceRef.current, []);
  
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
    getRawMap,
    error,
    isReady,
    mapRef,
    map: mapInstanceRef.current
  };
}