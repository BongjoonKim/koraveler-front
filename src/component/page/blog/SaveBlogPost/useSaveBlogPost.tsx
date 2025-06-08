import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAtom} from "jotai/index";
import {uploadedInfo} from "../../../../stores/jotai/jotai";
import {useNavigate, useParams} from "react-router-dom";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";
import {getDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import useAuthEP from "../../../../utils/useAuthEP";

export interface useSaveBlogPostProps {

};

function useSaveBlogPost(props : useSaveBlogPostProps) {
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<any>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const {id} = useParams();
  const navigate = useNavigate();
  const authEP = useAuthEP();
  
  // 글 저장
  const handleEdit = useCallback(async (saveOrDraft: string) => {
    if (editorRef?.current){
      // TinyMCE에서는 인스턴스에 직접 접근
      const editorInstance = editorRef.current;
      
      // TinyMCE는 HTML 콘텐츠를 직접 가져올 수 있음
      const contents = editorInstance.getContent();
      
      // 정규 표현식을 사용하여 이미지 URL 패턴 찾기
      const regex = S3URLFindRegex;
      let settingThumbnailUrl : string = "";
      
      const match = contents.match(regex);
      
      if (match && match[0]) {
        // 찾은 URL
        const originalUrl = match[0];
        console.log("원본 URL:", originalUrl);
        
        // haries-img를 haries-thumbnail로 변경
        settingThumbnailUrl = originalUrl.replace('haries-img', 'haries-thumbnail');
        console.log("변경된 URL:", settingThumbnailUrl);
        
        // 첫 번째 URL만 변경하여 반환
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
        thumbnailImgUrl: settingThumbnailUrl, // 썸네일 URL이 없는 경우를 대비한 기본값 추가
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
    getDocumentData();
  }, [id])
  
  return {
    editorRef,
    document,
    setDocument,
    handleEdit
  }
}

export default useSaveBlogPost;