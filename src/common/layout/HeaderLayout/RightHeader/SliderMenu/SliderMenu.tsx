import styled, {css} from "styled-components";
import {
  Dispatch, ForwardedRef,
  forwardRef,
  LegacyRef,
  MouseEventHandler,
  MutableRefObject,
  RefObject,
  SetStateAction,
  useState
} from "react";
import useSliderMenu from "./useSliderMenu";
import CusButton from "../../../../elements/buttons/CusButton";
import {lowerCase} from "lodash";
import {Link} from "react-router-dom";
import SliderBody from "./SliderBody";
import {stringMap} from "aws-sdk/clients/backup";

export interface SliderMenuProps {
  isSliderOpen : boolean;
  setSliderOpen : Dispatch<SetStateAction<boolean>>
};

function SliderMenu(props: SliderMenuProps, ref : ForwardedRef<HTMLDivElement>) {
  const {
    loginUser,
    handleAvatarClick,
    handleLoginClick,
    handleLogout,
    navigate
  } = useSliderMenu(props);
  
  return (
    <StyledSlider
      isLogin={!!loginUser?.userId}
      isslideropen={props.isSliderOpen.toString()}
      ref={ref}
    >
      <div className="wrapper-sliderMenu">
        <div className="head">
          <div className="id">
            {loginUser?.userId ? (
    
              <div className="user-id">
                <span>{loginUser.userId}</span>
              </div>
              ) : (
                <span className="login-plz">로그인해주세요</span>
              )}
          </div>
          <div className="user-info">
            <span className="user-email">{loginUser.email}</span>
          </div>
        </div>
        <div className={"body"}>
          <SliderBody/>
        </div>
        <div className={"footer"}>
          {loginUser?.userId && (
            <>
              {loginUser.roles?.includes("admin") && (
                <Link className="account" to={`/admin/menu`}>
                  관리자 설정
                </Link>
              )}
              <div className="account"
                   onClick={handleLogout}
              >
                logout
              </div>
            </>
          )}
        </div>
      </div>
    </StyledSlider>
  )
};

export default forwardRef(SliderMenu);
// onClick: (event: MouseEventHandler<HTMLDivElement>) => void;

const StyledSlider = styled.div<{
  isslideropen : string,
  isLogin : boolean
}>`
  width: 20rem;
  position: absolute;
  background: whitesmoke;
  left: calc(100% - 20rem + 1rem);
  top : -1rem;
  border-radius: 16px;
  //padding: 1.5rem;
  .wrapper-sliderMenu {
    margin: 1rem;
  }
  
  transition: ${props => props.isslideropen ? "width 2s": "none"};
  ${props => {
    if (props.isslideropen === "true") {
      return css`
        transition-property:  height, padding;
        transition-duration: 600ms, 600ms;
        height: ${props.isLogin ? "24rem" : "auto"};
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
  
  display: flex;
  flex-direction: column;
  .wrapper-sliderMenu {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .head {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    .id {
      display: flex;
      justify-content: center;
      overflow: hidden;
      gap: 1rem;
      width: calc(18rem - 56px);
      height: 48px;
      align-items: center;
      .user-id {
        font-size: 2rem;
        font-weight: 600;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        span {
          text-align: left;
        }
      }
    }
    .user-info {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .body {
    height: 100%;
    width: 100%;
    flex-grow: 3;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    flex-grow: 1;
    width: 100%;
    .account {
      cursor: pointer;
      font-size: 16px;
    }
  }
`;
