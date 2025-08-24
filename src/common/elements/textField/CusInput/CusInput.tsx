// src/common/elements/textField/CusInput/CusInput.tsx

import React from "react";
import { Input, InputGroup } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import CusButton from "../../buttons/CusButton";

export interface CusInputProps extends React.ComponentProps<typeof Input> {
  // Input의 모든 props를 상속
}

export interface CusInputGroupProps extends CusInputProps {
  inputLeftElement?: ReactNode;
  inputRightElement?: ReactNode;
}

function CusInput(props: CusInputProps) {
  return (
    <Input
      {...props}
    />
  )
}

export function CusInputGroup(props: CusInputGroupProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // props에서 inputLeftElement, inputRightElement를 분리하고 나머지는 Input에 전달
  const { inputLeftElement, inputRightElement, type, ...inputProps } = props;
  
  const isPasswordType = type === 'password';
  
  // 패스워드 타입이면 show/hide 버튼을 우선적으로 표시
  const endElement = isPasswordType ? (
    <CusButton
      onClick={() => setShowPassword(prev => !prev)}
      size="sm"
      variant="ghost"
    >
      {showPassword ? "Hide" : "Show"}
    </CusButton>
  ) : inputRightElement;
  
  return (
    <InputGroup
      startElement={inputLeftElement}
      endElement={endElement}
    >
      <Input
        type={isPasswordType ? (showPassword ? 'text' : 'password') : type}
        {...inputProps}
      />
    </InputGroup>
  )
}

export default CusInput