import {Input, InputProps} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";

interface CusInputProps extends InputProps {

}

function CusInput(props : CusInputProps) {
  const [value, setValue] = useState<any>(props.value || "");
  console.log("값 확인", value)
  
  const handleChange = useCallback((event : any) => {
    setValue(event.target.value);
  }, [props.value, value]);
  
  return (
    <Input
      {...props}
      value={props.value}
      onChange={props.onChange}
    />
  )
}

export default CusInput