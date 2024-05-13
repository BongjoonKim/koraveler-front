import CusInput from "../../../elements/textField/CusInput";

export interface PartTypeProps {
  type : string;
  value ?: any;
  onChange ?: (event : any) => void;
}

function PartType(props : PartTypeProps) {
  switch (props.type) {
    case "textField":
      return (
        <TextField
          value={props.value}
          onChange={props.onChange}
        />
      );
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