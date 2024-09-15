import {Input, InputGroup, InputGroupProps, InputProps, InputRightElement} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";
import CusButton from "../../buttons/CusButton";

export interface CusInputProps extends InputProps {

}

export interface CusInputGroupProps extends CusInputProps {

}

function CusInput(props : CusInputProps) {
  const [value, setValue] = useState<any>(props.value || "");
  
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

export function CusInputGroup(props : CusInputGroupProps) {
  const [isShow, setShow] = useState<boolean>(false);
  return (
    <InputGroup>
      <CusInput
        type={isShow ? 'text' : 'password'}
        {...props}
      />
      <InputRightElement width='5rem'>
        <CusButton onClick={() => setShow(prev => !prev)} size="sm">
          {isShow ? "show" : "hide"}
        </CusButton>
      </InputRightElement>
    </InputGroup>
  )


}

export default CusInput