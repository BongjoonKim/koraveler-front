import styled from "styled-components";
import {Select, SelectProps} from "@chakra-ui/react";
import {ReactNode} from "react";

interface CusSelectProps extends SelectProps{
    children : ReactNode
};

function CusSelect(props: CusSelectProps) {
  return (
    <StyledCusSelect {...props}>
    
    </StyledCusSelect>
  )
};

export default CusSelect;

const StyledCusSelect = styled(Select)`

`;
