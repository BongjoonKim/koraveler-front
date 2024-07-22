import {CreateDocumentProps} from "./CreateDocument";
import {useRef} from "react";

function useCreateDocument(props : CreateDocumentProps) {
  const createRef = useRef(null);
  
  return {
    createRef
  }
}

export default useCreateDocument;