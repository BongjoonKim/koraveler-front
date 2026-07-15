// src/common/elements/CusFormCtrl/CusFormCtrl.tsx

import React, {ReactNode} from "react";
import {
  Field
} from "@chakra-ui/react";

export interface CusFormCtrlProps  {
  formTitle ?: string | number;
  children : ReactNode;
  helpMsg ?: string;
  errMsg ?: string;
  isInValid ?: boolean;
  /** 다크 카드 등에서 라벨 색/스타일 조정용 */
  labelProps ?: React.ComponentProps<typeof Field.Label>;
}

function CusFormCtrl(props: CusFormCtrlProps) {

  return (
    <Field.Root invalid={props.isInValid}>
      {props.formTitle && (
        <Field.Label {...props.labelProps}>{props.formTitle}</Field.Label>
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