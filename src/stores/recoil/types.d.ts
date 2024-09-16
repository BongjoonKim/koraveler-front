import {AlertProps, AlertStatus} from "@chakra-ui/react";

declare interface ErrorMessageProps {
  status ?: AlertStatus;
  msg ?: string;
  code ?: number | string;
  isShow ?: boolean;
}