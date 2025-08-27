import React, { forwardRef, ReactNode, useState } from "react";
import {
  Input,
  InputGroup,
  type InputProps,
  type InputGroupProps
} from "@chakra-ui/react";
import CusButton from "../../buttons/CusButton";

export interface CusInputProps extends InputProps {
  startElement?: ReactNode;
  endElement?: ReactNode;
  inputGroupProps?: Omit<InputGroupProps, 'startElement' | 'endElement'>;
}

const CusInput = forwardRef<HTMLInputElement, CusInputProps>((props, ref) => {
  const {
    startElement,
    endElement,
    type,
    inputGroupProps,
    ...inputProps
  } = props;
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPasswordType = type === 'password';
  
  const passwordToggle = isPasswordType ? (
    <CusButton
      onClick={() => setShowPassword(prev => !prev)}
      size="sm"
      variant="ghost"
    >
      {showPassword ? "Hide" : "Show"}
    </CusButton>
  ) : endElement;
  
  return (
    <InputGroup
      startElement={startElement}
      endElement={passwordToggle}
      {...inputGroupProps}
    >
      <Input
        ref={ref}
        type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
        {...inputProps}
      />
    </InputGroup>
  );
});

CusInput.displayName = 'CusInput';

export default CusInput;