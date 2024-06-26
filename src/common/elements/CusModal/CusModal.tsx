import {
  Modal,
  ModalOverlay,
  ModalProps,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton, ModalFooter
} from "@chakra-ui/react";
import {ReactNode} from "react";

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
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          {props.title}
        </ModalHeader>
        {/*<ModalCloseButton />*/}
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