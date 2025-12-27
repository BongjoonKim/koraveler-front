import styled from "styled-components";
import {ReactNode} from "react";
import useTabLayout from "./useTabLayout";
import CusTab from "../../elements/CusTab";

export interface UserMenuTabProps {
  children : ReactNode;
}

function UserTabLayout(props : UserMenuTabProps) {
  const {
    userTabList,
    handleChangeUserTab,
    currentPath,
  } = useTabLayout(props);
  
  // currentPath와 일치하는 탭의 value를 기본값으로 설정
  const defaultValue = userTabList.find(tab => tab.value === currentPath)?.value || userTabList[0]?.value;
  
  return (
    <StyledMenuTab>
      <CusTab
        onChange={handleChangeUserTab} // 이제 (value: string) => void 함수
        tabs={userTabList}
        defaultValue={defaultValue} // defaultIndex 대신 defaultValue 사용
        variant="line" // 원하는 스타일 추가
        colorPalette="blue" // 원하는 색상 추가
      />
      {props.children}
    </StyledMenuTab>
  )
}

export default UserTabLayout;

const StyledMenuTab = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding: 1rem;
`;