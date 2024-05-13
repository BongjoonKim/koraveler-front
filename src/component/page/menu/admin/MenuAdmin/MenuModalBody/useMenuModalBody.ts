import {MenuModalBodyProps} from "./MenuModalBody";
import {useCallback} from "react";

export default function useMenuModalBody(props : MenuModalBodyProps) {
  const handleChange = useCallback(() => {
  
  }, [props.data]);
  
  return {
    handleChange
  }
}