import styled from "styled-components";
import CusAvatar from "../../../elements/CusAvatar";
import SliderMenu from "./SliderMenu";
import useRightHeader from "./useRightHeader";
import {Suspense} from "react";
import CusButton from "../../../elements/buttons/CusButton";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  const {
    loginUser,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick,
    handleCreate,
  } = useRightHeader();
  return (
    <StyledRightHeader>
      <CusButton
        onClick={handleCreate}
      >
        Create
      </CusButton>
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
  gap: 1rem;
  justify-content: flex-end;
  display: flex;
  position: inherit;
  height: 3rem;
  align-items: center;
  text-align: end;
  //padding-right: 1rem;
`;