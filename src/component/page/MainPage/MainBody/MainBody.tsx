import styled from "styled-components";
import {useRecoilValue} from "recoil";
import recoil from "../../../../stores/recoil";
import CusWeather from "../../../../common/widget/CusWeather";

interface MainBodyProps {

}

function MainBody(props : MainBodyProps) {
  const loginUser = useRecoilValue(recoil.userData);
  console.log("메인 페이지에서 로그인 정보₩", loginUser)
  return (
    <StyledMainBody>
      {/*<div className="main-img">*/}
      {/*  <img src={`${process.env.PUBLIC_URL}/IMG_0656.JPG`}/>*/}
      {/*</div>*/}
      {/*<div className="main-word">*/}
      {/*  <span className="first">*/}
      {/*    Welcome,*/}
      {/*  </span>*/}
      {/*  <div className="second">*/}
      {/*    <span className="south">*/}
      {/*      South*/}
      {/*    </span>*/}
      {/*    <span className="korea">*/}
      {/*      Korea*/}
      {/*    </span>*/}
      {/*  </div>*/}
      {/*</div>*/}
      <div className="first-floor">
        <CusWeather />
      </div>
    </StyledMainBody>
  )
}

export default MainBody;

const StyledMainBody = styled.div`
  width: 100%;
  padding: 1rem 2rem;
  .main-img {
    width: 100%;
    height: 100%;
    position: absolute;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .main-word {
    position: absolute;
    top: 20%;
    left: 10%;
    display: flex;
    flex-direction: column;
    font-size: 4rem;
    font-weight: 900;
    .second {
      display: flex;
      gap: 1rem;
      .south {
        color: darkblue;
      }
      .korea {
        color: darkblue;
      }
    }
  }
`;