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
  console.log("메뉴 리스트sss", props.children);
  return (
    <StyledMenuTab>
      <CusTab
        onChange={handleChangeTab}
      >
        {menuList}
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