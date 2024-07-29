import styled from "styled-components";
import {ReactNode} from "react";

interface ViewDocLayoutProps extends DocumentDTO{
  children ?: ReactNode;
};

function ViewDocLayout(props: ViewDocLayoutProps) {
  
  return (
    <StyledViewDocLayout>
      <div className="title">
        {props.title}
      </div>
      <div className="contents">
        {props.children}
      </div>
    </StyledViewDocLayout>
  )
};

export default ViewDocLayout;

const StyledViewDocLayout = styled.div`
  display: flex;
  flex-direction: column;
`;
