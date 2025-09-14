import {SignUpPageProps} from "./SignUpPage";
import {ChangeEvent, useCallback, useState} from "react";
import {useRecoilState, useResetRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {signUp} from "../../../endpoints/login-endpoints";
import {useNavigate} from "react-router-dom";
import {UsersDTO} from "../../../types/users/UsersDTO";

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
  
  // 아이디 확인하기
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
    })
  }, [signUpForm, checkPassword]);
  
  const handleChangeBirthday = useCallback((event : ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev : any) => {
      return {
        ...prev,
        name : event.target.value
      }
    })
  }, [signUpForm, checkPassword]);
  
  const beforeSignUpCheck = useCallback(() => {
    try {
      console.log("검사", signUpForm.userId)
      if (signUpForm.userId) {
        const regex = /^[A-Za-z][A-Za-z0-9]{3,}$/;
        console.log("검사2", regex.test(signUpForm.userId))
        if (!regex.test(signUpForm.userId)) {
          throw "영어로 3글자 이상 + 특수문자 없이 사용해주세요"
        }
      } else {
        throw "Invalid ID"
      }
      if (signUpForm.userPassword) {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,32}$/;
        if (!regex.test(signUpForm.userPassword)) {
          throw "영어로 6글자 이상, 32글자 이하, 특수문자, 숫자, 대문자 1개 이상 포함"
        }
      } else {
        throw "비밀번호를 입력해주세요"
      }
      if (checkPassword) {
        if (signUpForm.userPassword !== checkPassword) {
          throw "입력한 비밀번호와 비밀번호 확인이 다릅니다"
        }
      } else {
        throw "비밀번호 체크를 해주세요"
      }
      if (signUpForm.name) {
        const regex = /^\p{L}{2,}$/u;
        if (!regex.test(signUpForm.name)) {
          throw "이름 형식을 맞춰주세요"
        }
      } else {
        throw "이름을 작성해주세요";
      }
      if (signUpForm.email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!regex.test(signUpForm.email)) {
          throw '이메일 형식을 맞춰주세요'
        }
      } else {
        throw "이메일을 작성해주세요";
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
  }, [signUpForm, checkPassword]);
  
  const handleSignUp = useCallback(async () => {
    
    try {
      // valid 확인
      beforeSignUpCheck();
      const res = await signUp(signUpForm);
      console.log("res.data", res)
      navigate('/login')
    } catch (e : any) {
      console.log("res.data", e)
      setErrMsg({
        isShow : true,
        status : "error",
        msg : e.response?.data.toString()
      })
      setTimeout(() => {
        errMsgReset();
      }, 2000);
    }
  }, [signUpForm, beforeSignUpCheck]);
  
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
  }
}
