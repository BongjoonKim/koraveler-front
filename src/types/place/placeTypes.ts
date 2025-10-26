// types/place/placeTypes.ts

export interface PlaceSearchRequest {
  keyword: string;
}

export interface PlaceSearchResponse {
  keyword: string;
  places: PlaceItem[];
  totalCount: number;
}

export interface PlaceItem {
  id: string;
  name: string;           // 한국어 이름
  nameEn: string;         // 영어 이름
  category: string;       // 한국어 카테고리
  categoryEn: string;     // 영어 카테고리
  phone: string;
  addressKo: string;      // 한국어 주소
  roadAddressKo: string;  // 한국어 도로명 주소
  addressEn: string;      // 영어 주소
  lat: number;
  lng: number;
}
