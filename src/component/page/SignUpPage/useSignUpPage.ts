import {SignUpPageProps} from "./SignUpPage";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState, useResetRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {signUp} from "../../../endpoints/login-endpoints";
import {useNavigate} from "react-router-dom";
import {UsersDTO} from "../../../types/users/UsersDTO";
import {useSendVerificationCode, useVerifyEmailCode} from "../../../hooks/useUserQueries";

type ErrValidType = {
  [K in keyof UsersDTO]: string;
};

export default function useSignUpPage(props : SignUpPageProps) {
  const [signUpForm, setSignUpForm] = useState<UsersDTO>({});
  const [checkPassword, setCheckPassword] = useState<string>("");
  const [userErrValid, setUserErrValid] = useState<ErrValidType>({});
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const errMsgReset = useResetRecoilState(recoil.errMsg);
  const navigate = useNavigate();

  // 이메일 인증 상태
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownRef = useRef<NodeJS.Timeout | null>(null);

  const sendCodeMutation = useSendVerificationCode();
  const verifyCodeMutation = useVerifyEmailCode();

  // 쿨다운 타이머
  useEffect(() => {
    if (cooldown > 0) {
      cooldownRef.current = setTimeout(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, [cooldown]);

  const showError = useCallback((msg: string) => {
    setErrMsg({
      isShow: true,
      status: "error",
      msg,
    });
    setTimeout(() => errMsgReset(), 3000);
  }, [setErrMsg, errMsgReset]);

  const showSuccess = useCallback((msg: string) => {
    setErrMsg({
      isShow: true,
      status: "success",
      msg,
    });
    setTimeout(() => errMsgReset(), 3000);
  }, [setErrMsg, errMsgReset]);

  // 인증 코드 발송
  const handleSendCode = useCallback(async () => {
    if (!signUpForm.email) {
      showError("Please enter your email");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(signUpForm.email)) {
      showError("Please enter a valid email");
      return;
    }
    try {
      await sendCodeMutation.mutateAsync({ email: signUpForm.email });
      setCodeSent(true);
      setCooldown(60);
      showSuccess("Verification code sent to your email");
    } catch (e: any) {
      const msg = e.response?.data?.msg || "Failed to send verification code";
      showError(msg);
    }
  }, [signUpForm.email, sendCodeMutation, showError, showSuccess]);

  // 인증 코드 검증
  const handleVerifyCode = useCallback(async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showError("Please enter the 6-digit verification code");
      return;
    }
    try {
      await verifyCodeMutation.mutateAsync({
        email: signUpForm.email!,
        code: verificationCode,
      });
      setEmailVerified(true);
      showSuccess("Email verified successfully");
    } catch (e: any) {
      const msg = e.response?.data?.msg || "Invalid verification code";
      showError(msg);
    }
  }, [signUpForm.email, verificationCode, verifyCodeMutation, showError, showSuccess]);

  const handleChangeCode = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    // 숫자만 허용, 6자리 제한
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
  }, []);

  // Validate ID input
  const handleChangeId = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        userId : event.target.value
      }
    })
  }, [signUpForm]);

  const handleChangePwd = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        userPassword : event.target.value
      }
    })
  }, [signUpForm]);

  const handleChangePwdCheck = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(event.target.value)
  }, [signUpForm, checkPassword]);

  const handleChangeName = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        name : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);

  const handleChangeEmail = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        email : event.target.value
      }
    });
    // 이메일이 바뀌면 인증 초기화
    setEmailVerified(false);
    setCodeSent(false);
    setVerificationCode("");
  }, [signUpForm, checkPassword]);

  const beforeSignUpCheck = useCallback(() => {
    try {
      console.log("validation", signUpForm.userId)
      if (signUpForm.userId) {
        const regex = /^[A-Za-z][A-Za-z0-9]{3,}$/;
        console.log("validation", regex.test(signUpForm.userId))
        if (!regex.test(signUpForm.userId)) {
          throw "ID must be at least 3 alphanumeric characters, no special characters"
        }
      } else {
        throw "Invalid ID"
      }
      if (signUpForm.userPassword) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,32}$/;
        if (!regex.test(signUpForm.userPassword)) {
          throw "Password must be 6-32 characters, including at least one uppercase letter, number, and special character"
        }
      } else {
        throw "Please enter your password"
      }
      if (checkPassword) {
        if (signUpForm.userPassword !== checkPassword) {
          throw "Passwords do not match"
        }
      } else {
        throw "Please confirm your password"
      }
      if (signUpForm.name) {
        const regex = /^\p{L}{2,}$/u;
        if (!regex.test(signUpForm.name)) {
          throw "Please enter a valid name"
        }
      } else {
        throw "Please enter your name";
      }
      if (signUpForm.email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(signUpForm.email)) {
          throw "Please enter a valid email"
        }
      } else {
        throw "Please enter your email";
      }
      // 이메일 인증 확인
      if (!emailVerified) {
        throw "Please verify your email first"
      }
    } catch (e) {
      setUserErrValid(prev => ({
        userId : signUpForm.userId
      }));
      setErrMsg({
        isShow : true,
        status : "error",
        msg : e?.toString()
      })
      setTimeout(() => {
        errMsgReset();
      }, 2000);

    }
  }, [signUpForm, checkPassword, emailVerified]);

  const handleSignUp = useCallback(async () => {

    try {
      // Run validation checks
      beforeSignUpCheck();
      const res = await signUp(signUpForm);
      console.log("res.data", res)
      navigate('/login')
    } catch (e : any) {
      console.log("res.data", e)
      const msg = e.response?.data?.msg || e.response?.data?.toString() || e?.toString();
      setErrMsg({
        isShow : true,
        status : "error",
        msg,
      })
      setTimeout(() => {
        errMsgReset();
      }, 2000);
    }
  }, [signUpForm, beforeSignUpCheck]);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    signUpForm,
    checkPassword,
    errMsg,
    handleChangeId,
    handleChangePwd,
    handleChangePwdCheck,
    handleSignUp,
    handleChangeName,
    handleChangeEmail,
    // 이메일 인증
    emailVerified,
    codeSent,
    verificationCode,
    cooldown,
    handleSendCode,
    handleVerifyCode,
    handleChangeCode,
    sendCodeLoading: sendCodeMutation.isPending,
    verifyCodeLoading: verifyCodeMutation.isPending,
    // 뒤로가기
    handleBack,
  }
}
