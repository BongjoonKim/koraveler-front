import styled from "styled-components";
import CusAvatar from "../../../../common/elements/CusAvatar";
import SliderMenu from "./SliderMenu";
import useRightHeader from "./useRightHeader";
import {Suspense} from "react";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  const {
    loginUser,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick
  } = useRightHeader();
  return (
    <StyledRightHeader>
      <SliderMenu
        isSliderOpen = {isSliderOpen}
        setSliderOpen = {setSliderOpen}
      />
      <CusAvatar
        onClick={handleAvatarClick}
        name={loginUser?.userId}
      />
    </StyledRightHeader>
  )
}

export default RightHeader;

const StyledRightHeader = styled.div`
  width: 100%;
  height: 100%;
  align-items: end;
  text-align: end;
`;