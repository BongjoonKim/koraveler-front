import styled from "styled-components";
import {S3URLInDocument} from "../../../../../constants/RegexConstants";
import useSearchDocList from "./useSearchDocList";

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
                      {doc.contents?.replace(S3URLInDocument, '')}
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
  .doc {
    height: 12rem;
    border-bottom: 1px solid white;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background: beige;
    &:first-child {
      border-top: 1px solid white;
    }
  }
  .title {
    font-weight: bold;
    font-size: larger;
  }
  .desc {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    //text-overflow: ellipsis;
    //overflow-wrap: break-word;
    text-overflow: ellipsis; /* Optional: Adds ellipsis at the end */

    line-height: 1.5;
  }
`;
