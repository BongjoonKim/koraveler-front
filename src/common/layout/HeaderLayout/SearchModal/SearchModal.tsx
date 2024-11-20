import styled from "styled-components";
import useSearchModal from "./useSearchModal";
import CusInput, {CusInputGroup} from "../../../elements/textField/CusInput";
import {SearchIcon} from "@chakra-ui/icons";
import {InputGroup, InputLeftElement} from "@chakra-ui/react";
import SearchDocList from "./SearchDocList";

export interface SearchModalProps {

};

function SearchModal(props: SearchModalProps) {
  const {
    searchValue,
    docs,
    handleSearching,
  } = useSearchModal(props);
  return (
    <StyledSearchModal>
      <div className="top">
        <CusInputGroup
          // value={searchValue}
          onChange={handleSearching}
          placeholder={"Search"}
          inputLeftElement={
            // <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
            // </InputLeftElement>
          }
        >
        </CusInputGroup>
      </div>
      <div className="body">
        <SearchDocList documents={docs}/>
      </div>
    </StyledSearchModal>
  )
};

export default SearchModal;

const StyledSearchModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 20001;
`;
