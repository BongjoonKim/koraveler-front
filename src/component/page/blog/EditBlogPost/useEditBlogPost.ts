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
import { Editor } from "@tiptap/react";

export default function useEditBlogPost(props : EditBlogPostProps) {
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<Editor | null>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const {id} = useParams();
  const navigate = useNavigate();
  const authEP = useAuthEP();
  
  // 컴포넌트 외부 또는 내부에 추가
  const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.quicktime'];
  
  const generateThumbnailUrl = (originalUrl: string): string => {
    // 버킷 변경: haries-img -> haries-thumbnail
    let thumbnailUrl = originalUrl.replace('haries-img', 'haries-thumbnail');
    
    // 영상 파일인 경우 확장자를 .jpg로 변경
    const lowerUrl = thumbnailUrl.toLowerCase();
    for (const ext of VIDEO_EXTENSIONS) {
      if (lowerUrl.endsWith(ext)) {
        const extIndex = thumbnailUrl.toLowerCase().lastIndexOf(ext);
        thumbnailUrl = thumbnailUrl.substring(0, extIndex) + '.jpg';
        break;
      }
    }
    
    return thumbnailUrl;
  };
  
  // 글 편집 저장 - Tiptap 버전
  const handleEdit = useCallback(async (saveOrDraft: string) => {
    if (editorRef?.current){
      // Tiptap 에디터 인스턴스
      const editorInstance = editorRef.current;
      
      // Tiptap에서 HTML 콘텐츠 가져오기
      const contents = editorInstance.getHTML();
      
      // 이미지 URL 추출 - Tiptap도 <img src="..."> 형식 사용
      const imgRegex = new RegExp(`<img[^>]+src="([^"]+)"[^>]*>`, 'gi');
      let matches;
      const imageUrls = [];
      
      while ((matches = imgRegex.exec(contents)) !== null) {
        imageUrls.push(matches[1]);
      }
      
      // S3 URL만 필터링 (S3URLFindRegex 사용)
      const s3ImageUrls = imageUrls.filter(url => {
        return S3URLFindRegex.test(url);
      });
      
      let isDraft: boolean = false;
      if (saveOrDraft === BLOG_SAVE_TYPE.SAVE) {
        isDraft = false;
      } else if (saveOrDraft === BLOG_SAVE_TYPE.DRAFT) {
        isDraft = true;
      }

      // 수정된 코드:
      let thumbnailUrl = "";
      if (s3ImageUrls.length > 0) {
        thumbnailUrl = generateThumbnailUrl(s3ImageUrls[0]);
      }
      
      const request: DocumentDTO = {
        ...document,
        contents: contents,
        thumbnailImgUrl: thumbnailUrl || document?.thumbnailImgUrl || "", // 기존 썸네일 유지 옵션
        draft: isDraft,
      }
      
      try {
        const saveRes = await authEP({
          func: saveDocument,
          reqBody: request
        })
        
        if (saveRes.status === 200) {
          navigate(`/blog/view/ko/${id}`)
        } else {
          throw new Error("저장 실패");
        }
      } catch (e) {
        console.error("저장 에러:", e);
        setErrMsg({
          status: "error",
          msg: "저장에 실패했습니다.",
        })
      }
    } else {
      setErrMsg({
        status: "error",
        msg: "에디터가 초기화되지 않았습니다.",
      })
    }
  }, [document, uploadedList, navigate, setErrMsg, id, authEP]);
  
  // 문서 데이터 가져오기
  const getDocumentData = useCallback(async () => {
    if (!id) return;
    
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
      console.error("문서 불러오기 실패:", e);
      setErrMsg({
        status: "error",
        msg: "문서를 불러오는데 실패했습니다.",
      })
    }
  }, [id, setErrMsg]);
  
  // 편집할 때 유용한 추가 메서드들
  const clearContent = useCallback(() => {
    if (editorRef?.current) {
      editorRef.current.chain().focus().clearContent().run();
    }
  }, []);
  
  const insertText = useCallback((text: string) => {
    if (editorRef?.current) {
      editorRef.current.chain().focus().insertContent(text).run();
    }
  }, []);
  
  const getWordCount = useCallback(() => {
    if (editorRef?.current) {
      const text = editorRef.current.getText();
      return text.split(/\s+/).filter(word => word.length > 0).length;
    }
    return 0;
  }, []);
  
  const isEditorEmpty = useCallback(() => {
    if (editorRef?.current) {
      return editorRef.current.isEmpty;
    }
    return true;
  }, []);
  
  useEffect(() => {
    getDocumentData();
  }, [id])
  
  return {
    editorRef,
    document,
    setDocument,
    handleEdit,
    // 추가 유틸리티 메서드
    clearContent,
    insertText,
    getWordCount,
    isEditorEmpty,
  }
}