import styled from "styled-components";
import {ReactNode} from "react";

interface MenuTabProps {
  children : ReactNode
}
function MenuTab(props : MenuTabProps) {
  return (
    <StyledMenuTab>
      
      {props.children}
    </StyledMenuTab>
  )
}

export default MenuTab;

const StyledMenuTab = styled.div`
`;