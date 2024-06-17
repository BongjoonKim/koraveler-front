import styled from "styled-components";
import CusInput from "../../../common/elements/textField/CusInput";
import useLoginPage from "./useLoginPage";
import CusButton from "../../../common/elements/buttons/CusButton";
import {ChangeEvent} from "react";

interface LoginPageProps {

};

function LoginPage(props: LoginPageProps) {
  const {
    userInfo,
    userId,
    handleChange,
    handleClickTitle,
    handleClickLogin
  } = useLoginPage();
  return (
    <StyledLoginPage>
      <span
        className="title"
        onClick={handleClickTitle}
      >
        Koraveler
      </span>
      <div className="wrapper-body">
        <CusInput
          placeholder="ID"
          value={userInfo.userId}
          onChange={(event:any) => handleChange(event, "id")}
        />
        <CusInput
          placeholder="PASSWORD"
          value={userInfo.userPassword}
          onChange={(event:any) => handleChange(event, "password")}
        />
      </div>
      <div className="wrapper-footer">
        <CusButton
          // onClick={}
        >
          SignUp
        </CusButton>
        <CusButton
          onClick={handleClickLogin}
        >
          Login
        </CusButton>
      </div>

      
    </StyledLoginPage>
  )
};

export default LoginPage;

const StyledLoginPage = styled.div`
  border: 1px solid gray;
  padding: 2rem;
  border-radius: 10px 10px;
  width: 40vw;
  min-width: max-content;
  display: inline-block;
  flex-direction: column;
  gap: 1rem;
  .title {
    font-weight: bold;
    font-size: 4rem;
    cursor: pointer;
    width: fit-content;
    white-space: nowrap;
  }
  .wrapper-body {
    display: flex;
    flex-direction: column;
  }
  .wrapper-footer {
    display: flex;
    justify-content: space-between;
  }
`;
