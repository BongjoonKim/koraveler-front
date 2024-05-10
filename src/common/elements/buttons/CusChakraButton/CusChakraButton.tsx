import {Button, ButtonProps} from "@chakra-ui/react";

interface CusChakraButtonProps extends ButtonProps {

}

function CusChakraButton(props : CusChakraButtonProps) {
  return (
    <Button
      {...props}
    />
    // <button
    //   onClick={props.onClick}
    // >
    //   {props.children}
    // </button>
  )
}

export default CusChakraButton;