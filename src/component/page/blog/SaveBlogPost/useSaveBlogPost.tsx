import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAtom} from "jotai/index";
import {openBlogPostingModalAtom, uploadedInfo} from "../../../../stores/jotai/jotai";
import {useNavigate, useParams} from "react-router-dom";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";
import {getDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import useAuthEP from "../../../../utils/useAuthEP";
import { Editor } from "@tiptap/react";

export interface useSaveBlogPostProps {

};

function useSaveBlogPost(props : useSaveBlogPostProps) {
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<Editor | null>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const {id} = useParams();
  const navigate = useNavigate();
  const authEP = useAuthEP();
  const [openBlogPostingModal, setOpenBlogPostingModal] = useAtom<boolean>(openBlogPostingModalAtom)
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<any>({});
  const [disclose, setDisclose] = useState<boolean>(true);
  
  // 글 저장 - Tiptap 버전
  const handleEdit = useCallback(async (saveOrDraft: string) => {
    if (editorRef?.current){
      // Tiptap 에디터 인스턴스
      const editorInstance = editorRef.current;
      
      // Tiptap에서 HTML 콘텐츠 가져오기
      const contents = editorInstance.getHTML();
      
      // 정규 표현식을 사용하여 이미지 URL 패턴 찾기
      const regex = S3URLFindRegex;
      let settingThumbnailUrl : string = "";
      
      const match = contents.match(regex);
      
      if (match && match[0]) {
        // 찾은 URL
        const originalUrl = match[0];
        console.log("원본 URL:", originalUrl);
        
        // haries-img를 haries-thumbnail로 변경 (필요한 경우)
        settingThumbnailUrl = originalUrl.replace('haries-img', 'haries-thumbnail');
        console.log("변경된 URL:", settingThumbnailUrl);
      }
      
      let isDraft: boolean = false;
      if (saveOrDraft === BLOG_SAVE_TYPE.SAVE) {
        isDraft = false;
      } else if (saveOrDraft === BLOG_SAVE_TYPE.DRAFT) {
        isDraft = true;
      }
      
      const request: DocumentDTO = {
        ...document,
        contents: contents,
        thumbnailImgUrl: settingThumbnailUrl || "", // 썸네일 URL이 없는 경우를 대비한 기본값 추가
        draft: isDraft,
        disclose : disclose,
        folderId : selectedFolder
      }
      
      try {
        const saveRes = await authEP({
          func: saveDocument,
          reqBody: request
        })
        
        if (saveRes.status === 200) {
          navigate(`/blog/view/${id}`)
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
  }, [document, uploadedList, navigate, setErrMsg, selectedFolder, disclose, id, authEP]);
  
  const handleSaveModalOpen = () => {
    setOpenBlogPostingModal(true);
  }
  
  const getDocumentData = useCallback(async () => {
    if (!id) return;
    
    try {
      const res = await getDocument({
        params : {
          id : id
        }
      });
      
      if (res.data) {
        setDocument(res.data)
        setSelectedFolder(res.data.folderId);
        setDisclose(res.data.disclose ?? true);
      }
    } catch (e) {
      console.error("문서 불러오기 실패:", e);
      setErrMsg({
        status: "error",
        msg: "문서를 불러오는데 실패했습니다.",
      })
    }
  }, [id, setErrMsg]);
  
  const modalClose = () => {
    setOpenBlogPostingModal(prev => !prev)
  }
  
  const goBack = () => {
    navigate("/blog/home")
  }
  
  useEffect(() => {
    getDocumentData();
  }, [id])
  
  return {
    editorRef,
    document,
    setDocument,
    handleEdit,
    modalClose,
    openBlogPostingModal,
    handleSaveModalOpen,
    folders,
    setFolders,
    selectedFolder,
    setSelectedFolder,
    disclose,
    setDisclose,
    goBack,
  }
}

export default useSaveBlogPost;