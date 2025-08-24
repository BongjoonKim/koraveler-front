// src/common/elements/CusButton/CusButton.tsx

import {Button, ButtonProps} from "@chakra-ui/react";

interface CusButtonProps extends ButtonProps {
  // Chakra UI v3에서 지원하는 variant 타입으로 제한
  variant?: "outline" | "solid" | "ghost" | "subtle" | "surface" | "plain";
}

function CusButton(props : CusButtonProps) {
  return (
    <Button
      {...props}
      variant={props.variant || "solid"} // 기본값 설정
    />
  )
}

export default CusButton;