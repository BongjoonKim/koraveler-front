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
}

export default function CusModal(props: CusModalProps) {
  return (
    <DialogRoot
      open={props.isOpen}
      onOpenChange={(details: { open: boolean }) => !details.open && props.onClose()}
      size={props?.size}
    >
      <DialogBackdrop
        bg="rgba(0, 0, 0, 0)"
        backdropFilter={props?.backdropDarkness && `brightness(${1 - props.backdropDarkness}) contrast(${1 + props.backdropDarkness / 2})`}
        style={props.backdropDarkness && {
          backgroundColor: `rgba(0, 0, 0, ${props.backdropDarkness})`,
          backdropFilter: `brightness(${1 - props.backdropDarkness}) contrast(${1 + props.backdropDarkness / 2})`
        }}
      />
      <DialogContent
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          margin: 0
        }}
      >
        {props.title && (
        <DialogHeader>
          
            <>
              <DialogTitle>{props.title}</DialogTitle>
              <DialogCloseTrigger />
            </>
          
        </DialogHeader>
        )}
        <DialogBody>
          {props.children}
        </DialogBody>
        {props.footer && (
          <DialogFooter>
            {props.footer}
          </DialogFooter>
        )}
      </DialogContent>
    </DialogRoot>
  );
}