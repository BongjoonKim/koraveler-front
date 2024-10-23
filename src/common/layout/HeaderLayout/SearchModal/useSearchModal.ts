import {SearchModalProps} from "./SearchModal";
import {ChangeEvent, useCallback, useState} from "react";
import {useAuth} from "../../../../appConfig/AuthContext";
import {searchDocuments} from "../../../../endpoints/blog-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../stores/recoil";

export default function useSearchModal(props : SearchModalProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const {accessToken, setAccessToken} = useAuth();
  const [docs, setDocs] = useState<DocumentDTO[] | undefined>([]);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  
  const handleSearching = useCallback(async(event : ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);
    try {
      const resDocs = await searchDocuments({
        params : {
          value: value,
          page: 0,
          size : 100,
        }
      });
      if (resDocs?.status !== 200) {
        throw resDocs.statusText;
      }
      setDocs(resDocs.data.documentsDTO);
      console.log("resDocs.data.documentsDTO", resDocs.data.documentsDTO)
    } catch (e) {
      setErrorMsg({
        status : "error",
        msg : e?.toString()
      })
    }

    
    console.log("searchValue", searchValue);
    
    
  }, [searchValue]);
  
  return {
    searchValue,
    docs,
    handleSearching,
  }
}