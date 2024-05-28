import styled from "styled-components";
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
      onClick={handleAvatarClick}
    >
      <div className="head">
        <CusButton>로그인</CusButton>
        <CusButton>회원가입</CusButton>
      </div>
      <div className={"body"}>
        
      </div>
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
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  .head {
    display: flex;
    gap: 1rem;
  }
  .body {
    height: 100%;
    width: 100%;
  }
`;
