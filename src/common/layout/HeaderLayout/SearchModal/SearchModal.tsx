import styled from "styled-components";
import useSearchModal from "./useSearchModal";
import CusInput, {CusInputGroup} from "../../../elements/textField/CusInput";
import {SearchIcon} from "@chakra-ui/icons";
import {InputGroup, InputLeftElement} from "@chakra-ui/react";

export interface SearchModalProps {

};

function SearchModal(props: SearchModalProps) {
  const {
    searchValue
  } = useSearchModal(props);
  return (
    <StyledSearchModal>
      <CusInputGroup
        // value={searchValue}
        placeholder={"Search"}
        inputLeftElement={
          // <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          // </InputLeftElement>
        }
      >
      </CusInputGroup>
    </StyledSearchModal>
  )
};

export default SearchModal;

const StyledSearchModal = styled.div`
  z-index: 20001;
`;
