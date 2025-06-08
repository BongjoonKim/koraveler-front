import {EditBlogPostProps} from "./EditBlogPost";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAtom} from "jotai/index";
import {uploadedInfo} from "../../../../stores/jotai/jotai";
import {useNavigate, useParams} from "react-router-dom";
import {getDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";
import useAuthEP from "../../../../utils/useAuthEP";

export default function useEditBlogPost(props : EditBlogPostProps) {
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<any>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const {id} = useParams();
  const navigate = useNavigate();
  const authEP = useAuthEP()
  
  const handleEdit = useCallback(async (saveOrDraft: string) => {
    if (editorRef?.current){
      // TinyMCE에서는 인스턴스에 직접 접근
      const editorInstance = editorRef.current;
      
      // TinyMCE는 HTML 콘텐츠를 직접 가져올 수 있음
      const contents = editorInstance.getContent();
      
      // 정규 표현식을 사용하여 이미지 URL 패턴 찾기
      const regex = S3URLFindRegex;
      let matches;
      const values = [];
      
      while ((matches = regex!.exec(contents)) !== null) {
        values.push(matches[1]);
      }
      
      let isDraft: boolean = false;
      if (saveOrDraft === BLOG_SAVE_TYPE.SAVE) {
        isDraft = false;
      } else if (saveOrDraft == BLOG_SAVE_TYPE.DRAFT) {
        isDraft = true;
      }
      
      const request: DocumentDTO = {
        ...document,
        contents: contents,
        thumbnailImgUrl: values[0] || "", // 썸네일 URL이 없는 경우를 대비한 기본값 추가
        draft: isDraft,
      }
      
      try {
        const saveRes = await authEP({
          func: saveDocument,
          reqBody: request
        })
        navigate(`/blog/view/${id}`)
      } catch (e) {
        setErrMsg({
          status: "error",
          msg: "save failed",
        })
      }
    }
  }, [document, uploadedList, navigate, setErrMsg]);
  
  const getDocumentData = useCallback(async () => {
    try {
      const res = await getDocument({
        params : {
          id : id
        }
      });
      console.log("글 정보", res);
      if (res.data) {
        setDocument(res.data)
      }
    } catch (e) {
      setErrMsg({
        status: "error",
        msg: "retrieve failed",
      })
    }
  }, [document, id]);
  
  useEffect(() => {
    console.log("여기 오나")
    getDocumentData();
  }, [id])
  
  return {
    editorRef,
    document,
    setDocument,
    handleEdit
  }
}