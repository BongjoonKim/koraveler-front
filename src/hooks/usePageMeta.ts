import { useEffect } from "react";

const DEFAULT_TITLE = "Nadeliv — Discover Korea Beyond Seoul";

/**
 * 페이지별 SEO 메타(브라우저 타이틀 + meta description) 설정 훅.
 * CSR 환경에서 Googlebot 렌더링 시 페이지별 title/description 이 인덱싱되도록 한다.
 * 언마운트 시 기본값으로 복원.
 */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    if (title) {
      window.document.title = `${title} | Nadeliv`;
    }
    return () => {
      window.document.title = DEFAULT_TITLE;
    };
  }, [title]);

  useEffect(() => {
    if (!description) return;

    const meta = window.document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (!meta) return;

    const original = meta.content;
    // HTML 태그 제거 후 앞 160자만 사용
    const plain = description.replace(/<[^>]*>/g, "").trim().slice(0, 160);
    if (plain) {
      meta.content = plain;
    }
    return () => {
      meta.content = original;
    };
  }, [description]);
}

export default usePageMeta;
