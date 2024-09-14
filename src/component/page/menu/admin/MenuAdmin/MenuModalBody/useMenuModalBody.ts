import {MenuModalBodyProps} from "./MenuModalBody";
import {useCallback} from "react";
import {cloneDeep} from "lodash";

export type MenusDTOKeys = keyof MenusDTO;

export default function useMenuModalBody(props : MenuModalBodyProps) {
  const handleChange = useCallback((event : any, field:keyof MenusDTO, value: any) => {
    if (field && props.setData) {
      props.setData((prev : MenusDTO) => {
        const data = cloneDeep(prev);
        data[field] = value;
        console.log("전체 값", data)
        return data;
      });
    }
  }, [props.data]);
  
  return {
    handleChange
  }
}