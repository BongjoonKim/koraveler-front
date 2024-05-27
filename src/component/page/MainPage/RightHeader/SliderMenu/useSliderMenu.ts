import {MouseEventHandler, useCallback} from "react";
import {SliderMenuProps} from "./SliderMenu";

function useSliderMenu(props : SliderMenuProps) {
  const handleAvatarClick = useCallback((event : MouseEventHandler<HTMLDivElement>) => {
    props.setSliderOpen(prev => !prev);
  }, [props.isSliderOpen]);
  
  return {
    handleAvatarClick
  }
}

export default useSliderMenu;