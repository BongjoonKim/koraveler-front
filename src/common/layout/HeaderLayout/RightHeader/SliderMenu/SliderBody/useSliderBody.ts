import {SliderBodyProps} from "./SliderBody";
import {useNavigate} from "react-router-dom";
import {useRecoilValue} from "recoil";
import recoil from "../../../../../../stores/recoil";

export default function useSliderBody(props : SliderBodyProps) {
  const navigate = useNavigate();
  const loginUser = useRecoilValue(recoil.userData);
  
  return {
    navigate,
    loginUser
  }
}