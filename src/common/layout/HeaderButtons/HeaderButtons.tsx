import styled from "styled-components";
import {Button} from "@chakra-ui/react";
import CusChakraButton from "../../elements/buttons/CusChakraButton";

export interface HeaderButtonsProps {
  onCreate?: () => void;
  onSave?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

function HeaderButtons(props : HeaderButtonsProps) {
  return (
    <StyledHeaderbuttons>
      {props.onCreate && (
        <CusChakraButton
          colorScheme={"teal"}
          onClick={props.onCreate}
        >
          Create
        </CusChakraButton>
      )}
      {props.onEdit && (
        <CusChakraButton
          colorScheme={"teal"}
          onClick={props.onEdit}
        >
          Edit
        </CusChakraButton>
      )}
    </StyledHeaderbuttons>
  )
}

export default HeaderButtons;

const StyledHeaderbuttons = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0.5rem 0.5rem;
  gap: 1rem;
`;