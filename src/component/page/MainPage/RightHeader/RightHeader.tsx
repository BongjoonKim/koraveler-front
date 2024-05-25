import styled from "styled-components";
import CusAvatar from "../../../../common/elements/CusAvatar";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  return (
    <StyledRightHeader>
      <CusAvatar />
    </StyledRightHeader>
  )
}

export default RightHeader;

const StyledRightHeader = styled.div`
`;