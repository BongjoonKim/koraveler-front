import {MenuModalBodyProps} from "./MenuModalBody";
import {useCallback} from "react";

export type MenusDTOKeys = keyof MenusDTO;

export default function useMenuModalBody(props : MenuModalBodyProps) {
  console.log("props.data", props.data)
  const handleChange = useCallback((event : any, key ?: MenusDTOKeys) => {
    if (key && props.setData) {
      props.setData((prev : MenusDTO) => {
        prev[key] = event.target.value;
        return prev;
      });
    }
  }, [props.data]);
  
  return {
    handleChange
  }
}