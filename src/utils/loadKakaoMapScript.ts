// utils/loadKakaoMapScript.ts - Alternative Version
let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

declare global {
  interface Window {
    kakao: any;
    kakaoMapApiLoaded?: boolean;
  }
}

export function loadKakaoMapScript(): Promise<void> {
  // 이미 로드된 경우
  if (isLoaded && window.kakao?.maps) {
    console.log('Kakao Maps already loaded');
    return Promise.resolve();
  }
  
  // 로딩 중인 경우
  if (isLoading && loadPromise) {
    console.log('Kakao Maps loading in progress');
    return loadPromise;
  }
  
  isLoading = true;
  
  loadPromise = new Promise((resolve, reject) => {
    // 이미 로드되었는지 다시 체크
    if (window.kakao?.maps?.Map) {
      console.log('Kakao Maps found in window');
      isLoaded = true;
      isLoading = false;
      resolve();
      return;
    }
    
    // 이미 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
    if (existingScript) {
      console.log('Kakao script tag already exists');
      
      // 로드 완료 대기
      const waitForLoad = setInterval(() => {
        if (window.kakao?.maps?.Map) {
          clearInterval(waitForLoad);
          isLoaded = true;
          isLoading = false;
          console.log('Kakao Maps API ready');
          resolve();
        }
      }, 100);
      
      // 타임아웃 설정
      setTimeout(() => {
        clearInterval(waitForLoad);
        if (!isLoaded) {
          isLoading = false;
          reject(new Error('Kakao Maps loading timeout'));
        }
      }, 10000);
      
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    const appKey = process.env.REACT_APP_KAKAO_MAP_APP_KEY;
    
    if (!appKey) {
      console.error('Kakao Map App Key is not defined in environment variables');
      isLoading = false;
      reject(new Error('Kakao Map App Key is not defined'));
      return;
    }
    
    // 카카오맵 SDK URL - https 명시
    const scriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&libraries=services,clusterer,drawing`;
    script.src = scriptUrl;
    script.async = true;
    script.defer = false; // defer를 false로 변경
    
    console.log('Loading Kakao Maps script:', scriptUrl);
    
    // 로드 성공 처리
    script.onload = () => {
      console.log('Kakao Maps script tag loaded');

      // API 초기화 대기
      let attempts = 0;
      const maxAttempts = 100; // 10초 대기

      const checkReady = setInterval(() => {
        attempts++;

        // window.kakao.maps 객체 확인
        if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
          clearInterval(checkReady);
          isLoaded = true;
          isLoading = false;
          window.kakaoMapApiLoaded = true;
          console.log('Kakao Maps API fully initialized');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkReady);
          isLoading = false;
          console.error('Kakao Maps API initialization timeout');
          reject(new Error('Kakao Maps API initialization timeout'));
        } else if (attempts % 10 === 0) {
          console.log(`Waiting for Kakao Maps API... (${attempts/10}s)`);
        }
      }, 100);
    };
    
    // 로드 실패 처리
    script.onerror = (error) => {
      isLoading = false;
      console.error('Failed to load Kakao Maps script:', error);
      
      // 스크립트 태그 제거
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      reject(new Error('Failed to load Kakao Maps script. Check your API key and domain settings.'));
    };
    
    // 스크립트 추가
    document.head.appendChild(script);
    console.log('Kakao Maps script tag appended to document');
  });
  
  return loadPromise;
}

export function isKakaoMapLoaded(): boolean {
  const loaded = isLoaded && !!(window.kakao?.maps?.Map);
  if (!loaded && window.kakao) {
    console.log('Kakao object exists but maps not ready:', {
      kakao: !!window.kakao,
      maps: !!window.kakao?.maps,
      Map: !!window.kakao?.maps?.Map
    });
  }
  return loaded;
}

// 디버깅용 함수
export function getKakaoMapStatus() {
  return {
    isLoading,
    isLoaded,
    hasKakaoObject: !!window.kakao,
    hasKakaoMaps: !!window.kakao?.maps,
    hasKakaoMapConstructor: !!window.kakao?.maps?.Map,
    apiKey: process.env.REACT_APP_KAKAO_MAP_APP_KEY ? 'Set' : 'Not Set'
  };
}