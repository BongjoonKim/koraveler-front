import {CreateDocumentProps} from "./CreateEditor";
import {useAtomValue} from "jotai/index";
import {uploadedInfo} from "../../../../../../stores/jotai/jotai";
import {useAtom} from "jotai";
import {useCallback} from "react";

export default function useCreateEditor(props : CreateDocumentProps) {
  const [uploadedList, setUploadedList] = useAtom(uploadedInfo);
  
  const onUploadImg = useCallback(async (blob: Blob, callback: HookCallback) => {
  
  }, [uploadedList]);
  
}