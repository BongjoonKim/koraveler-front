import {MenuModalBodyProps} from "./MenuModalBody";
import {useCallback} from "react";
import {cloneDeep} from "lodash";

export type MenusDTOKeys = keyof MenusDTO;

export default function useMenuModalBody(props : MenuModalBodyProps) {
  console.log("props.data", props.data)
  const handleChange = useCallback((event : any, name:any, value: any) => {
    console.log("값 확인", name, value)
    if (name && props.setData) {
      props.setData((prev : MenusDTO) => {
        const data = cloneDeep(prev);
        // @ts-ignore
        data[name] = value;
        console.log("전체 값", data)
        return data;
      });
    }
  }, [props.data]);
  
  return {
    handleChange
  }
}