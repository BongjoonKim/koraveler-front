// /home 다크 세이지-그린 에디토리얼 디자인 토큰
// 컴포넌트에서 hex 를 직접 쓰지 말고 항상 이 토큰을 참조한다.
// design ref: nadeliv-home.design.jsonc, nadeliv-home.html

export const homeTokens = {
  color: {
    bg: "#0a0b0a",
    surface: "#141714",
    surface2: "#101210",
    surface3: "#181b18",
    border: "rgba(255, 255, 255, 0.08)",
    border2: "rgba(255, 255, 255, 0.18)",
    text: "#f3f4f1",
    textSoft: "#cdd6c5",
    textMuted: "#9aa399",
    textFaint: "#7e857d",
    heroTop: "#6a7d68",
    heroMid: "#46553f",
    heroBottom: "#28321f",
    heroGradient:
      "linear-gradient(165deg, #6a7d68 0%, #46553f 42%, #28321f 100%)",
    accent: "#8fbf94",
    accentStrong: "#2e7d52",
    badgeBg: "#243124",
    badgeText: "#bcd0bb",
  },
  font: {
    serif: "'Noto Serif KR', Georgia, serif",
    sans: "'Noto Sans KR', system-ui, sans-serif",
  },
  radius: {
    md: "10px",
    lg: "14px",
    pill: "999px",
  },
  containerMaxW: "1120px",
} as const;

export type HomeTokens = typeof homeTokens;
