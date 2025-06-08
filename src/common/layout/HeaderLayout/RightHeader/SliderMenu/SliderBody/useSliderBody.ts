import {SliderBodyProps} from "./SliderBody";
import {useNavigate} from "react-router-dom";
import {useRecoilState, useRecoilValue} from "recoil";
import recoil from "../../../../../../stores/recoil";
import {createDocument} from "../../../../../../endpoints/blog-endpoints";
import useAuthEP from "../../../../../../utils/useAuthEP";

export default function useSliderBody(props : SliderBodyProps) {
  const navigate = useNavigate();
  const loginUser = useRecoilValue(recoil.userData);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const authEP = useAuthEP();
  
  const handleCreatePost = async () => {
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
  }
  
  return {
    navigate,
    loginUser,
    handleCreatePost
  }
}