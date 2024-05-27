import styled from "styled-components";
import CusAvatar from "../../../../common/elements/CusAvatar";
import SliderMenu from "./SliderMenu";
import useRightHeader from "./useRightHeader";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  const {
    isSliderOpen,
    setSliderOpen
  } = useRightHeader();
  
  return (
    <StyledRightHeader>
      <SliderMenu
        isSliderOpen = {isSliderOpen}
        setSliderOpen = {setSliderOpen}
      />
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