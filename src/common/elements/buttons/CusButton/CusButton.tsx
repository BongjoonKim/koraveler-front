// src/common/elements/CusButton/CusButton.tsx

import { Button, ButtonProps } from "@chakra-ui/react";

interface CusButtonProps extends ButtonProps {
  variant?: "outline" | "solid" | "ghost" | "subtle" | "surface" | "plain";
  colorPalette?: "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink";
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