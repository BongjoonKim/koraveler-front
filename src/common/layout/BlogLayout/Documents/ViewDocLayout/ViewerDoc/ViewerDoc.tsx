// src/common/components/ViewerDoc/ViewerDoc.tsx

import styled from "styled-components";
import TiptapViewer from "../../../../../elements/CusEditor/TipTapViewer";

export interface ViewerDocProps {
  contents?: string;
}

function ViewerDoc(props: ViewerDocProps) {
  return (
    <StyledViewerDoc>
      {props.contents ? (
        <TiptapViewer contents={props.contents} />
      ) : (
        <EmptyContent>내용이 없습니다.</EmptyContent>
      )}
    </StyledViewerDoc>
  );
}

export default ViewerDoc;

const StyledViewerDoc = styled.div`
    width: 100%;
    min-height: 200px;
    padding: 1rem;
`;

const EmptyContent = styled.div`
  color: #999;
  text-align: center;
  padding: 2rem;
`;