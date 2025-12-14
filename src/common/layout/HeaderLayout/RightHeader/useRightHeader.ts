import {MouseEvent, useCallback, useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import recoil from "../../../../stores/recoil";
import {useLocation, useNavigate} from "react-router-dom";
import {getLoginUser} from "../../../../endpoints/login-endpoints";
import {REFESHTOKEN_EXPIRED} from "../../../../constants/ErrorCode";
import useAuthEP from "../../../../utils/useAuthEP";
import {UsersDTO} from "../../../../types/users/UsersDTO";
import {useCurrentUser} from "../../../../hooks/useCurrentUser";

// 미사용 컴포넌트
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
  const {data : currentUser } = useCurrentUser();
  
  const handleAvatarClick = useCallback(async (event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
    try {
    } catch (e) {
      if (e === "refreshToken expired") {
        navigate("/login")
      }
    }
  }, [isSliderOpen]);
  
  const handleCreate = useCallback(() => {
    navigate("/blog/create")
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
    currentUser,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick,
    handleCreate,
    location,
    sliderRef,
    cusAvaRef,
    handleOpenModal,
    searchModalOpen
  }
}

export default useRightHeader;