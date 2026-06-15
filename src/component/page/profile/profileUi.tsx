// 프로필/패스워드/계정 화면용 다크 세이지-그린 에디토리얼 브랜드 UI 키트.
// /home(MainBody)·MyBlogDashboard 와 동일한 톤을 쓰기 위해 homeTokens 를 참조한다.
// 컴포넌트에서 hex 직접 사용 금지 — 항상 이 토큰/빌딩블록을 통한다.

import React, { ReactNode, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { Check, AlertCircle } from "lucide-react";
import { homeTokens } from "../MainPage/MainBody/homeTokens";

const t = homeTokens;

// homeTokens 를 기반으로 input / alert / danger 톤을 확장한다.
export const profileTokens = {
  ...t.color,
  inputBg: "rgba(255, 255, 255, 0.04)",
  inputBorder: "rgba(255, 255, 255, 0.12)",
  hover: "rgba(255, 255, 255, 0.06)",
  danger: "#e8736c",
  dangerStrong: "#b4443d",
  dangerSurface: "rgba(220, 90, 80, 0.07)",
  dangerBorder: "rgba(220, 90, 80, 0.22)",
  successText: "#a9d0ab",
  successSurface: "rgba(143, 191, 148, 0.09)",
  successBorder: "rgba(143, 191, 148, 0.22)",
} as const;
const c = profileTokens;

/* ----------------------------- 페이지 레이아웃 ----------------------------- */
// 배경은 MainLayout(/profile → #0a0c0c) 이 깔아주므로 여기서는 투명하게 둔다.
export const Page = styled.div`
  width: 100%;
  min-height: 100%;
  color: ${t.color.text};
  font-family: ${t.font.sans};
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
`;

export const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 44px 24px 72px;

  @media (max-width: 640px) {
    padding: 28px 18px 56px;
  }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

/* ------------------------------ 페이지 헤더 ------------------------------- */
export const Eyebrow = styled.div`
  font-size: 12px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${t.color.textFaint};
  margin-bottom: 12px;
`;

export const PageTitle = styled.h1`
  font-family: ${t.font.serif};
  font-weight: 500;
  font-size: 34px;
  line-height: 1.15;
  color: ${t.color.text};
  margin: 0 0 8px;

  @media (max-width: 640px) {
    font-size: 27px;
  }
`;

export const PageSub = styled.p`
  font-size: 14px;
  color: ${t.color.textMuted};
  margin: 0;
`;

export function PageHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <PageTitle>{title}</PageTitle>
      {sub && <PageSub>{sub}</PageSub>}
    </div>
  );
}

/* --------------------------------- 탭 ---------------------------------- */
export const TabBar = styled.div`
  display: flex;
  gap: 28px;
  margin: 28px 0;
  border-bottom: 0.5px solid ${t.color.border};
`;

export const TabButton = styled.button<{ $active?: boolean }>`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 12px 2px;
  font-family: ${t.font.sans};
  font-size: 15px;
  letter-spacing: 0.01em;
  color: ${(p) => (p.$active ? t.color.text : t.color.textMuted)};
  font-weight: ${(p) => (p.$active ? 500 : 400)};
  transition: color 0.18s ease;

  &:hover {
    color: ${(p) => (p.$active ? t.color.text : t.color.textSoft)};
  }
  &:focus {
    outline: none;
  }
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.5px;
    height: 2px;
    border-radius: 2px;
    background: ${(p) => (p.$active ? t.color.accent : "transparent")};
    transition: background 0.18s ease;
  }
`;

/* -------------------------------- 카드 --------------------------------- */
export const Card = styled.section`
  background: ${t.color.surface};
  border: 0.5px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 26px 26px 28px;

  @media (max-width: 640px) {
    padding: 20px 18px 22px;
  }
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
`;

export const SectionTitle = styled.h2`
  font-family: ${t.font.serif};
  font-weight: 500;
  font-size: 19px;
  color: ${t.color.text};
  margin: 0;
`;

/* ------------------------------- 신원 카드 ------------------------------- */
export const IdentityRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const IdentityName = styled.div`
  font-family: ${t.font.serif};
  font-size: 21px;
  font-weight: 500;
  color: ${t.color.text};
  line-height: 1.2;
`;

export const IdentityHandle = styled.div`
  font-size: 13px;
  color: ${t.color.textMuted};
  margin-top: 3px;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${t.color.badgeText};
  background: ${t.color.badgeBg};
  border-radius: 6px;
  padding: 4px 9px;
`;

/* ------------------------------- 아바타 -------------------------------- */
const AvatarCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: ${t.color.badgeBg};
  color: ${t.color.badgeText};
  border: 0.5px solid ${t.color.border2};
  font-family: ${t.font.serif};
  font-size: 22px;
  font-weight: 500;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export function Avatar({ name, src }: { name?: string; src?: string }) {
  return (
    <AvatarCircle>
      {src ? (
        <img src={src} alt={name || "avatar"} />
      ) : (
        (name?.[0] ?? "?").toUpperCase()
      )}
    </AvatarCircle>
  );
}

/* ------------------------------ 정보 행(읽기) ----------------------------- */
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 0;

  & + & {
    border-top: 0.5px solid ${t.color.border};
  }
`;
const RowIcon = styled.span`
  color: ${t.color.textFaint};
  display: flex;
  flex: none;
`;
const RowLabel = styled.span`
  font-size: 13px;
  color: ${t.color.textMuted};
  min-width: 92px;
  flex: none;
`;
const RowValue = styled.span`
  font-size: 14px;
  color: ${t.color.text};
  word-break: break-word;
`;

export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <Row>
      <RowIcon>{icon}</RowIcon>
      <RowLabel>{label}</RowLabel>
      <RowValue>{value || "—"}</RowValue>
    </Row>
  );
}

/* ------------------------------- 폼 필드 ------------------------------- */
export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & + & {
    margin-top: 16px;
  }
`;

export const Label = styled.label`
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${t.color.textMuted};
`;

const Shell = styled.div<{ $invalid?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${c.inputBg};
  border: 0.5px solid ${(p) => (p.$invalid ? c.dangerBorder : c.inputBorder)};
  border-radius: ${t.radius.md};
  padding: 0 12px;
  color: ${t.color.textFaint};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus-within {
    border-color: ${(p) => (p.$invalid ? c.danger : t.color.accent)};
    box-shadow: 0 0 0 3px
      ${(p) =>
        p.$invalid ? "rgba(220, 90, 80, 0.14)" : "rgba(143, 191, 148, 0.14)"};
  }
`;

const Bare = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: ${t.color.text};
  font-family: ${t.font.sans};
  font-size: 15px;
  padding: 12px 0;
  color-scheme: dark;

  &::placeholder {
    color: ${t.color.textFaint};
  }
`;

const ToggleBtn = styled.button`
  flex: none;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${t.color.textMuted};
  font-family: ${t.font.sans};
  font-size: 13px;
  padding: 4px 2px;
  transition: color 0.15s ease;

  &:hover {
    color: ${t.color.textSoft};
  }
`;

const IconSlot = styled.span`
  flex: none;
  display: flex;
  align-items: center;
`;

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  leftIcon?: ReactNode;
  invalid?: boolean;
  autoComplete?: string;
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  leftIcon,
  invalid,
  autoComplete,
}: InputProps) {
  return (
    <Shell $invalid={invalid}>
      {leftIcon && <IconSlot>{leftIcon}</IconSlot>}
      <Bare
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </Shell>
  );
}

export function PasswordInput({
  value,
  onChange,
  placeholder,
  leftIcon,
  invalid,
  autoComplete,
}: Omit<InputProps, "type">) {
  const [show, setShow] = useState(false);
  return (
    <Shell $invalid={invalid}>
      {leftIcon && <IconSlot>{leftIcon}</IconSlot>}
      <Bare
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <ToggleBtn type="button" onClick={() => setShow((s) => !s)}>
        {show ? "Hide" : "Show"}
      </ToggleBtn>
    </Shell>
  );
}

/* -------------------------------- 버튼 --------------------------------- */
const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${t.font.sans};
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  border-radius: 10px;
  padding: 11px 20px;
  cursor: pointer;
  border: 0.5px solid transparent;
  white-space: nowrap;
  transition: filter 0.15s ease, background 0.15s ease, border-color 0.15s ease,
    color 0.15s ease, opacity 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryButton = styled.button`
  ${buttonBase};
  background: ${t.color.accentStrong};
  color: #eef7ef;

  &:hover:not(:disabled) {
    filter: brightness(1.1);
  }
`;

export const OutlineButton = styled.button`
  ${buttonBase};
  background: transparent;
  border-color: ${t.color.border2};
  color: ${t.color.textSoft};

  &:hover:not(:disabled) {
    background: ${c.hover};
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

export const GhostButton = styled.button`
  ${buttonBase};
  background: transparent;
  color: ${t.color.accent};
  padding: 8px 12px;

  &:hover:not(:disabled) {
    background: ${c.hover};
  }
`;

export const DangerButton = styled.button`
  ${buttonBase};
  background: ${c.dangerStrong};
  color: #fdeceb;

  &:hover:not(:disabled) {
    filter: brightness(1.12);
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 22px;
`;

/* ------------------------------- 알림(메시지) ----------------------------- */
const AlertBox = styled.div<{ $tone: "success" | "error" }>`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border-radius: ${t.radius.md};
  padding: 12px 14px;
  font-size: 13.5px;
  line-height: 1.5;
  background: ${(p) => (p.$tone === "success" ? c.successSurface : c.dangerSurface)};
  border: 0.5px solid
    ${(p) => (p.$tone === "success" ? c.successBorder : c.dangerBorder)};
  color: ${(p) => (p.$tone === "success" ? c.successText : c.danger)};
`;
const AlertIcon = styled.span`
  flex: none;
  display: flex;
  margin-top: 1px;
`;

export function Alert({
  tone,
  children,
}: {
  tone: "success" | "error";
  children: ReactNode;
}) {
  return (
    <AlertBox $tone={tone}>
      <AlertIcon>
        {tone === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      </AlertIcon>
      <span>{children}</span>
    </AlertBox>
  );
}

/* ------------------------------ 위험 영역(계정) ---------------------------- */
export const DangerCard = styled.section`
  background: ${c.dangerSurface};
  border: 0.5px solid ${c.dangerBorder};
  border-radius: ${t.radius.lg};
  padding: 26px;

  @media (max-width: 640px) {
    padding: 20px 18px;
  }
`;

export const DangerTitle = styled.h2`
  font-family: ${t.font.serif};
  font-weight: 500;
  font-size: 19px;
  color: ${c.danger};
  margin: 0 0 6px;
`;

export const DangerText = styled.p`
  font-size: 13.5px;
  color: ${t.color.textMuted};
  line-height: 1.55;
  margin: 0;
`;

/* ------------------------------- 스피너 -------------------------------- */
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span<{ $size?: number }>`
  width: ${(p) => p.$size ?? 16}px;
  height: ${(p) => p.$size ?? 16}px;
  flex: none;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-top-color: #eef7ef;
  display: inline-block;
  animation: ${spin} 0.7s linear infinite;
`;

const PageLoaderWrap = styled.div`
  display: flex;
  justify-content: center;
  padding: 64px 0;
`;
const AccentSpinner = styled(Spinner)`
  border-color: rgba(143, 191, 148, 0.22);
  border-top-color: ${t.color.accent};
`;

export function PageLoader() {
  return (
    <PageLoaderWrap>
      <AccentSpinner $size={26} />
    </PageLoaderWrap>
  );
}
