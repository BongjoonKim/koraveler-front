import styled from "styled-components";
import {Button} from "@chakra-ui/react";
import CusButton from "../../elements/buttons/CusButton";

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
        <CusButton
          colorScheme={"teal"}
          onClick={props.onCreate}
        >
          Create
        </CusButton>
      )}
      {props.onEdit && (
        <CusButton
          colorScheme={"teal"}
          onClick={props.onEdit}
        >
          Edit
        </CusButton>
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