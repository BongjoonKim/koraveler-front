import {useCallback, useEffect, useState} from "react";
import {useAtom} from "jotai/index";
import {openBlogPostingModalAtom} from "../../../stores/jotai/jotai";
import useAuthEP from "../../../utils/useAuthEP";
import {getAllLoginUserFolders} from "../../../endpoints/folders-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {TreeItemIndex} from "react-complex-tree";
import {RadioOption} from "../../elements/CusRadio";

export default function useBlogPostSetting() {
  const [selectedFolder, setSelectedFolder] = useState<FoldersDTO | undefined | null>(null);
  const [folders, setFolders] = useState<any>({});
  const [openBlogPostingModal, setOpenBlogPostingModal] = useAtom<boolean>(openBlogPostingModalAtom)
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  const authEP = useAuthEP();
  
  const getAllUserFolder = useCallback(async() => {
    try {
      const res = await authEP({
        func : getAllLoginUserFolders,
      })
      if (res.status !== 200) {
        setErrorMsg({
          status: "error",
          msg: "folder retrieve failed",
        });
      }
      setFolders(res.data || []);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: e?.toString(),
      });
    }
  }, [])
  
  const showHideRadioOptions: RadioOption[] = [
    { value: 'true', label: 'Show' },
    { value: 'false', label: 'Hide' },
  ];
  
  const handleFolderSelect = (items: TreeItemIndex[]) => {
    // 선택된 항목이 없으면 선택 해제
    if (!items || items.length === 0) {
      setSelectedFolder(null);
      return;
    }
    
    const newSelectedFolder = folders[items[0]].data;
    
    
    // 현재 선택된 폴더와 새로 선택한 폴더가 같으면 선택 해제
    if (selectedFolder && selectedFolder.id === newSelectedFolder.id) {
      setSelectedFolder(null);
    } else {
      // 다른 폴더이거나 처음 선택하는 경우
      setSelectedFolder(newSelectedFolder);
    }
  }
  
  useEffect(() => {
    if (openBlogPostingModal) {
      getAllUserFolder();
    }
  }, [openBlogPostingModal]);
  
  return {
    folders,
    handleFolderSelect,
    selectedFolder,
    showHideRadioOptions,
  }
}