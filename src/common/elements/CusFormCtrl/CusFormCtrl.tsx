import styled from "styled-components";
import {ReactNode} from "react";
import {FormControl, FormErrorMessage, FormHelperText, FormLabel} from "@chakra-ui/react";

export interface CusFormCtrlProps  {
  formTitle ?: string | number;
  children : ReactNode;
  helpMsg ?: string;
  errMsg ?: any;
  isInValid ?: boolean
};

function CusFormCtrl(props: CusFormCtrlProps) {
  
  return (
    <StyledCusFormCtrl inValid={!!props.isInValid}>
      <FormLabel>{props.formTitle}</FormLabel>
      {props.children}
      {props.helpMsg && (
        <FormHelperText>{props.helpMsg}</FormHelperText>
      )}
      {props.errMsg && (
        <FormErrorMessage>
          {props.errMsg}
        </FormErrorMessage>
      )}
    </StyledCusFormCtrl>
  )
};

export default CusFormCtrl;

const StyledCusFormCtrl = styled(FormControl)`

`;
