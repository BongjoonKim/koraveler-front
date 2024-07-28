import {MutableRefObject, useCallback, useRef, useState} from "react";
import {CreateBlogPostProps} from "./CreateBlogPost";
import {Editor} from "@toast-ui/react-editor";
import {createDocument} from "../../../../endpoints/blog-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../utils/endpointUtils";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";

function useCreateBlogPost(props : CreateBlogPostProps) {
  const {accessToken, setAccessToken} = useAuth();
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<any>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  
  const handleCreate = useCallback(async () => {
    console.log("handleCreate", editorRef.current.getInstance())
    if (editorRef?.current?.getInstance()) {
      const editorInfo = editorRef?.current.getInstance();
      let contents : string = "";
      if (editorInfo.mode === "markdown") {
        contents = editorInfo.getMarkdown();
      } else if (editorInfo?.mode === "wysiwyg") {
        contents = editorInfo.getHTML();
      }
      const request : DocumentDTO = {
        ...document,
        contents : contents
      }
      
      try {
        const res = await endpointUtils.authAxios({
          func : createDocument,
          accessToken : accessToken,
          setAccessToken : setAccessToken,
        });
        console.log("글 생성", res);
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "retrieve failed",
        })
      }
    }
  }, [document]);
  
  
  return {
    editorRef,
    document,
    setDocument,
    handleCreate
  }
}

export default useCreateBlogPost;