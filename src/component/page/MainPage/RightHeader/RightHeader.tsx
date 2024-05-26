import styled from "styled-components";
import CusAvatar from "../../../../common/elements/CusAvatar";
import Slider from "./Slider";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  return (
    <StyledRightHeader>
      <CusAvatar />
      <Slider />
    </StyledRightHeader>
  )
}

export default RightHeader;

const StyledRightHeader = styled.div`
  width: 100%;
  height: inherit;
  align-items: end;
  text-align: end;
`;