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
    handleClickLogin,
    handleClickSignUp,
    pressEnter,
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
          id="id"
          name="id"
          type="text"
          onKeyUp={pressEnter}
          onChange={(event:ChangeEvent<HTMLInputElement>) => handleChange(event, "id")}
        />
        <CusInput
          placeholder="PASSWORD"
          value={userInfo.userPassword}
          type="password"
          id="pw"
          name="pw"
          onKeyUp={pressEnter}
          onChange={(event:ChangeEvent<HTMLInputElement>) => handleChange(event, "password")}
        />
      </div>
      <div className="wrapper-footer">
        <CusButton
          onClick={handleClickSignUp}
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
  max-width: 500px;
  min-width: max-content;
  //display: inline-block;
  flex-direction: column;
  gap: 1rem;
  display: flex;
  flex-direction: column;
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
    gap : 0.5rem;
  }
  .wrapper-footer {
    display: flex;
    justify-content: space-between;
  }
`;
