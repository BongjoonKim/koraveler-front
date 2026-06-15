// common/elements/CusModal/CusModal.tsx
import React from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogRoot,
  DialogTitle
} from "@chakra-ui/react";
import {ReactNode} from "react";
import styled from "styled-components";

export interface CusModalProps {
  title?: string | number;
  footer?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full"; // 타입 명시
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  backdropDarkness ?: number;
  /** "dark" 지정 시 nadeliv 다크 브랜드 톤으로 모달 크롬을 렌더 (기본은 라이트) */
  variant?: "default" | "dark";
}

export default function CusModal(props: CusModalProps) {
  const isDark = props.variant === "dark";

  // 다크 변형일 때만 적용되는 Chakra 스타일 오버라이드 (라이트는 빈 객체 → 기존 동작 유지)
  const darkContent = isDark
    ? {
        bg: "#14191a",
        color: "#e8eaeb",
        borderWidth: "1px",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
      }
    : {};
  const darkHeader = isDark
    ? { borderBottomWidth: "1px", borderColor: "rgba(255, 255, 255, 0.07)", pb: "3" }
    : {};
  const darkTitle = isDark ? { color: "#ffffff", fontWeight: "700" } : {};
  const darkClose = isDark
    ? { color: "rgba(255, 255, 255, 0.55)", _hover: { color: "#ffffff", bg: "rgba(255, 255, 255, 0.08)" } }
    : {};
  const darkFooter = isDark
    ? { borderTopWidth: "1px", borderColor: "rgba(255, 255, 255, 0.07)", pt: "3" }
    : {};

  // 다크 변형은 backdropDarkness 미지정 시 은은한 스크림을 기본 적용 (모달 집중도)
  const backdropBg = props.backdropDarkness
    ? `rgba(0, 0, 0, ${props.backdropDarkness})`
    : isDark
      ? "rgba(0, 0, 0, 0.6)"
      : "rgba(0, 0, 0, 0)";

  return (
    <DialogRoot
      open={props.isOpen}
      onOpenChange={(details: { open: boolean }) => !details.open && props.onClose()}
      size={props?.size}
    >
      <DialogBackdrop
        bg={backdropBg}
        backdropFilter={props?.backdropDarkness && `brightness(${1 - props.backdropDarkness}) contrast(${1 + props.backdropDarkness / 2})`}
        style={props.backdropDarkness && {
          backgroundColor: `rgba(0, 0, 0, ${props.backdropDarkness})`,
          backdropFilter: `brightness(${1 - props.backdropDarkness}) contrast(${1 + props.backdropDarkness / 2})`
        }}
      />
      <DialogContent
        {...darkContent}
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0
        }}
      >
        {props.title && (
        <DialogHeader {...darkHeader}>

            <>
              <DialogTitle {...darkTitle}>{props.title}</DialogTitle>
              <DialogCloseTrigger {...darkClose} />
            </>

        </DialogHeader>
        )}
        <DialogBody>
          {props.children}
        </DialogBody>
        {props.footer && (
          <DialogFooter {...darkFooter}>
            {props.footer}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}