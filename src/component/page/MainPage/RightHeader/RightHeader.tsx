import styled from "styled-components";
import CusAvatar from "../../../../common/elements/CusAvatar";
import Slider from "./SliderMenu";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  return (
    <StyledRightHeader>
      <Slider/>
      <CusAvatar />
    </StyledRightHeader>
  )
}

export default RightHeader;

const StyledRightHeader = styled.div`
  width: 100%;
  height: 100%;
  align-items: end;
  text-align: end;
  padding: 1rem;
`;