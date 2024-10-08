import styled from "styled-components";
import {Divider, FormControl, FormLabel} from "@chakra-ui/react";
import CusInput, {CusInputGroup} from "../../../common/elements/textField/CusInput";
import useSignUpPage from "./useSignUpPage";
import CusFormCtrl from "../../../common/elements/CusFormCtrl/CusFormCtrl";
import { useForm } from "react-hook-form";
import CusButton from "../../../common/elements/buttons/CusButton";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

export interface SignUpPageProps {

};

function SignUpPage(props: SignUpPageProps) {
  const {
    signUpForm,
    checkPassword,
    errMsg,
    handleChangeId,
    handleChangePwd,
    handleChangePwdCheck,
    handleChangeName,
    handleChangeEmail,
    handleSignUp,
  } = useSignUpPage(props);
  const { register, watch, formState: { errors } } = useForm();
  return (
    <StyledSignUpPage>
      {errMsg?.isShow && (
        <Alert status={errMsg.status}>
          <AlertIcon />
          <AlertTitle>{errMsg.msg}</AlertTitle>
        </Alert>
      )}
      <div className="sign-up-header">
        <span className="title">Sign Up</span>
      </div>
      <div className="sign-up-body">
        {/* ID 생성 */}
        <CusFormCtrl
          formTitle="ID"
        >
          <CusInput onChange={handleChangeId} value={signUpForm.userId || ""}/>
        </CusFormCtrl>
        {/*  비밀번호 생성 */}
        <CusFormCtrl
          formTitle="Password"
          errMsg={errors.name}
        >
          <CusInputGroup
            value={signUpForm.userPassword || ""}
            onChange={handleChangePwd}
          />
        </CusFormCtrl>
        {/* 비밀번호 확인 */}
        <CusFormCtrl
          formTitle="Password Check"
        >
          <CusInputGroup onChange={handleChangePwdCheck} value={checkPassword}/>
        </CusFormCtrl>
        <Divider/>
        {/* 이름 */}
        <CusFormCtrl
          formTitle="Name"
        >
          <CusInput onChange={handleChangeName} value={signUpForm.name || ""}/>
        </CusFormCtrl>
        {/* 이메일 */}
        <CusFormCtrl
          formTitle="Email"
        >
          <CusInput onChange={handleChangeEmail} value={signUpForm.email || ""}/>
        </CusFormCtrl>
        {/*/!* 생일 *!/*/}
        {/*<CusFormCtrl*/}
        {/*  formTitle="Birthday"*/}
        {/*>*/}
        {/*  <CusInputGroup onChange={handleChangePwdCheck} value={checkPassword}/>*/}
        {/*</CusFormCtrl>*/}
      </div>
      <div className="sign-up-footer">
        <CusButton
          onClick={handleSignUp}
        >회원가입</CusButton>
      </div>
    </StyledSignUpPage>
  )
};

export default SignUpPage;

const StyledSignUpPage = styled.div`
  width: 80%;
  height: 90%;
  display: flex;
  flex-direction: column;
  .sign-up-header {
    width: 100%;
    display: flex;
    justify-content: center;
    .title {
      font-size: 4rem;
      font-weight: 500;
    }
    
  }
  .sign-up-body {
    flex: 1 1;
  }
  .sign-up-footer {
    height: 4rem;
    display: flex;
    justify-content: space-between;
  }
`;
