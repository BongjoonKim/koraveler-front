import styled from "styled-components";
import {ReactNode} from "react";
import useMenuTab from "./useMenuTab";
import CusTab from "../../elements/CusTab";

export interface MenuTabProps {
  children : ReactNode
}
function MenuTab(props : MenuTabProps) {
  const {
    menuList,
    handleChangeTab,
  } = useMenuTab(props);
  return (
    <StyledMenuTab>
      <CusTab
        onChange={handleChangeTab}
      >
      
      </CusTab>
      {props.children}
    </StyledMenuTab>
  )
}

export default MenuTab;

const StyledMenuTab = styled.div`
  height: 100%;
  width: 100%;
`;