// src/common/elements/CusFormCtrl/CusFormCtrl.tsx

import {ReactNode} from "react";
import {
  Field
} from "@chakra-ui/react";

export interface CusFormCtrlProps  {
  formTitle ?: string | number;
  children : ReactNode;
  helpMsg ?: string;
  errMsg ?: string;
  isInValid ?: boolean
}

function CusFormCtrl(props: CusFormCtrlProps) {
  
  return (
    <Field.Root invalid={props.isInValid}>
      {props.formTitle && (
        <Field.Label>{props.formTitle}</Field.Label>
      )}
      {props.children}
      {props.helpMsg && (
        <Field.HelperText>{props.helpMsg}</Field.HelperText>
      )}
      {props.errMsg && (
        <Field.ErrorText>{props.errMsg}</Field.ErrorText>
      )}
    </Field.Root>
  )
}

export default CusFormCtrl;