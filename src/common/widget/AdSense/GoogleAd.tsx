// src/common/widget/AdSense/GoogleAd.tsx
// Google AdSense 광고 단위를 렌더링하는 저수준 컴포넌트.
// - 게시자 ID(REACT_APP_ADSENSE_CLIENT) 가 있어야만 로더 스크립트를 주입/광고를 노출.
// - 설정이 없으면 운영에서는 아무것도 렌더하지 않고, 개발에서만 자리표시자를 보여줌.

import { useEffect, useRef } from "react";
import styled from "styled-components";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// ca-pub-XXXXXXXXXXXXXXXX 형태의 게시자 ID (AdSense 계정 하나당 하나)
const ADSENSE_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT || "";
const ADSENSE_SCRIPT_ID = "google-adsense-loader";

// AdSense 로더 스크립트를 최초 1회만 <head> 에 주입 (client ID 있을 때만).
// window.adsbygoogle 은 스크립트 로드 전에도 배열로 큐잉되므로 push 는 언제 호출해도 안전.
function ensureAdSenseScript(client: string) {
  if (typeof document === "undefined") return;
  if (document.getElementById(ADSENSE_SCRIPT_ID)) return;
  // index.html <head> 에 이미 로더가 있으면 중복 주입 방지
  if (document.querySelector('script[src*="adsbygoogle.js"]')) return;
  const script = document.createElement("script");
  script.id = ADSENSE_SCRIPT_ID;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
  document.head.appendChild(script);
}

export interface GoogleAdProps {
  slot?: string;
  // 인아티클 광고: layout="in-article", format="fluid"
  // 반응형 디스플레이 광고: format="auto", fullWidthResponsive=true
  layout?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  className?: string;
}

function GoogleAd({
  slot,
  layout = "in-article",
  format = "fluid",
  fullWidthResponsive = false,
  className,
}: GoogleAdProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot) return;
    ensureAdSenseScript(ADSENSE_CLIENT);
    // StrictMode(dev) 이중 실행/중복 push 방지: <ins> 하나당 한 번만 push
    if (pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // 광고 차단기 등으로 실패해도 페이지 동작에는 영향 없음
    }
  }, [slot]);

  // 설정이 없으면: 개발에서는 자리표시자, 운영에서는 렌더 안 함
  if (!ADSENSE_CLIENT || !slot) {
    if (process.env.NODE_ENV === "development") {
      return (
        <Placeholder className={className}>
          AdSense 미설정 — REACT_APP_ADSENSE_CLIENT / slot 환경변수를 채우면 광고가 노출됩니다.
        </Placeholder>
      );
    }
    return null;
  }

  return (
    <ins
      className={`adsbygoogle${className ? ` ${className}` : ""}`}
      style={{ display: "block", textAlign: "center" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={slot}
      data-ad-layout={layout || undefined}
      data-ad-format={format || undefined}
      data-full-width-responsive={fullWidthResponsive ? "true" : undefined}
    />
  );
}

export default GoogleAd;

const Placeholder = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 90px;
    padding: 1rem;
    border: 1px dashed rgba(80, 107, 92, 0.45);
    border-radius: 10px;
    color: #94a3a0;
    font-size: 13px;
    text-align: center;
`;
