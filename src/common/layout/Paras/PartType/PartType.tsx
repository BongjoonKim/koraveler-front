import CusInput from "../../../elements/textField/CusInput";
import {KeyboardEventHandler, useCallback} from "react";
import {isNumber} from "../../../../utils/commonUtils";
export interface PartTypeProps {
  inputType ?: string;
  fieldType ?: string;
  field ?: string;
  value ?: any;
  onChange ?: (event ?: any, field ?: any, value?: any) => void;
}

function PartType(props : PartTypeProps) {
  console.log("PartType의 value", props.value)
  // 데이터 형식에 맞게 변형
  const handleChange = useCallback((event: any) => {
    let value : string | number | undefined = undefined;
    if (props.fieldType === "string") {
      value = event.target.value;
    } else if (props.fieldType === "number") {
      value = 0;
      console.log("event.target.value", event.target.value, isNumber(event.target.value))
      if (isNumber(event.target.value)) {
        value = parseInt(event.target.value, 10);
      }
    }
    console.log("value", value)
    props.onChange?.(event, props.field, value);
  }, [props.value, props.onChange, props.field]);
  
  switch (props.inputType) {
    case "textField":
      return (
        <CusInput
          value={props.value}
          onChange={handleChange}
        />
      );
      break;
    default:
      return <></>;
      break;
  }
}



export default PartType;