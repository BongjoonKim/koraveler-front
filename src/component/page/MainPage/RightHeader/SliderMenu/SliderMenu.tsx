import styled from "styled-components";
import {Dispatch, MouseEventHandler, SetStateAction, useState} from "react";
import useSliderMenu from "./useSliderMenu";

export interface SliderMenuProps {
  isSliderOpen : boolean;
  setSliderOpen : Dispatch<SetStateAction<boolean>>
};

function SliderMenu(props: SliderMenuProps) {
  const {
    handleAvatarClick
  } = useSliderMenu(props)
  return (
    <StyledSlider
      onClick={handleAvatarClick}
    >
    
    </StyledSlider>
  )
};

export default SliderMenu;

const StyledSlider = styled.div<{
  onClick: (event: MouseEventHandler<HTMLDivElement>) => void;
}>`
  width: 20rem;
  height: 30rem;
  position: fixed;
  background: whitesmoke;
  left: calc(100% - 20rem - 2rem);
  top : 2rem;
  border-radius: 16px;
  transition: width 2s;
`;
