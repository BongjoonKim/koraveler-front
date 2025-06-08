import {FolderTreeProps} from "./FolderTree";
import React, {useCallback, useEffect, useState, useMemo} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {TreeItem, TreeItemIndex} from "react-complex-tree";
import {getAllLoginUserFolders} from "../../../endpoints/folders-endpoints";
import useAuthEP from "../../../utils/useAuthEP";

export default function useFolderTree(props: FolderTreeProps) {
  const [folders, setFolders] = useState<any>({});
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const [selectedFolders, setSelectedFolders] = useState<TreeItemIndex[]>([]);
  const authEP = useAuthEP();

  
  const getAllFolders = useCallback(async () => {
    try {
      const res = await authEP({
        func: getAllLoginUserFolders,
      })

      
      console.log("Folder response", res.data);
      console.log("Folder response type:", typeof res.data);
      console.log("Folder response length:", res.data?.length);
      
      setFolders(res.data || []);
    } catch (e) {
      console.error("Error fetching folders:", e);
      setErrorMsg({
        status: "error",
        msg: "retrieve failed",
      });
    }
  }, [setErrorMsg]);
  
  
  const handleFolderSelect = useCallback((items: TreeItemIndex[]) => {
    console.log('Selected items:', items);
    if (items.length > 0) {
      setSelectedFolders(items);
    }
  }, [props]);
  
  useEffect(() => {
    getAllFolders();
  }, []);
  
  return {
    folders,
    handleFolderSelect,
  };
}