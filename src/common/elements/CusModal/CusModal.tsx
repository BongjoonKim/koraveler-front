import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton, ModalFooter, GlobalStyle
} from "@chakra-ui/react";
import {ReactNode} from "react";
import styled from "styled-components";
import { Global } from "@emotion/react";


interface CusModalProps extends ModalProps {
  title ?: string | ReactNode;
  footer ?: ReactNode;
}

export default function CusModal(props:CusModalProps) {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <Global
        styles={{
          ".chakra-modal__content-container": {
            zIndex: "20001 !important",
          },
        }}
      />
      <ModalOverlay zIndex={20000}/>
      <ModalContent zIndex={20001}>
        <ModalHeader>
          {props.title}
        </ModalHeader>
        <ModalBody>
          {props.children}
        </ModalBody>
        <ModalFooter>
          {props.footer}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

