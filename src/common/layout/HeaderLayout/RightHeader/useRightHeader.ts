import {MouseEvent, useCallback, useEffect, useRef, useState} from "react";
import {PrimitiveAtom, useAtom, useAtomValue} from "jotai";
import {LoginUser} from "../../../../stores/jotai/jotai";
import {loadable} from "jotai/utils";
import {getUserData} from "../../../../endpoints/users-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {getAllMenus, getAllMenus2, getAllMenus3} from "../../../../endpoints/menus-endpoints";
import {useRecoilState, useRecoilValue} from "recoil";
import recoil from "../../../../stores/recoil";
import {useLocation, useNavigate} from "react-router-dom";
import {endpointUtils} from "../../../../utils/endpointUtils";
import {getLoginUser} from "../../../../endpoints/login-endpoints";
import {REFESHTOKEN_EXPIRED} from "../../../../constants/ErrorCode";


function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  const navigate = useNavigate();
  // const [loginUser, setLoginUser] = useAtom(LoginUser);
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const location = useLocation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cusAvaRef = useRef<HTMLDivElement>(null);
  const [searchModalOpen ,setSearchModalOpen] = useState<boolean>(false);
  
  
  const handleAvatarClick = useCallback(async (event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
    try {
      // await getAllMenus2(accessToken, setAccessToken);
      // await getAllMenus3(accessToken, setAccessToken);
    } catch (e) {
      if (e === "refreshToken expired") {
        navigate("/login")
      }
    }
  }, [isSliderOpen]);
  
  const getUserInfo = useCallback(async () => {
    try {
      const res = await endpointUtils.authAxios({
        func : getLoginUser,
        accessToken : accessToken,
        setAccessToken : setAccessToken
      });
      if (res.data) {
        setLoginUser((prev : UsersDTO) => {
          if (prev.userId === res.data?.userId) {
            return prev;
          } else {
            return res.data
          }
        });
      }
    } catch (e) {
      if (e === REFESHTOKEN_EXPIRED) {
        // navigate("/login")
        setErrorMsg({
          status: "error",
          msg: REFESHTOKEN_EXPIRED,
        })
      }
      setErrorMsg({
        status: "error",
        msg: "retrieve failed",
      })
    }
  }, [accessToken, loginUser]);
  
  const handleCreate = useCallback(() => {
    navigate("/blog/create")
  }, []);
  
  const handleOpenModal = () => {
    console.log("SearchModalOpen", searchModalOpen)
    setSearchModalOpen(prev => !prev);
  }
  
  useEffect(() => {
    getUserInfo();
  }, []);
  
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
    loginUser,
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