import styled from "styled-components";
import {ReactNode} from "react";
import useTabLayout from "./useTabLayout";
import CusTab from "../../elements/CusTab";

export interface MenuTabProps {
  children : ReactNode
}
function TabLayout(props : MenuTabProps) {
  const {
    tabList,
    handleChangeTab,
    currentPath,
  } = useTabLayout(props);
  return (
    <StyledMenuTab>
      <CusTab
        onChange={handleChangeTab}
        tabs={tabList}
        defaultIndex={tabList.find(tab => tab.value === currentPath)?.index || 0}
      />
      {props.children}
    </StyledMenuTab>
  )
}

export default TabLayout;

const StyledMenuTab = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 2rem;
`;