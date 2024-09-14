import styled from "styled-components";
import HeaderLayout from "../HeaderLayout";
import {ReactNode} from "react";
import {useLocation} from "react-router-dom";

export interface UniversalLayoutProps {
  children : ReactNode;
};

function UniversalLayout(props: UniversalLayoutProps) {
  const location = useLocation();
  console.log("location", location)
  return (
    <StyledUniversalLayout>
      <HeaderLayout notHome={!!(location.pathname !== "/home")}/>
      {props.children}
    </StyledUniversalLayout>
  )
};

export default UniversalLayout;

const StyledUniversalLayout = styled.div`
  width: 100%;
  height: 100%;
`;
