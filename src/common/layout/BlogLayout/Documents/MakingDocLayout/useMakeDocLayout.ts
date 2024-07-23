import {MakeDocLayoutProps} from "./MakeDocLayout";
import {useState} from "react";

function useMakeDocLayout(props : MakeDocLayoutProps) {
  const [document, setDocument] = useState<DocumentDTO | any>();
  
  return {
    document,
    setDocument
  }
}

export default useMakeDocLayout;