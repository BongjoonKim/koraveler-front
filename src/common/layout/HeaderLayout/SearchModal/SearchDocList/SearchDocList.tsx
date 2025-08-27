import styled from "styled-components";
import {S3URLInDocument} from "../../../../../constants/RegexConstants";
import useSearchDocList from "./useSearchDocList";
import {replacingHtmlInText} from "../../../../../utils/commonUtils";

export interface SearchDocListProps {
  documents ?: DocumentDTO[];
  onClose : () => void;
};

function SearchDocList(props: SearchDocListProps) {
  const {
    handleMove
  } = useSearchDocList(props);
  return (
    <StyledSearchDocList>
      {props?.documents && props.documents.map((doc : DocumentDTO) => {
        return (
          <div className={"doc"} onClick={() => handleMove(doc.id)}>
            <div className="title">
              {doc.title}
            </div>
            <div className="desc">
              {replacingHtmlInText(doc.contents)}
            </div>
          </div>
        )
      })}
    </StyledSearchDocList>
  )
};

export default SearchDocList;

const StyledSearchDocList = styled.div`
    max-height: 70vh;
    overflow: auto;
    cursor: pointer;
    height: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);

    .doc {
        height: 12rem;
        border-bottom: 1px solid #e2e8f0;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background: #ffffff;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: #f7fafc;
        }

        &:first-child {
            border-top: 1px solid #e2e8f0;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        &:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }

    .title {
        font-weight: bold;
        font-size: 1.125rem;
        color: #2d3748;
    }

    .desc {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5;
        color: #4a5568;
        font-size: 0.875rem;
    }
`;

const StyledSearchModal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);

  .top {
    margin-bottom: 1rem;
  }

  .body {
    max-height: 70vh;
    overflow: auto;
  }
`;