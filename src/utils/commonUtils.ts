
// 숫자 판별
export const isNumber = (value : any) => {
  if (value) {
    const numberPattern = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    return numberPattern.test(value);
  } else {
    return false;
  }
};

// uuid 생성
export const uuid = () => {
  return "xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : r & (0x3 | 0x8);
    return v.toString(16);
  });
}

// html 태그 제거
// TypeScript 인터페이스 정의
interface ExtractTextAdvancedOptions {
  preserveLineBreaks?: boolean;
  maxLength?: number | null;
  ellipsisType?: string;
}

/**
 * 방법 4: 고급 옵션이 포함된 함수 (수정된 버전)
 * - 줄바꿈 보존, 최대 길이 제한 등의 옵션 제공
 * - preserveLineBreaks 로직 수정
 */
export const extractTextAdvanced = (htmlString?: string, options?: ExtractTextAdvancedOptions) => {
  const {
    preserveLineBreaks = false,  // 기본값을 false로 변경
    maxLength = null,           // 최대 길이 제한
    ellipsisType = '...'        // 말줄임표
  } = options || {};
  
  if (!htmlString || typeof htmlString !== 'string') {
    return '';
  }
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    let text = '';
    console.log("htmlString", htmlString)
    if (preserveLineBreaks) {
      // <br>, <p>, <div> 등을 줄바꿈으로 변환
      const brElements = doc.querySelectorAll('br');
      brElements.forEach(br => br.replaceWith('\n'));
      
      const blockElements = doc.querySelectorAll('p, div, h1, h2, h3, h4, h5, h6, li');
      blockElements.forEach(el => {
        el.insertAdjacentText('afterend', '\n');
      });
      
      text = doc.body.textContent || '';
      
      // preserveLineBreaks가 true일 때는 줄바꿈 보존하면서 정리
      text = text
        .replace(/[ \t]+/g, ' ')        // 공백과 탭만 하나로 정리 (줄바꿈은 보존)
        .replace(/\n\s*\n/g, '\n')      // 연속된 빈 줄을 하나로 정리
        .trim();
    } else {
      text = doc.body.textContent || '';
      
      // preserveLineBreaks가 false일 때는 모든 공백을 하나로 정리
      text = text.replace(/\s+/g, ' ').trim();
    }
    
    // 최대 길이 제한
    if (maxLength && text.length > maxLength) {
      text = text.substring(0, maxLength - ellipsisType.length) + ellipsisType;
    }
    
    console.log("extracted text:", text);
    return text;
  } catch (error) {
    console.error('고급 텍스트 추출 중 오류 발생:', error);
    return '';
  }
};


