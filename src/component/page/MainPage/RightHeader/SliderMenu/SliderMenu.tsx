import styled, {css} from "styled-components";
import {Dispatch, MouseEventHandler, SetStateAction, useState} from "react";
import useSliderMenu from "./useSliderMenu";
import CusButton from "../../../../../common/elements/buttons/CusButton";

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
      isSliderOpen={props.isSliderOpen}
      setSliderOpen={props.setSliderOpen}
    >
      <div className="wrapper-sliderMenu">
        <div className="head">
          <CusButton>로그인</CusButton>
          <CusButton>회원가입</CusButton>
        </div>
        <div className={"body"}>
  
        </div>
      </div>

    </StyledSlider>
  )
};

export default SliderMenu;
// onClick: (event: MouseEventHandler<HTMLDivElement>) => void;

const StyledSlider = styled.div<SliderMenuProps>`
  width: 20rem;
  position: fixed;
  background: whitesmoke;
  left: calc(100% - 20rem - 2rem);
  top : 2rem;
  border-radius: 16px;
  //padding: 1.5rem;
  .wrapper-sliderMenu {
    margin: 1.5rem;
  }
  
  transition: ${props => props.isSliderOpen ? "width 2s": "none"};
  ${props => {
    if (props.isSliderOpen) {
      return css`
        transition-property:  height, padding;
        transition-duration: 600ms, 600ms;
        height: 30rem;
        overflow: hidden;

      `
    } else {
      return css`
        transition-property:  height, padding;
        transition-duration: 600ms, 600ms;
        overflow: hidden;
        height: 0;
      `
    }

  }}
  
  display: block;
  .head {
    display: flex;
    gap: 1rem;
  }
  .body {
    height: 100%;
    width: 100%;
  }
`;
