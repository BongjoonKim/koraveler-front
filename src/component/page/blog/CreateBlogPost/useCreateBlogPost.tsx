import {MutableRefObject, useCallback, useRef, useState} from "react";
import {CreateBlogPostProps} from "./CreateBlogPost";
import {Editor} from "@toast-ui/react-editor";
import {createAfterSaveDocument, createDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import {useAuth} from "../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../utils/endpointUtils";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useAtom} from "jotai/index";
import {uploadedInfo} from "../../../../stores/jotai/jotai";
import {s3Utils} from "../../../../utils/awsS3Utils";
import {cloneDeep} from "lodash";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";
import {useNavigate} from "react-router-dom";

function useCreateBlogPost(props : CreateBlogPostProps) {
  const {accessToken, setAccessToken} = useAuth();
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<any>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const navigate = useNavigate();
  
  // 글 생성
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
      
      console.log("request 보기", request)
      
      try {
        // 글 생성하기
        const res = await endpointUtils.authAxios({
          func : createDocument,
          accessToken : accessToken,
          setAccessToken : setAccessToken,
          reqBody :request
        });
        console.log("글생성", res)
  
  
        // 이미지가 있다면 이미지의 주소를 new에서 "글 아이디" 폴더로 이동
        if (uploadedList.length, res.data.id) {
          for (const uploaded of uploadedList) {
            if (uploaded?.blob?.name) {
              const copy = await s3Utils.copyFile({fileKey: uploaded.key, newFileKey: uploaded.key.replace("new/", `${res.data.id}/`)});
              const deletes = await s3Utils.deleteFile({fileKey : uploaded.key});
              console.log("doc copy", copy);
              console.log("doc deletes", deletes)
  
  
            }
          }
          const newDocument : DocumentDTO = cloneDeep(res?.data);
          const newContents = newDocument.contents!.replaceAll(
            `${process.env["REACT_APP_AWS_S3_URI"]}/new/`,
            `${process.env["REACT_APP_AWS_S3_URI"]}/${res.data.id}/`
          );
          
          // 정규 표현식을 사용하여 ![string](https://haries-img.s3.ap-northeast-2.amazonaws.com/ 문자열 ) 패턴을 찾습니다.
          const regex = S3URLFindRegex;
          let matches;
          const values = [];
  
          // 정규 표현식을 사용하여 일치하는 모든 패턴을 찾습니다.
          while ((matches = regex.exec(newContents)) !== null) {
            values.push(matches[1]);
          }
          
          newDocument.contents = newContents;
          newDocument.thumbnailImgUrl = values[0];
  
  
          const saveRes = await endpointUtils.authAxios({
            func : createAfterSaveDocument,
            accessToken: accessToken,
            setAccessToken: setAccessToken,
            reqBody : newDocument
          });
          if (saveRes.status === 200) {
            navigate(`/blog/view/${saveRes.data.id}`)
          } else {
            throw saveRes.statusText;
          }
          console.log("글 재저장", saveRes)
        }
        
        // 글도 변경 후 저장
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "retrieve failed",
        })
      }
    }
  }, [document, uploadedList]);
  
  
  return {
    editorRef,
    document,
    setDocument,
    handleCreate
  }
}

export default useCreateBlogPost;