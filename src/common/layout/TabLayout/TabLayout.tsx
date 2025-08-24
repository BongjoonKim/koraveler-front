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
  
  // currentPath와 일치하는 탭의 value를 기본값으로 설정
  const defaultValue = tabList.find(tab => tab.value === currentPath)?.value || tabList[0]?.value;
  
  console.log("defaultValue", defaultValue);
  console.log("currentPath", currentPath);
  
  return (
    <StyledMenuTab>
      <CusTab
        onChange={handleChangeTab} // 이제 (value: string) => void 함수
        tabs={tabList}
        defaultValue={defaultValue} // defaultIndex 대신 defaultValue 사용
        variant="line" // 원하는 스타일 추가
        colorPalette="blue" // 원하는 색상 추가
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