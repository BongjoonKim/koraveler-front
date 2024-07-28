import styled from "styled-components";
import CusEditor from "../../../../../elements/CusEditor/CusEditor";
import useCreateDocument from "./useCreateDocument";
import {forwardRef} from "react";

export interface CreateDocumentProps {

};

function CreateDocument(props: CreateDocumentProps, ref : any) {
  console.log("CreateDocument", ref.current)
  const {} = useCreateDocument(props)
  return (
    <StyledCreateDocument>
      <CusEditor
        ref={ref}
      />
    </StyledCreateDocument>
  )
};

export default forwardRef(CreateDocument);

const StyledCreateDocument = styled.div`

`;
