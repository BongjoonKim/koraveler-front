// src/common/elements/CusIconButton/CusIconButton.tsx

import styled from "styled-components";
import {IconButton, IconButtonProps} from "@chakra-ui/react";
import {ReactElement} from "react";

interface CusIconButtonProps extends Omit<IconButtonProps, 'variant'> {
  // Chakra UI v3에서 지원하는 variant 타입으로 제한
  variant?: "outline" | "solid" | "ghost" | "subtle" | "surface" | "plain";
  icon?: ReactElement;
  
}

function CusIconButton(props: CusIconButtonProps) {
  return (
    <StyledCusIconButton
      {...props}
      aria-label={props["aria-label"]}
      variant={props.variant || "ghost"} // 기본값 설정
    />
  )
}

export default CusIconButton;

const StyledCusIconButton = styled(IconButton)`
    /* 추가 스타일링이 필요한 경우 여기에 */
`;