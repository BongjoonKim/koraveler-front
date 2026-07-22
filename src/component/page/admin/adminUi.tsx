// 관리자(admin) 화면 공용 다크 UI 킷 — 다크 세이지-그린 에디토리얼 (DESIGN.md)
// 색/폰트/radius 는 homeTokens 만 참조한다. hex 직접 입력 금지.
import styled from "styled-components";
import { homeTokens } from "../MainPage/MainBody/homeTokens";

const t = homeTokens;

/* ---------- 페이지 골격 ---------- */

export const AdminShell = styled.div`
  width: 100%;
  min-height: 100%;
  background: ${t.color.bg};
  color: ${t.color.text};
  font-family: ${t.font.sans};
`;

export const AdminInner = styled.div`
  max-width: ${t.containerMaxW};
  margin: 0 auto;
  padding: 40px 24px 72px;

  @media (max-width: 768px) {
    padding: 28px 16px 56px;
  }
`;

export const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${t.color.accent};
  margin-bottom: 10px;
`;

export const PageTitle = styled.h1`
  font-family: ${t.font.serif};
  font-size: 34px;
  font-weight: 600;
  line-height: 1.25;
  color: ${t.color.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 27px;
  }
`;

export const PageSub = styled.p`
  font-size: 14px;
  color: ${t.color.textMuted};
  line-height: 1.6;
  margin: 8px 0 0;
  max-width: 560px;
`;

/* ---------- 탭 바 ---------- */

export const TabBar = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 28px 0 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${t.color.border};
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  appearance: none;
  border: 1px solid ${(p) => (p.$active ? "transparent" : t.color.border)};
  border-radius: ${t.radius.pill};
  padding: 8px 18px;
  font-family: ${t.font.sans};
  font-size: 13.5px;
  font-weight: 500;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: all 0.18s ease;
  background: ${(p) => (p.$active ? t.color.badgeBg : "transparent")};
  color: ${(p) => (p.$active ? t.color.badgeText : t.color.textMuted)};

  &:hover {
    color: ${(p) => (p.$active ? t.color.badgeText : t.color.textSoft)};
    background: ${(p) => (p.$active ? t.color.badgeBg : t.color.surface3)};
  }
`;

/* ---------- 카드 ---------- */

export const Card = styled.section`
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 22px;
`;

export const SectionTitle = styled.h2`
  font-family: ${t.font.serif};
  font-size: 19px;
  font-weight: 600;
  color: ${t.color.text};
  margin: 0;
`;

/* ---------- 버튼 ---------- */

export const PrimaryButton = styled.button`
  appearance: none;
  border: none;
  border-radius: ${t.radius.pill};
  padding: 9px 20px;
  font-family: ${t.font.sans};
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  background: ${t.color.accentStrong};
  color: ${t.color.text};
  transition: filter 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 7px;

  &:hover { filter: brightness(1.12); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const GhostButton = styled.button`
  appearance: none;
  border: 1px solid ${t.color.border2};
  border-radius: ${t.radius.pill};
  padding: 8px 18px;
  font-family: ${t.font.sans};
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  background: transparent;
  color: ${t.color.textSoft};
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 7px;

  &:hover { background: ${t.color.surface3}; color: ${t.color.text}; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const DangerButton = styled(GhostButton)`
  color: #d99;
  border-color: rgba(221, 153, 153, 0.35);

  &:hover { background: rgba(180, 60, 60, 0.14); color: #eaa; }
`;

/* ---------- 폼 ---------- */

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  width: 100%;
`;

export const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${t.color.textSoft};
`;

export const TextInput = styled.input`
  width: 100%;
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.md};
  padding: 10px 13px;
  font-family: ${t.font.sans};
  font-size: 14px;
  color: ${t.color.text};
  outline: none;
  transition: border-color 0.15s ease;

  &::placeholder { color: ${t.color.textFaint}; }
  &:focus { border-color: ${t.color.accent}; }
`;

/* ---------- 상태 표시 ---------- */

export const EmptyBox = styled.div`
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border: 1px dashed ${t.color.border2};
  border-radius: ${t.radius.lg};
  padding: 40px 24px;
  gap: 8px;

  .empty-title {
    font-family: ${t.font.serif};
    font-size: 19px;
    font-weight: 500;
    color: ${t.color.textSoft};
    margin: 0;
  }

  .empty-sub {
    font-size: 13.5px;
    color: ${t.color.textMuted};
    max-width: 340px;
    line-height: 1.55;
    margin: 0;
  }
`;

/* ---------- Chakra 컴포넌트용 다크 스타일 객체 (Feature 모달 등) ---------- */

export const chakraDark = {
  dialogContent: {
    bg: t.color.surface,
    color: t.color.text,
    borderWidth: "1px",
    borderColor: t.color.border,
    borderRadius: "16px",
    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
  },
  input: {
    bg: t.color.surface2,
    borderColor: t.color.border,
    color: t.color.text,
    _placeholder: { color: t.color.textFaint },
    _focus: { borderColor: t.color.accent },
  },
  label: {
    color: t.color.textSoft,
    fontSize: "sm",
    fontWeight: "semibold",
  },
  helperText: {
    color: t.color.textFaint,
  },
  tabTrigger: {
    color: t.color.textMuted,
    _hover: { color: t.color.textSoft },
    _selected: {
      color: t.color.accent,
      borderBottomWidth: "2px",
      borderBottomColor: t.color.accent,
    },
  },
  primaryBtn: {
    bg: t.color.accentStrong,
    color: t.color.text,
    borderRadius: t.radius.pill,
    _hover: { filter: "brightness(1.12)" },
  },
  ghostBtn: {
    bg: "transparent",
    color: t.color.textMuted,
    borderRadius: t.radius.pill,
    _hover: { color: t.color.text, bg: "whiteAlpha.100" },
  },
} as const;

export { homeTokens };
