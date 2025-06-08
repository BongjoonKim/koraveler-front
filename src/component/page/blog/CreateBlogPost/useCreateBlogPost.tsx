import {MutableRefObject, useCallback, useRef, useState} from "react";
import {CreateBlogPostProps} from "./CreateBlogPost";
import {Editor} from "@toast-ui/react-editor";
import {createAfterSaveDocument, createDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useAtom} from "jotai/index";
import {uploadedInfo} from "../../../../stores/jotai/jotai";
import {s3Utils} from "../../../../utils/awsS3Utils";
import {cloneDeep} from "lodash";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";
import {useNavigate, useParams} from "react-router-dom";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";
import useAuthEP from "../../../../utils/useAuthEP";

function useCreateBlogPost(props : CreateBlogPostProps) {
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<any>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const navigate = useNavigate();
  const {id} = useParams();
  const authEP = useAuthEP();
  
  // 글 생성
  const handleCreate = useCallback(async (saveOrDraft: string) => {
    console.log("handleCreate", editorRef.current);
    if (editorRef?.current) {
      // TinyMCE에서는 인스턴스에 직접 접근
      const editorInstance = editorRef.current;
      
      // TinyMCE는 HTML 콘텐츠를 직접 가져올 수 있음
      const contents = editorInstance.getContent();
      
      let isDraft: boolean = false;
      if (saveOrDraft === BLOG_SAVE_TYPE.SAVE) {
        isDraft = false;
      } else if (saveOrDraft === BLOG_SAVE_TYPE.DRAFT) {
        isDraft = true;
      }
      
      const request: DocumentDTO = {
        ...document,
        contents: contents,
        draft: isDraft
      }
      
      try {
        // 글 생성하기
        const res = await authEP({
          func: createDocument,
          reqBody: request
          
        })
        
        // 이미지가 있다면 이미지의 주소를 new에서 "글 아이디" 폴더로 이동
        if (uploadedList.length && res.data.id) {
          for (const uploaded of uploadedList) {
            if (uploaded?.blob) {
              const copy = await s3Utils.copyFile({
                fileKey: uploaded.key,
                newFileKey: uploaded.key.replace("new/", `${res.data.id}/`)
              });
              const deletes = await s3Utils.deleteFile({fileKey: uploaded.key});
              console.log("doc copy", copy);
              console.log("doc deletes", deletes);
            }
          }
          
          const newDocument: DocumentDTO = cloneDeep(res?.data);
          const newContents = newDocument.contents!.replaceAll(
            `${process.env["REACT_APP_AWS_S3_URI"]}/new/`,
            `${process.env["REACT_APP_AWS_S3_URI"]}/${res.data.id}/`
          );
          
          // 정규 표현식을 사용하여 이미지 URL 패턴을 찾습니다.
          // TinyMCE는 이미지를 <img src="..."> 형태로 저장하므로 정규식 패턴 수정
          const imgRegex = new RegExp(`<img[^>]+src="(${process.env["REACT_APP_AWS_S3_URI"]}[^"]+)"[^>]*>`, 'gi');
          let matches;
          const values = [];
          
          // 정규 표현식을 사용하여 일치하는 모든 패턴을 찾습니다.
          while ((matches = imgRegex.exec(newContents)) !== null) {
            values.push(matches[1]);
          }
          
          newDocument.contents = newContents;
          // 첫 번째 이미지를 썸네일로 사용
          if (values.length > 0) {
            newDocument.thumbnailImgUrl = values[0];
          }
          const saveRes = await authEP({
            func: createAfterSaveDocument,
            reqBody: newDocument
            
          })
        }
        if (res.status === 200) {
          navigate(`/blog/view/${res.data.id}`);
        } else {
          throw res.statusText;
        }
        console.log("글 재저장", res);
        // 글도 변경 후 저장
      } catch (e) {
        setErrorMsg({
          status: "error",
          msg: "저장에 실패했습니다.",
        });
      }
    }
  }, [document, uploadedList, navigate, setErrorMsg]);
  
  
  return {
    editorRef,
    document,
    setDocument,
    handleCreate
  }
}

export default useCreateBlogPost;