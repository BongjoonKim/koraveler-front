// src/common/elements/CusButton/CusButton.tsx

import { Button, ButtonProps } from "@chakra-ui/react";
import {ReactElement} from "react";

interface CusButtonProps extends ButtonProps {
  variant?: "outline" | "solid" | "ghost" | "subtle" | "surface" | "plain";
  colorPalette?: "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink";
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  isLoading?: boolean;
}

function CusButton(props: CusButtonProps) {
  const { colorPalette = "gray", variant = "solid", ...restProps } = props;
  
  return (
    <Button
      colorPalette={colorPalette}
      variant={variant}
      {...restProps}
    />
  )
}

export default CusButton;