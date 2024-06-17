import {Input, InputProps} from "@chakra-ui/react";

interface CusInputProps extends InputProps {

}

function CusInput(props : CusInputProps) {
  return (
    <Input
      {...props}
    />
  )
}

export default CusInput