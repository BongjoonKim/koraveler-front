import styled, {css} from "styled-components";
import {Link} from "react-router-dom";
import CusButton from "../../../../../elements/buttons/CusButton";
import useSliderBody from "./useSliderBody";

export interface SliderBodyProps {

};

function SliderBody(props: SliderBodyProps) {
  const {navigate, loginUser,handleCreatePost} = useSliderBody(props);
  return (
    <StyledSliderBody isLogin={!!loginUser?.userId}>
      {loginUser?.userId ? (
        <>
          {/*<Link className="box" to={`/blog/create`}>*/}
          {/*  /!*<Link to={`/blog/create`}>*!/*/}
          {/*  글 생성*/}
          {/*  /!*</Link>*!/*/}
          {/*</Link>*/}
          <div className="box" onClick={handleCreatePost} style={{cursor: 'pointer'}}>
            글 생성
          </div>
          <Link className="box" to={`/blog/draft`}>
            {/*<Link className="box" to={`/blog/create`}>*/}
            임시 글
            {/*</Link>*/}
          </Link>
          <Link className="box" to={`/blog/bookmark`}>
            {/*<Link className="box" to={`/blog/create`}>*/}
            북마크
            {/*</Link>*/}
          </Link>
          <Link className="box" to={`/blog/my-blog`}>
            {/*<Link className="box" to={`/blog/create`}>*/}
            나의 글
            {/*</Link>*/}
          </Link>
        </>
      ) : (
        <div className="not-logined">
          <CusButton
            onClick={() => {
              navigate("/login")
            }}
          >
            로그인
          </CusButton>
          <CusButton
            onClick={() => {
              navigate("/login/sign-up")
            }}
          >
            회원가입
          </CusButton>
        </div>
      )}
    </StyledSliderBody>
  )
};

export default SliderBody;

const StyledSliderBody = styled.div<{isLogin : boolean}>`
  width: 100%;
  height: 100%;
  padding: 1rem 0;
  ${props => props.isLogin ? (
    css`
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 8px;
      .box {
        min-height: 40px;
        border-radius: 12px 12px;
        display: flex;
        background: snow;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 20px;
      }
    `
  ) : (
    css`
      .not-logined {
        display: flex;
        flex-direction: column;
        gap : 4px;
      }
    `
  )}
`;
