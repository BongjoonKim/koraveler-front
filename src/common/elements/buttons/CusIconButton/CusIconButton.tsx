import styled from "styled-components";
import {IconButton, IconButtonProps} from "@chakra-ui/react";

interface CusIconButtonProps extends IconButtonProps{

};

function CusIconButton(props: CusIconButtonProps) {
  
  return (
    <StyledCusIconButton
        {...props}
        aria-label={props["aria-label"]}
        variant={props.variant} // 'solid' | 'outline' | 'wacky' | 'chill'
    />
  )
};

export default CusIconButton;

const StyledCusIconButton = styled(IconButton)`

`;
