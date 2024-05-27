import {useState} from "react";

function useRightHeader() {
  const [isSliderOpen ,setSliderOpen] = useState<boolean>(false);
  
  return {
    isSliderOpen,
    setSliderOpen,
  }
}

export default useRightHeader;