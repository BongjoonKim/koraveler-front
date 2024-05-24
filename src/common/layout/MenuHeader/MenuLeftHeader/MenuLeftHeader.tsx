import styled from "styled-components";

interface LeftHeaderProps {

};

function MenuLeftHeader(props: LeftHeaderProps) {
  
  return (
    <StyledLeftHeader>
      <a className={"title"} href={`${process.env.REACT_APP_URI}`}>
        Koraveler
      </a>
    </StyledLeftHeader>
  )
};

export default MenuLeftHeader;

const StyledLeftHeader = styled.div`
  .title {
    font-size: 2rem;
    font-weight: 600;
  }
`;
