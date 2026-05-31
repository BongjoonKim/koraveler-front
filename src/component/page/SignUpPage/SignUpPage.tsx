// src/component/page/SignUpPage/SignUpPage.tsx

import {
  Box,
  Separator,
  VStack,
  HStack,
  Heading,
  Container,
  Alert,
  Text,
  Badge,
} from "@chakra-ui/react";
import CusInput from "../../../common/elements/textField/CusInput";
import useSignUpPage from "./useSignUpPage";
import CusFormCtrl from "../../../common/elements/CusFormCtrl";
import { useForm, FieldError } from "react-hook-form";
import CusButton from "../../../common/elements/buttons/CusButton";

export interface SignUpPageProps {

}

// Form data types for react-hook-form
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
    // 이메일 인증
    emailVerified,
    codeSent,
    verificationCode,
    cooldown,
    handleSendCode,
    handleVerifyCode,
    handleChangeCode,
    sendCodeLoading,
    verifyCodeLoading,
    // 뒤로가기
    handleBack,
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

  // Extract error message string from FieldError
  const getErrorMessage = (error: FieldError | undefined): string | undefined => {
    return error?.message;
  };

  // Form submission handler
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
            {/* ID */}
            <CusFormCtrl
              formTitle="ID"
              errMsg={getErrorMessage(errors.userId)}
              isInValid={!!errors.userId}
            >
              <CusInput
                {...register("userId", {
                  required: "Please enter your ID",
                  onChange: handleChangeId
                })}
                placeholder="Enter your ID"
              />
            </CusFormCtrl>

            {/* Password */}
            <CusFormCtrl
              formTitle="Password"
              errMsg={getErrorMessage(errors.userPassword)}
              isInValid={!!errors.userPassword}
            >
              <CusInput
                {...register("userPassword", {
                  required: "Please enter your password",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  },
                  onChange: handleChangePwd
                })}
                type="password"
                placeholder="Enter your password"
              />
            </CusFormCtrl>

            {/* Password Confirmation */}
            <CusFormCtrl
              formTitle="Password Check"
              errMsg={getErrorMessage(errors.passwordCheck)}
              isInValid={!!errors.passwordCheck}
            >
              <CusInput
                {...register("passwordCheck", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("userPassword") || "Passwords do not match",
                  onChange: handleChangePwdCheck
                })}
                type="password"
                placeholder="Re-enter your password"
              />
            </CusFormCtrl>

            <Separator />

            {/* Name */}
            <CusFormCtrl
              formTitle="Name"
              errMsg={getErrorMessage(errors.name)}
              isInValid={!!errors.name}
            >
              <CusInput
                {...register("name", {
                  required: "Please enter your name",
                  onChange: handleChangeName
                })}
                placeholder="Enter your name"
              />
            </CusFormCtrl>

            {/* Email + 인증 */}
            <CusFormCtrl
              formTitle={
                emailVerified ? "Email (Verified)" : "Email"
              }
              errMsg={getErrorMessage(errors.email)}
              isInValid={!!errors.email}
            >
              <HStack gap={2} w={'full'}>
                <Box flex={1}>
                  <CusInput
                    {...register("email", {
                      required: "Please enter your email",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email"
                      },
                      onChange: handleChangeEmail
                    })}
                    type="email"
                    placeholder="Enter your email"
                    disabled={emailVerified}
                  />
                </Box>
                <CusButton
                  type="button"
                  size="md"
                  colorPalette={emailVerified ? "green" : "blue"}
                  variant={emailVerified ? "subtle" : "outline"}
                  onClick={handleSendCode}
                  disabled={emailVerified || cooldown > 0 || sendCodeLoading}
                  flexShrink={0}
                >
                  {emailVerified
                    ? "Verified"
                    : cooldown > 0
                      ? `Resend (${cooldown}s)`
                      : codeSent
                        ? "Resend"
                        : "Send Code"
                  }
                </CusButton>
              </HStack>
            </CusFormCtrl>

            {/* 인증 코드 입력 (발송 후, 인증 전) */}
            {codeSent && !emailVerified && (
              <CusFormCtrl formTitle="Verification Code">
                <HStack gap={2}>
                  <Box flex={1}>
                    <CusInput
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={handleChangeCode}
                      maxLength={6}
                    />
                  </Box>
                  <CusButton
                    type="button"
                    size="md"
                    colorPalette="blue"
                    variant="solid"
                    onClick={handleVerifyCode}
                    disabled={verificationCode.length !== 6 || verifyCodeLoading}
                    flexShrink={0}
                  >
                    {verifyCodeLoading ? "Verifying..." : "Verify"}
                  </CusButton>
                </HStack>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  The code expires in 5 minutes
                </Text>
              </CusFormCtrl>
            )}
          </VStack>

          <VStack pt={4} gap={2}>
            <CusButton
              type="submit"
              size="lg"
              width="100%"
              colorPalette="blue"
              variant="solid"
              disabled={!emailVerified}
            >
              Sign Up
            </CusButton>
            <CusButton
              type="button"
              size="lg"
              width="100%"
              colorPalette="blue"
              variant="solid"
              onClick={handleBack}
            >
              Back
            </CusButton>
          </VStack>
        </VStack>
      </form>
    </Container>
  );
}

export default SignUpPage;
