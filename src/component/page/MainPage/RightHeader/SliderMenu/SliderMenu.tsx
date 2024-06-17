import styled, {css} from "styled-components";
import {Dispatch, MouseEventHandler, SetStateAction, useState} from "react";
import useSliderMenu from "./useSliderMenu";
import CusButton from "../../../../../common/elements/buttons/CusButton";
import {lowerCase} from "lodash";

export interface SliderMenuProps {
  isSliderOpen : boolean;
  setSliderOpen : Dispatch<SetStateAction<boolean>>
};

function SliderMenu(props: SliderMenuProps) {
  const {
    handleAvatarClick,
    handleLoginClick
  } = useSliderMenu(props)
  return (
    <StyledSlider
      isslideropen={props.isSliderOpen.toString()}
    >
      <div className="wrapper-sliderMenu">
        <div className="head">
          <CusButton onClick={handleLoginClick}>로그인</CusButton>
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

const StyledSlider = styled.div<{isslideropen : string}>`
  width: 20rem;
  position: fixed;
  background: whitesmoke;
  left: calc(100% - 20rem - 1rem);
  top : 1rem;
  border-radius: 16px;
  //padding: 1.5rem;
  .wrapper-sliderMenu {
    margin: 1.5rem;
  }
  
  transition: ${props => props.isslideropen ? "width 2s": "none"};
  ${props => {
    if (props.isslideropen === "true") {
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
