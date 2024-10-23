import styled from "styled-components";

export interface SearchDocListProps {
  documents ?: DocumentDTO[];
};

function SearchDocList(props: SearchDocListProps) {
  
  return (
    <StyledSearchDocList>
        {props?.documents && props.documents.map((doc : DocumentDTO) => {
            return (
              <div className={"doc"}>
                  <div className="title">
                      {doc.title}
                  </div>
                  <div className="desc">
                      {doc.contents}
                  </div>
              </div>
            )
        })}
    </StyledSearchDocList>
  )
};

export default SearchDocList;

const StyledSearchDocList = styled.div`

`;
