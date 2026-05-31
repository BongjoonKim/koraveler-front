import React from "react";

/**
 * 시안 기준 산 일러스트. SVG inline 으로 두어 색감을 hero gradient 와 함께 일관되게 톤다운.
 * 글마다 사진이 바뀌지 않도록 페이지의 시그니처로 고정.
 */
function MountainBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 480"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
      aria-hidden
    >
      <defs>
        {/* 시안 톤: 위쪽 sage green → 아래쪽 deep forest. teal-회색 대신 자연스러운 녹색 계열. */}
        <linearGradient id="hero-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7d9786" />
          <stop offset="45%" stopColor="#506b5c" />
          <stop offset="100%" stopColor="#1f2a23" />
        </linearGradient>
      </defs>

      <rect width="1200" height="480" fill="url(#hero-bg)" />

      {/* 뒤쪽 산 — 가장 옅은 톤 */}
      <path
        d="M0 320 L120 220 L260 290 L400 200 L540 280 L680 210 L820 270 L960 220 L1100 280 L1200 250 L1200 480 L0 480 Z"
        fill="rgba(255,255,255,0.06)"
      />
      {/* 중간 산 */}
      <path
        d="M0 360 L100 280 L240 330 L380 250 L520 320 L640 260 L780 320 L900 270 L1040 330 L1200 290 L1200 480 L0 480 Z"
        fill="rgba(255,255,255,0.1)"
      />
      {/* 앞쪽 산 — 가장 진한 톤 */}
      <path
        d="M0 410 L80 350 L200 390 L320 330 L460 400 L580 340 L720 400 L860 350 L1000 410 L1120 360 L1200 400 L1200 480 L0 480 Z"
        fill="rgba(0,0,0,0.25)"
      />
    </svg>
  );
}

export default MountainBackdrop;
