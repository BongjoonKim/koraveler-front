import styled from "styled-components";
import CusEditor from "../../../../elements/CusEditor/CusEditor";
import useCreateDocument from "./useCreateDocument";

export interface CreateDocumentProps {

};

function CreateDocument(props: CreateDocumentProps) {
  const {createRef} = useCreateDocument(props)
  return (
    <StyledCreateDocument>
      <CusEditor
        
        />
    
    </StyledCreateDocument>
  )
};

export default CreateDocument;

const StyledCreateDocument = styled.div`

`;
