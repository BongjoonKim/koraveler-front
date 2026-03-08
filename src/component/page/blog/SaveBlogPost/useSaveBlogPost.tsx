import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useCallback, useEffect, useRef, useState, useMemo} from "react";
import {useAtom} from "jotai/index";
import {openBlogPostingModalAtom, uploadedInfo} from "../../../../stores/jotai/jotai";
import {useNavigate, useParams} from "react-router-dom";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";
import {getDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import useAuthEP from "../../../../utils/useAuthEP";
import { Editor } from "@tiptap/react";
import {LocaleCode, SUPPORTED_LOCALES} from "../../../../types/i18n/i18nTypes";
import {getTranslationDetail, updateTranslation} from "../../../../endpoints/i18n-endpoints";

export interface useSaveBlogPostProps {

};

function useSaveBlogPost(props : useSaveBlogPostProps) {
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<Editor | null>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const {id, locale: localeParam} = useParams<{id: string; locale?: string}>();
  const navigate = useNavigate();
  const authEP = useAuthEP();
  const [openBlogPostingModal, setOpenBlogPostingModal] = useAtom<boolean>(openBlogPostingModalAtom)
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>(undefined);
  const [folders, setFolders] = useState<any>({});
  const [disclose, setDisclose] = useState<boolean>(true);

  // 번역 편집 여부 판별
  const locale = localeParam && SUPPORTED_LOCALES.includes(localeParam as LocaleCode) ? localeParam as LocaleCode : null;
  const isTranslationEdit = useMemo(() => {
    return !!locale && locale !== 'ko';
  }, [locale]);
  
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
  
  // 글 저장 - Tiptap 버전
  const handleEdit = useCallback(async (saveOrDraft: string) => {
    if (editorRef?.current){
      // Tiptap 에디터 인스턴스
      const editorInstance = editorRef.current;

      // Tiptap에서 HTML 콘텐츠 가져오기
      const contents = editorInstance.getHTML();

      // 번역 편집인 경우: 번역 API로 저장
      if (isTranslationEdit && locale) {
        try {
          const saveRes = await authEP({
            func: updateTranslation,
            params: { postId: id, locale },
            reqBody: {
              title: document?.title || '',
              content: contents,
            }
          });

          if (saveRes.status === 200) {
            navigate(`/blog/view/${locale}/${id}`);
          } else {
            throw new Error("저장 실패");
          }
        } catch (e) {
          console.error("번역 저장 에러:", e);
          setErrMsg({
            status: "error",
            msg: "번역 저장에 실패했습니다.",
          });
        }
        return;
      }

      // 원본 편집인 경우: 기존 로직
      const regex = S3URLFindRegex;
      let settingThumbnailUrl : string = "";

      const match = contents.match(regex);

      if (match && match[0]) {
        const originalUrl = match[0];
        settingThumbnailUrl = generateThumbnailUrl(originalUrl);
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
        thumbnailImgUrl: settingThumbnailUrl || "",
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
          navigate(`/blog/view/${locale || 'ko'}/${id}`)
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
  }, [document, uploadedList, navigate, setErrMsg, selectedFolder, disclose, id, authEP, isTranslationEdit, locale]);
  
  const handleSaveModalOpen = () => {
    setOpenBlogPostingModal(true);
  }
  
  const getDocumentData = useCallback(async () => {
    if (!id) return;

    try {
      // 번역 편집인 경우: 번역 데이터 로드
      if (isTranslationEdit && locale) {
        const res = await authEP({
          func: getTranslationDetail,
          params: { postId: id, locale },
        });
        if (res.data) {
          // TranslationDetailDTO → DocumentDTO 형태로 매핑
          setDocument({
            id: id,
            title: res.data.title,
            contents: res.data.content,
          });
        }
        return;
      }

      // 원본 편집인 경우: 기존 로직
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
  }, [id, setErrMsg, isTranslationEdit, locale, authEP]);
  
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
    isTranslationEdit,
  }
}

export default useSaveBlogPost;