import styled from "styled-components";
import CusAvatar from "../../../elements/CusAvatar";
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
  position: inherit;
  width: calc(100vw - 4rem);
  height: 3rem;
  align-items: center;
  text-align: end;
`;