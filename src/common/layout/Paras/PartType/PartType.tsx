import CusInput from "../../../elements/textField/CusInput";

export interface PartTypeProps {
  type : string;
  value ?: any;
}

function PartType(props : PartTypeProps) {
  switch (props.type) {
    case "textField":
      return <TextField value={props.value}/>;
      break;
    default:
      return <></>;
      break;
  }
}

function TextField(props : any) {
  return (
    <CusInput
      value={props.value}
    />
  )
}



export default PartType;