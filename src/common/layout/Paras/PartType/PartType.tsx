import CusInput from "../../../elements/textField/CusInput";
import {KeyboardEventHandler} from "react";

export interface PartTypeProps {
  type : string;
  value ?: any;
  onChange ?: (event : any) => void;
  onKeyUp ?: KeyboardEventHandler<HTMLInputElement> | undefined;
}

function PartType(props : PartTypeProps) {
  switch (props.type) {
    case "textField":
      return (
        // <TextField
        //   value={props.value}
        //   onKey
        //   onChange={props.onChange}
        // />
        <CusInput
          value={props.value}
          onChange={props.onChange}
          onKeyUp={props.onKeyUp}
        />
      );
      break;
    default:
      return <></>;
      break;
  }
}



export default PartType;