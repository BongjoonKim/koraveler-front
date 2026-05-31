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
            startElement={<SearchIcon color="#94a3a0" size={20} />}
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
    background: #14191a;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.25rem;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.55);
    width: 100%;
    min-height: 32rem;
    max-height: 90vh;
    z-index: 20001;
    padding: 1rem;
    box-sizing: border-box;
    color: #e8eaeb;

    .header {
        padding: 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        width: 100%;
        box-sizing: border-box;
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
        width: 100%;
        box-sizing: border-box;

        /* Chakra Input Group 다크 톤 오버라이드 */
        .chakra-group {
            flex: 1;
            min-width: 0;
            width: 100%;

            input {
                width: 100%;
                box-sizing: border-box;
                background: #0f1414 !important;
                color: #ffffff !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                border-radius: 10px !important;
                transition: border-color 0.18s ease, box-shadow 0.18s ease;

                &::placeholder {
                    color: rgba(255, 255, 255, 0.3) !important;
                }

                &:focus,
                &:focus-visible {
                    border-color: rgba(80, 107, 92, 0.55) !important;
                    box-shadow: 0 0 0 3px rgba(46, 87, 62, 0.18) !important;
                    outline: none !important;
                }
            }
        }

        > div:first-child {
            flex: 1;
            min-width: 0;
            overflow: hidden;
        }
    }

    .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: 1px solid transparent;
        color: #c7d2cc;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        flex-shrink: 0;

        &:hover {
            background-color: rgba(46, 87, 62, 0.18);
            border-color: rgba(80, 107, 92, 0.45);
            color: #ffffff;
        }
    }

    .body {
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden;
        position: relative;
        width: 100%;
        box-sizing: border-box;
    }

    .no-results {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25rem;
        color: #94a3a0;
        font-style: italic;
        text-align: center;
        padding: 1rem;
        width: 100%;
        box-sizing: border-box;
        word-break: break-word;
    }

    /* 모든 자식 요소에 box-sizing 적용 */
    * {
        box-sizing: border-box;
    }

    @media (max-width: 660px) {
        padding: 0.5rem;
        max-width: 100%;

        .header {
            padding: 0.75rem;
        }

        .no-results {
            height: 100%;
        }
    }
`;