import styled from "styled-components";
import LeftHeader from "./LeftHeader";
import RightHeader from "./RightHeader";

export interface HeaderLayoutProps {
  notHome ?: boolean;
};

function HeaderLayout(props: HeaderLayoutProps) {
  
  return (
    <StyledHeaderLayout {...props}>
        <LeftHeader />
        <RightHeader />
    </StyledHeaderLayout>
  )
};

export default HeaderLayout;

const StyledHeaderLayout = styled.div<HeaderLayoutProps>`
    width: 100%;
    height: ${props => props.notHome ? "auto" : "2rem"};
    position: ${props => props.notHome ? "relative" : "absolute"};
    padding : 2rem;
    display: flex;
    justify-content: space-between;
`;
