import styled from "styled-components";
import HeaderLayout from "../HeaderLayout";
import {ReactNode} from "react";

export interface SettingLayoutProps {
  children : ReactNode;
};

function SettingLayout(props: SettingLayoutProps) {
  
  return (
    <StyledSettingLayout>
      <HeaderLayout notHome={true} />
      <div className="setting-body">
        {props.children}
      </div>
    </StyledSettingLayout>
  )
};

export default SettingLayout;

const StyledSettingLayout = styled.div`
  height: 100%;
  width: 100%;
`;
