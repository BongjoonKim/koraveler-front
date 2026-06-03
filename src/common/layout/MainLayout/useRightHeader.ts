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
import {useAuth} from "../../../appConfig/AuthProvider";


function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const navigate = useNavigate();
  // const [loginUser, setLoginUser] = useAtom(LoginUser);
  const location = useLocation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cusAvaRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen ,setSearchModalOpen] = useState<boolean>(false);
  const [isLanguageModalOpen, setLanguageModalOpen] = useState<boolean>(false);
  const authEP = useAuthEP();
  const { clearAuth, refreshCurrentUserQuery } = useAuth(); // AuthContext에서 모든 액션 가져오기
  
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
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    // clearAuth가 이제 모든 것을 처리
    clearAuth(); // 쿼리 정리 + 토큰 제거를 한번에
    
    // localStorage 정리 (중복이지만 안전을 위해)
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // 홈으로 이동
    navigate('/home');
  };
  
  // 프로필 페이지로 이동
  const handleProfile = () => {
    navigate('/profile');
  };
  
  // 설정 페이지로 이동
  const handleSettings = () => {
    navigate('/settings');
  };
  
  // 내 블로그 관리 대시보드로 이동 (Drafts/Bookmarks/Trash 포함)
  const handleMyBlogs = () => {
    navigate('/blog/my');
  };
  
  // 로그인 페이지로 이동
  const handleLogin = () => {
    navigate('/login');
  };
  
  // 회원가입 페이지로 이동
  const handleSignup = () => {
    navigate('/login/sign-up');
  };
  
  const handleChat = () => {
    navigate(`/chat`)
  }
  
  const handleAdmin = () => {
    navigate("/admin/menu")
  }
  
  const handleUser = () => {
    navigate("/user/folder")
  }

  // 언어 설정 모달
  const handleOpenLanguageModal = () => {
    setSliderOpen(false); // 유저 메뉴 닫기
    setLanguageModalOpen(true);
  };

  const handleCloseLanguageModal = () => {
    setLanguageModalOpen(false);
  };
  
  
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
    currentUser,
    handleProfile,
    handleSettings,
    handleMyBlogs,
    handleLogin,
    handleLogout,
    handleSignup,
    handleChat,
    handleAdmin,
    handleUser,
    isLanguageModalOpen,
    handleOpenLanguageModal,
    handleCloseLanguageModal,
  }
}

export default useRightHeader;