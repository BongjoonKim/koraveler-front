import {MouseEvent, useCallback, useState} from "react";

function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  
  const handleAvatarClick = useCallback((event : MouseEvent<HTMLSpanElement>) => {
    setSliderOpen(prev => !prev);
  }, [isSliderOpen]);
  
  return {
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick
  }
}

export default useRightHeader;