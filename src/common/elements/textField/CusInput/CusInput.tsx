import {Input, InputGroup, InputGroupProps, InputLeftElement, InputProps, InputRightElement} from "@chakra-ui/react";
import {ReactNode, useCallback, useEffect, useState} from "react";
import CusButton from "../../buttons/CusButton";

export interface CusInputProps extends InputProps {

}

export interface CusInputGroupProps extends CusInputProps {
  inputLeftElement ?: ReactNode;
  inputRightElement ?: ReactNode;
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
  const [isPassword, setPassword] = useState<boolean>(false);
  return (
    <InputGroup>
      {props.inputLeftElement && (
        <InputLeftElement>
          {props.inputLeftElement}
        </InputLeftElement>
      )}
      <Input
        type={isPassword ? 'password' : 'text'}
        {...props}
      />
      {props.inputRightElement && (
        <InputRightElement>
          {props.inputRightElement}
        </InputRightElement>
      )}
        {/*<CusButton onClick={() => setShow(prev => !prev)} size="sm">*/}
        {/*  {isShow ? "show" : "hide"}*/}
        {/*</CusButton>*/}
    </InputGroup>
  )


}

export default CusInput