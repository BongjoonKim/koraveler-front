import {Button, ButtonProps} from "@chakra-ui/react";

interface CusButtonProps extends ButtonProps {

}

function CusButton(props : CusButtonProps) {
  return (
    <Button
      {...props}
    />
  )
}

export default CusButton;