import {EditBlogPostProps} from "./EditBlogPost";
import {useAuth} from "../../../../appConfig/AuthContext";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAtom} from "jotai/index";
import {uploadedInfo} from "../../../../stores/jotai/jotai";
import {useNavigate, useParams} from "react-router-dom";
import {getDocument, saveDocument} from "../../../../endpoints/blog-endpoints";
import {endpointUtils} from "../../../../utils/endpointUtils";
import {S3URLFindRegex} from "../../../../constants/RegexConstants";

export default function useEditBlogPost(props : EditBlogPostProps) {
  const {accessToken, setAccessToken} = useAuth();
  const [errMsg, setErrMsg] = useRecoilState(recoil.errMsg);
  const editorRef = useRef<any>(null);
  const [document, setDocument] = useState<DocumentDTO>()
  const [uploadedList, setUploadedList] = useAtom<any[]>(uploadedInfo);
  const {id} = useParams();
  const navigate = useNavigate();
  
  // 글 수정
  const handleEdit = useCallback(async () => {
    // 글 가져오기
    if (editorRef?.current?.getInstance()) {
      const editorInfo = editorRef?.current.getInstance();
      let contents : string = "";
      if (editorInfo.mode === "markdown") {
        contents = editorInfo.getMarkdown();
      } else if (editorInfo?.mode === "wysiwyg") {
        contents = editorInfo.getHTML();
      }
  
      // 정규 표현식을 사용하여 ![string](https://haries-img.s3.ap-northeast-2.amazonaws.com/ 문자열 ) 패턴을 찾습니다.
      // const regex = process.env.REACT_APP_AWS_S3_URL_REGEX;
      const regex = S3URLFindRegex;
      let matches;
      const values = [];
  
      while ((matches = regex!.exec(contents)) !== null) {
        values.push(matches[1]);
      }
      
      const request : DocumentDTO = {
        ...document,
        contents: contents,
        thumbnailImgUrl : values[0]
      }
      console.log("request 보기", request);
      
      try {
        const saveRes = await endpointUtils.authAxios({
          func: saveDocument,
          accessToken: accessToken,
          setAccessToken: setAccessToken,
          reqBody : request
        });
        navigate(`/blog/view/${id}`)
      } catch (e) {
        setErrMsg({
          status: "error",
          msg: "save failed",
        })
      }
      
    }
  }, [document]);
  
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