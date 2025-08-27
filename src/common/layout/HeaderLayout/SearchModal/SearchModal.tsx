import styled from "styled-components";
import useSearchModal from "./useSearchModal";
import CusInput from "../../../elements/textField/CusInput";
import SearchDocList from "./SearchDocList";
import {SearchIcon, XIcon} from "lucide-react";
import {motion} from "framer-motion";

export interface SearchModalProps {
  onClose: () => void;
}

function SearchModal(props: SearchModalProps) {
  const {
    searchValue,
    docs,
    handleSearching,
    inputRef,
  } = useSearchModal(props);
  
  return (
    <StyledSearchModal
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="header">
        <div className="search-container">
          <CusInput
            ref={inputRef}
            value={searchValue}
            onChange={handleSearching}
            placeholder="Search documents..."
            startElement={<SearchIcon color="gray" size={20} />}
          />
          <button className="close-btn" onClick={props.onClose}>
            <XIcon size={24} />
          </button>
        </div>
      </div>
      <div className="body">
        {docs?.length ? (
          <SearchDocList
            documents={docs}
            onClose={props.onClose}
          />
        ) : (
          <div className="no-results">
            {searchValue ? "No documents found" : "Start typing to search"}
          </div>
        )}
      </div>
    </StyledSearchModal>
  )
}

export default SearchModal;

const StyledSearchModal = styled(motion.div)`
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    max-width: 600px;
    width: 100%;
    min-width: 20rem;
    max-height: 80vh;
    margin: auto;
    overflow: hidden;
    z-index: 20001;

    .header {
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;

        > div {
            flex-grow: 1;
        }
    }

    .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        color: #718096;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.2s ease, color 0.2s ease;

        &:hover {
            background-color: #f7fafc;
            color: #2d3748;
        }
    }

    .body {
        flex-grow: 1;
        overflow-y: auto;
        position: relative;
    }

    .no-results {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25rem;
        min-width: 20rem;
        color: #a0aec0;
        font-style: italic;
        text-align: center;
    }

    @media (max-width: 768px) {
        max-width: 95%;
        margin: auto;
    }
`;