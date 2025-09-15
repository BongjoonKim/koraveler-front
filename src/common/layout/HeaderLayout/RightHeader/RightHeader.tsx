import styled from "styled-components";
import CusAvatar from "../../../elements/CusAvatar";
import SliderMenu from "./SliderMenu";
import useRightHeader from "./useRightHeader";
import CusButton from "../../../elements/buttons/CusButton";
import CusModal from "../../../elements/CusModal";
import SearchModal from "../SearchModal";
import {SearchIcon} from "lucide-react";

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
      <CusModal isOpen={searchModalOpen} onClose={handleOpenModal} size={"xl"} backdropDarkness={0.6}
      >
        <SearchModal onClose={handleOpenModal}/>
      </CusModal>
    
    <StyledRightHeader>
      <CusButton
        className="search-button"
        colorPalette="gray"  // 또는 "blue", "teal" 등 원하는 색상
        variant="subtle"      // 또는 "solid", "outline" 등
        style={{
          display: "flex",
          gap: "1rem",
          width: "12rem",
          borderRadius: "5rem",
        }}
        onClick={handleOpenModal}
      >
        <SearchIcon/>
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
        name={loginUser?.userId?.[0]}
      />
    </StyledRightHeader>
    </>
  )
}

export default RightHeader;

const StyledRightHeader = styled.div`
    gap: 1rem;
    height: 100%;
    justify-content: flex-end;
    display: flex;
    position: relative;
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

            /* 660px 이하에서 텍스트만 숨기기 */
            @media screen and (max-width: 660px) {
                display: none;
            }
        }

        /* 모바일에서 버튼 너비 조정 */
        @media screen and (max-width: 660px) {
            width: auto !important;
            min-width: 2.5rem;
        }
    }
`;