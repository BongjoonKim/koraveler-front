import styled from "styled-components";
import CusAvatar from "../../../elements/CusAvatar";
import SliderMenu from "./SliderMenu";
import useRightHeader from "./useRightHeader";
import CusButton from "../../../elements/buttons/CusButton";
import {Search2Icon} from "@chakra-ui/icons";
import CusModal from "../../../elements/CusModal";
import SearchModal from "../SearchModal";

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
    cusAvaRef,
    handleOpenModal,
    searchModalOpen,
  } = useRightHeader();
  return (
    <>
      <CusModal isOpen={searchModalOpen} onClose={handleOpenModal} size={"xl"} >
        <SearchModal onClose={handleOpenModal}/>
      </CusModal>
    
    <StyledRightHeader>
      <CusButton
        className={"search-button"}
        style={{
          display: "flex",
          gap : "1rem",
          width : "12rem",
          borderRadius: "5rem",
        }}
        onClick={handleOpenModal}
      >
        <Search2Icon/>
        <span className="text">
          Search the docs
        </span>
      </CusButton>
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
    </>
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
  .search-button {
    svg {
      color: gray;
    }
    .text {
      color : gray;
    }
  }
`;