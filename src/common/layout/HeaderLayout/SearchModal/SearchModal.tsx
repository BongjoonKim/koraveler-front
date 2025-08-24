import styled from "styled-components";
import useSearchModal from "./useSearchModal";
import CusInput, {CusInputGroup} from "../../../elements/textField/CusInput";
import SearchDocList from "./SearchDocList";
import {SearchIcon} from "lucide-react";

export interface SearchModalProps {
  onClose : () => void;
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
        <SearchDocList documents={docs} onClose={props.onClose}/>
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
