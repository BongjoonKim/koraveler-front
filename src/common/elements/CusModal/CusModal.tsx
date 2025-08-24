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
}

export default function CusModal(props: CusModalProps) {
  return (
    <DialogRoot
      open={props.isOpen}
      onOpenChange={(details: { open: boolean }) => !details.open && props.onClose()}
      size={props?.size}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
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

const StyledCusModal = styled.div``;