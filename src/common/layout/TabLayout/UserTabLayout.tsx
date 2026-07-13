import styled from "styled-components";
import {ReactNode} from "react";
import useTabLayout from "./useTabLayout";
import {homeTokens} from "../../../component/page/MainPage/MainBody/homeTokens";
import {
  PageHeader,
  TabBar,
  TabButton,
} from "../../../component/page/profile/profileUi";

const t = homeTokens;

export interface UserMenuTabProps {
  children : ReactNode;
}

// /user 계열 페이지 공통 레이아웃 — 다크 세이지-그린 에디토리얼 톤 (profileUi 키트 재사용)
function UserTabLayout(props : UserMenuTabProps) {
  const {
    userTabList,
    handleChangeUserTab,
    currentPath,
  } = useTabLayout(props);

  // currentPath와 일치하는 탭을 활성 탭으로 설정
  const activeValue =
    userTabList.find((tab) => tab.value === currentPath)?.value ||
    userTabList[0]?.value;

  return (
    <StyledUserTab>
      <div className="inner">
        <PageHeader
          eyebrow="Account"
          title="My Library"
          sub="Organize your blog posts into folders."
        />
        <TabBar>
          {userTabList.map((tab) => (
            <TabButton
              key={tab.value}
              $active={tab.value === activeValue}
              onClick={() => handleChangeUserTab(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>
        {props.children}
      </div>
    </StyledUserTab>
  )
}

export default UserTabLayout;

const StyledUserTab = styled.div`
    width: 100%;
    min-height: 100%;
    color: ${t.color.text};
    font-family: ${t.font.sans};
    -webkit-font-smoothing: antialiased;

    .inner {
        max-width: ${t.containerMaxW};
        margin: 0 auto;
        padding: 44px 24px 72px;
        width: 100%;

        @media (max-width: 640px) {
            padding: 28px 18px 56px;
        }
    }
`;
