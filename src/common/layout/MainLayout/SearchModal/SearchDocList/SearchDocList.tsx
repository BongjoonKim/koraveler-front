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
    background: transparent;
    border-radius: 8px;

    .doc {
        height: 12rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background: transparent;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: rgba(46, 87, 62, 0.12);
        }

        &:first-child {
            border-top: 1px solid rgba(255, 255, 255, 0.06);
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
        color: #ffffff;
    }

    .desc {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.5;
        color: #a8b0ac;
        font-size: 0.875rem;
    }
`;