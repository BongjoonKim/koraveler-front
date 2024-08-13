import styled from "styled-components";
import {ReactNode} from "react";
import useTabLayout from "./useTabLayout";
import CusTab from "../../elements/CusTab";

export interface MenuTabProps {
  children : ReactNode
}
function TabLayout(props : MenuTabProps) {
  const {
    menuList,
    handleChangeTab,
  } = useTabLayout(props);
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

export default TabLayout;

const StyledMenuTab = styled.div`
  height: 100%;
  width: 100%;
`;