// src/component/page/SignUpPage/SignUpPage.tsx

import {
  Box,
  Separator,
  VStack,
  Heading,
  Container,
  Alert
} from "@chakra-ui/react";
import CusInput from "../../../common/elements/textField/CusInput";
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
  
  const { register, watch, formState: { errors }, handleSubmit } = useForm<SignUpFormData>({
    mode: 'onBlur',
    defaultValues: {
      userId: signUpForm.userId || '',
      userPassword: signUpForm.userPassword || '',
      passwordCheck: checkPassword || '',
      name: signUpForm.name || '',
      email: signUpForm.email || ''
    }
  });
  
  // 에러 메시지를 문자열로 변환하는 헬퍼 함수
  const getErrorMessage = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };
  
  // 폼 제출 핸들러
  const onSubmit = (data: SignUpFormData) => {
    handleSignUp();
  };
  
  return (
    <Container maxW="md" py={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={6} align="stretch">
          {errMsg?.isShow && (
            <Alert.Root status={errMsg.status as "error" | "warning" | "success" | "info"}>
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
                {...register("userId", {
                  required: "아이디를 입력해주세요",
                  onChange: handleChangeId
                })}
                placeholder="아이디를 입력하세요"
              />
            </CusFormCtrl>
            
            {/* 비밀번호 생성 */}
            <CusFormCtrl
              formTitle="Password"
              errMsg={getErrorMessage(errors.userPassword)}
              isInValid={!!errors.userPassword}
            >
              <CusInput
                {...register("userPassword", {
                  required: "비밀번호를 입력해주세요",
                  minLength: {
                    value: 6,
                    message: "비밀번호는 최소 6자 이상이어야 합니다"
                  },
                  onChange: handleChangePwd
                })}
                type="password"
                placeholder="비밀번호를 입력하세요"
              />
            </CusFormCtrl>
            
            {/* 비밀번호 확인 */}
            <CusFormCtrl
              formTitle="Password Check"
              errMsg={getErrorMessage(errors.passwordCheck)}
              isInValid={!!errors.passwordCheck}
            >
              <CusInput
                {...register("passwordCheck", {
                  required: "비밀번호 확인을 입력해주세요",
                  validate: (value) =>
                    value === watch("userPassword") || "비밀번호가 일치하지 않습니다",
                  onChange: handleChangePwdCheck
                })}
                type="password"
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
                {...register("name", {
                  required: "이름을 입력해주세요",
                  onChange: handleChangeName
                })}
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
                  },
                  onChange: handleChangeEmail
                })}
                type="email"
                placeholder="이메일을 입력하세요"
              />
            </CusFormCtrl>
          </VStack>
          
          <Box pt={4}>
            <CusButton
              type="submit"
              size="lg"
              width="100%"
              colorPalette="blue"
              variant="solid"
            >
              회원가입
            </CusButton>
          </Box>
        </VStack>
      </form>
    </Container>
  );
}

export default SignUpPage;