// src/component/page/SignUpPage/SignUpPage.tsx

import {
  Box,
  Separator,
  VStack,
  Heading,
  Container
} from "@chakra-ui/react";
import { Alert } from "@chakra-ui/react";
import CusInput, {CusInputGroup} from "../../../common/elements/textField/CusInput";
import useSignUpPage from "./useSignUpPage";
import CusFormCtrl from "../../../common/elements/CusFormCtrl";
import { useForm, FieldError } from "react-hook-form";
import CusButton from "../../../common/elements/buttons/CusButton";

export interface SignUpPageProps {

}

// react-hook-form을 위한 타입 정의
interface SignUpFormData {
  userId: string;
  userPassword: string;
  passwordCheck: string;
  name: string;
  email: string;
}

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
  
  const { register, watch, formState: { errors } } = useForm<SignUpFormData>();
  
  // 에러 메시지를 문자열로 변환하는 헬퍼 함수
  const getErrorMessage = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };
  
  return (
    <Container maxW="md" py={8}>
      <VStack gap={6} align="stretch">
        {errMsg?.isShow && (
          <Alert.Root status={errMsg.status as any}>
            <Alert.Indicator />
            <Alert.Title>{errMsg.msg}</Alert.Title>
          </Alert.Root>
        )}
        
        <Box textAlign="center">
          <Heading size="2xl" color="gray.700">
            Sign Up
          </Heading>
        </Box>
        
        <VStack gap={4} align="stretch">
          {/* ID 생성 */}
          <CusFormCtrl
            formTitle="ID"
            errMsg={getErrorMessage(errors.userId)}
            isInValid={!!errors.userId}
          >
            <CusInput
              {...register("userId", { required: "아이디를 입력해주세요" })}
              onChange={handleChangeId}
              value={signUpForm.userId || ""}
              placeholder="아이디를 입력하세요"
            />
          </CusFormCtrl>
          
          {/* 비밀번호 생성 */}
          <CusFormCtrl
            formTitle="Password"
            errMsg={getErrorMessage(errors.userPassword)}
            isInValid={!!errors.userPassword}
          >
            <CusInputGroup
              {...register("userPassword", {
                required: "비밀번호를 입력해주세요",
                minLength: { value: 6, message: "비밀번호는 최소 6자 이상이어야 합니다" }
              })}
              type="password"
              value={signUpForm.userPassword || ""}
              onChange={handleChangePwd}
              placeholder="비밀번호를 입력하세요"
            />
          </CusFormCtrl>
          
          {/* 비밀번호 확인 */}
          <CusFormCtrl
            formTitle="Password Check"
            errMsg={getErrorMessage(errors.passwordCheck)}
            isInValid={!!errors.passwordCheck}
          >
            <CusInputGroup
              {...register("passwordCheck", {
                required: "비밀번호 확인을 입력해주세요",
                validate: (value) => value === watch("userPassword") || "비밀번호가 일치하지 않습니다"
              })}
              type="password"
              onChange={handleChangePwdCheck}
              value={checkPassword}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </CusFormCtrl>
          
          <Separator />
          
          {/* 이름 */}
          <CusFormCtrl
            formTitle="Name"
            errMsg={getErrorMessage(errors.name)}
            isInValid={!!errors.name}
          >
            <CusInput
              {...register("name", { required: "이름을 입력해주세요" })}
              onChange={handleChangeName}
              value={signUpForm.name || ""}
              placeholder="이름을 입력하세요"
            />
          </CusFormCtrl>
          
          {/* 이메일 */}
          <CusFormCtrl
            formTitle="Email"
            errMsg={getErrorMessage(errors.email)}
            isInValid={!!errors.email}
          >
            <CusInput
              {...register("email", {
                required: "이메일을 입력해주세요",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "올바른 이메일 형식을 입력해주세요"
                }
              })}
              type="email"
              onChange={handleChangeEmail}
              value={signUpForm.email || ""}
              placeholder="이메일을 입력하세요"
            />
          </CusFormCtrl>
        </VStack>
        
        <Box pt={4}>
          <CusButton
            onClick={handleSignUp}
            size="lg"
            width="100%"
            colorScheme="blue"
          >
            회원가입
          </CusButton>
        </Box>
      </VStack>
    </Container>
  );
}

export default SignUpPage;