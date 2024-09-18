import styled from "styled-components";
import HeaderLayout from "../HeaderLayout";
import {ReactNode} from "react";

export interface TravelLayoutProps {
  children : ReactNode;
};

function TravelLayout(props: TravelLayoutProps) {
  
  return (
    <StyledTravelLayout>
      <HeaderLayout/>
      <div className={"travel-body"}>
        {props.children}
      </div>
    </StyledTravelLayout>
  )
};

export default TravelLayout;

const StyledTravelLayout = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .travel-body {
    height: 100%;
    width: 100%;
    flex: 1 1 auto;
  }
`;
