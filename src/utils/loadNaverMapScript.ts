// utils/loadNaverMapScript.ts
let isLoading = false;
let isLoaded = false;
let loadPromise: Promise<void> | null = null;

export function loadNaverMapScript(): Promise<void> {
  if (isLoaded && (window as any).naver?.maps) {
    return Promise.resolve();
  }
  
  if (isLoading && loadPromise) {
    return loadPromise;
  }
  
  isLoading = true;
  
  loadPromise = new Promise((resolve, reject) => {
    if ((window as any).naver?.maps) {
      isLoaded = true;
      isLoading = false;
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    const clientId = process.env.REACT_APP_NAVER_MAP_CLIENT_ID;
    
    if (!clientId) {
      console.error('Naver Map Client ID is not defined');
      reject(new Error('Naver Map Client ID is not defined'));
      return;
    }
    
    // 새로운 API URL 형식 사용
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&submodules=geocoder&language=en`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('Naver Maps script loaded');
      
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkInterval = setInterval(() => {
        attempts++;
        
        if ((window as any).naver?.maps?.Map) {
          clearInterval(checkInterval);
          isLoaded = true;
          isLoading = false;
          console.log('Naver Maps API initialized');
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          isLoading = false;
          reject(new Error('Naver Maps API initialization timeout'));
        }
      }, 100);
    };
    
    script.onerror = (error) => {
      isLoading = false;
      console.error('Failed to load Naver Maps script:', error);
      reject(new Error('Failed to load Naver Maps script'));
    };
    
    document.head.appendChild(script);
  });
  
  return loadPromise;
}

export function isNaverMapLoaded(): boolean {
  return isLoaded && !!(window as any).naver?.maps?.Map;
}