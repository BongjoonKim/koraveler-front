import styled from "styled-components";
import CusAvatar from "../../../elements/CusAvatar";
import SliderMenu from "./SliderMenu";
import useRightHeader from "./useRightHeader";
import {Suspense} from "react";
import CusButton from "../../../elements/buttons/CusButton";
import {Link} from "react-router-dom";

interface RightHeaderProps {

}

function RightHeader(props : RightHeaderProps) {
  const {
    loginUser,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick,
    handleCreate,
    location,
    sliderRef,
    cusAvaRef
  } = useRightHeader();
  return (
    <StyledRightHeader>
      {/*{location?.pathname !== "/home" && loginUser.userId && (*/}
      {/*  <Link*/}
      {/*    to={`/blog/create`}*/}
      {/*  >*/}
      {/*    생성*/}
      {/*  </Link>*/}
      {/*)}*/}

      <SliderMenu
        ref={sliderRef}
        isSliderOpen = {isSliderOpen}
        setSliderOpen = {setSliderOpen}
      />
      <CusAvatar
        ref={cusAvaRef}
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
  position: relative;
  height: 3rem;
  align-items: center;
  text-align: end;
  z-index: 2000;
  a {
    font-size: 20px;
    font-weight: 500;
  }
  //padding-right: 1rem;
`;