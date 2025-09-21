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
    //box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    width: 100%;
    height: 30rem;
    //overflow: hidden;
    z-index: 20001;
    padding: 1rem;
    box-sizing: border-box;

    .header {
        padding: 1rem;
        border-bottom: 1px solid #f0f0f0;
        width: 100%; /* 너비 제한 */
        box-sizing: border-box; /* 패딩 포함 */
    }

    .search-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
        width: 100%; /* 너비 제한 */
        box-sizing: border-box;

        /* Chakra Input Group 스타일 오버라이드 */
        .chakra-group {
            flex: 1;
            min-width: 0; /* flex item이 줄어들 수 있도록 */
            width: 100%;

            input {
                width: 100%;
                box-sizing: border-box;
            }
        }

        > div:first-child { /* CusInput wrapper */
            flex: 1;
            min-width: 0;
            overflow: hidden; /* 넘치는 내용 숨김 */
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
        flex-shrink: 0;

        &:hover {
            background-color: #f7fafc;
            color: #2d3748;
        }
    }

    .body {
        flex-grow: 1;
        overflow-y: auto;
        overflow-x: hidden; /* 가로 스크롤 방지 */
        position: relative;
        width: 100%; /* 너비 제한 */
        box-sizing: border-box;
    }

    .no-results {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 25rem;
        color: #a0aec0;
        font-style: italic;
        text-align: center;
        padding: 1rem;
        width: 100%; /* 너비 제한 */
        box-sizing: border-box;
        word-break: break-word; /* 긴 텍스트 줄바꿈 */
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