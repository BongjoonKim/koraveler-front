import {MouseEvent, useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import recoil from "../../../stores/recoil";
import {useLocation, useNavigate} from "react-router-dom";
import useAuthEP from "../../../utils/useAuthEP";
import {getLoginUser} from "../../../endpoints/login-endpoints";
import {UsersDTO} from "../../../types/users/UsersDTO";
import {REFESHTOKEN_EXPIRED} from "../../../constants/ErrorCode";
import {useCurrentUser} from "../../../hooks/useCurrentUser";
import {createDocument} from "../../../endpoints/blog-endpoints";


function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const navigate = useNavigate();
  // const [loginUser, setLoginUser] = useAtom(LoginUser);
  const location = useLocation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cusAvaRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen ,setSearchModalOpen] = useState<boolean>(false);
  const authEP = useAuthEP();
  
  const currentUser = useCurrentUser();
  
  
  const handleAvatarClick = useCallback(async (event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
    try {
    } catch (e) {
      if (e === "refreshToken expired") {
        navigate("/login")
      }
    }
  }, [isSliderOpen]);
  
  const handleCreate = useCallback(async () => {
    try {
      const request: DocumentDTO = {
        contents: "",
        draft: true
      }
      
      // 글 생성하기
      const res = await authEP({
        func: createDocument,
        reqBody: request
      })
      navigate(`/blog/create/${res.data.id}`)
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: "글 생성에 실패했습니다.",
      });
    }
  }, []);
  
  const handleOpenModal = () => {
    console.log("SearchModalOpen", searchModalOpen)
    setSearchModalOpen(prev => !prev);
  }
  
  // 컴포넌트 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event : any) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target)) {
        if (cusAvaRef.current && !cusAvaRef.current.contains(event.target)) {
          setSliderOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sliderRef]);
  
  return {
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick,
    handleCreate,
    location,
    sliderRef,
    cusAvaRef,
    handleOpenModal,
    searchModalOpen,
    currentUser
  }
}

export default useRightHeader;