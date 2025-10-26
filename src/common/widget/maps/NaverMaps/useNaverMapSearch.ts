// common/hooks/useNaverMapSearch.ts
import { useCallback, useRef, useState } from 'react';
import axios from 'axios';

export interface NaverSearchResult {
  title: string;
  link: string;
  category: string;
  description: string;
  telephone: string;
  address: string;
  roadAddress: string;
  mapx: string;
  mapy: string;
}

export interface NaverGeocodeResult {
  status: string;
  meta: {
    totalCount: number;
    page: number;
    count: number;
  };
  addresses: Array<{
    roadAddress: string;
    jibunAddress: string;
    englishAddress: string;
    x: string;
    y: string;
    distance: number;
  }>;
}

export function useNaverMapSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NaverSearchResult[]>([]);
  
  // Geocoding API 사용 (주소 검색)
  const searchByAddress = useCallback(async (query: string) => {
    if (!query.trim()) return [];
    
    setIsSearching(true);
    try {
      const response = await axios.get('/api/naver/geocode', {
        params: {
          query: query
        }
      });
      
      // 백엔드에서 네이버 Geocoding API 호출 후 결과 반환
      const data: NaverGeocodeResult = response.data;
      
      if (data.meta.totalCount > 0) {
        // Geocode 결과를 SearchResult 형태로 변환
        const results: NaverSearchResult[] = data.addresses.map((addr, index) => ({
          title: addr.jibunAddress || addr.roadAddress,
          link: '',
          category: '주소',
          description: '',
          telephone: '',
          address: addr.jibunAddress,
          roadAddress: addr.roadAddress,
          mapx: addr.x,
          mapy: addr.y
        }));
        
        setSearchResults(results);
        return results;
      }
      
      setSearchResults([]);
      return [];
    } catch (error) {
      console.error('Address search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  // Local Search API 사용 (장소 검색)
  const searchByKeyword = useCallback(async (query: string, x?: number, y?: number) => {
    if (!query.trim()) return [];
    
    setIsSearching(true);
    try {
      const response = await axios.get('/api/naver/search/local', {
        params: {
          query: query,
          display: 20,
          start: 1,
          sort: 'random',
          ...(x && y && { x, y })
        }
      });
      
      // 백엔드에서 네이버 Local API 호출 후 결과 반환
      const items = response.data.items || [];
      
      // HTML 태그 제거 함수
      const removeHtmlTags = (str: string) => {
        return str.replace(/<[^>]*>/g, '');
      };
      
      const results: NaverSearchResult[] = items.map((item: any) => ({
        title: removeHtmlTags(item.title),
        link: item.link,
        category: item.category,
        description: item.description,
        telephone: item.telephone,
        address: item.address,
        roadAddress: item.roadAddress,
        mapx: item.mapx,
        mapy: item.mapy
      }));
      
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Keyword search error:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);
  
  const clearResults = useCallback(() => {
    setSearchResults([]);
  }, []);
  
  // 네이버 좌표를 WGS84 좌표로 변환 (EPSG:5179 -> WGS84)
  const convertNaverToWGS84 = useCallback((mapx: string, mapy: string) => {
    // 네이버 지도 API는 카텍 좌표계(EPSG:5179)를 사용
    // 실제 변환은 백엔드에서 처리하거나 proj4js 라이브러리 사용
    // 여기서는 간단한 근사값 변환
    const x = parseFloat(mapx);
    const y = parseFloat(mapy);
    
    // 이 부분은 실제로는 더 정확한 변환이 필요합니다
    // 백엔드에서 proj4 라이브러리를 사용하여 변환하는 것을 권장
    const lng = x / 10000000;
    const lat = y / 10000000;
    
    return { lat, lng };
  }, []);
  
  return {
    isSearching,
    searchResults,
    searchByAddress,
    searchByKeyword,
    clearResults,
    convertNaverToWGS84
  };
}