import {FolderTreeViewProps} from "./FolderTree";
import {useCallback, useEffect, useState, useMemo} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {TreeItem, TreeItemIndex} from "react-complex-tree";
import {getAllLoginUserFolders} from "../../../endpoints/folders-endpoints";
import {endpointUtils} from "../../../utils/endpointUtils";
import {useAuth} from "../../../appConfig/AuthContext";

// react-complex-tree에서 사용할 아이템 인터페이스
interface FolderTreeItem extends TreeItem {
  data: FoldersDTO;
}

// 프롭스 인터페이스
interface FolderTreeProps {
  userId: string;
  onFolderSelect?: (folder: FoldersDTO) => void;
  showPublicOnly?: boolean;
}

export default function useFolderTree(props: FolderTreeViewProps) {
  const [folders, setFolders] = useState<FoldersDTO[]>([]);
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  
  useEffect(() => {
    getAllFolders();
  }, []);
  
  const getAllFolders = useCallback(async () => {
    try {
      const res = await endpointUtils.authAxios({
        func: getAllLoginUserFolders,
        accessToken: accessToken,
        setAccessToken: setAccessToken
      });
      
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
  }, [accessToken, setAccessToken, setErrorMsg]);
  
  // 폴더 데이터를 트리 구조로 변환
  const { treeItems, rootItems } = useMemo(() => {
    console.log('=== Tree conversion started ===');
    console.log('Folders to convert:', folders);
    console.log('Folders length:', folders.length);
    
    const items: Record<TreeItemIndex, FolderTreeItem> = {};
    
    // 루트 아이템 생성
    items.root = {
      index: 'root',
      canMove: false,
      canRename: false,
      data: {} as FoldersDTO,
      children: [],
      isFolder: true
    };
    
    if (folders.length === 0) {
      console.log('No folders found, returning empty tree');
      return { treeItems: items, rootItems: ['root'] };
    }
    
    // 모든 폴더를 루트 레벨에 표시 (임시로 parentId 무시)
    const rootChildren: TreeItemIndex[] = [];
    
    folders.forEach((folder, index) => {
      console.log(`Processing folder ${index}:`, folder);
      
      // id가 비어있으면 index 사용
      const itemId = folder.id || "";
      
      console.log('Using itemId:', itemId);
      
      items[itemId] = {
        index: itemId,
        canMove: true,
        canRename: true,
        data: folder,
        children: [], // 일단 자식 없이
        isFolder: true
      };
      
      // 모든 폴더를 루트의 직접 자식으로 추가
      rootChildren.push(itemId);
    });
    
    // 루트 아이템의 자식들 설정
    items.root.children = rootChildren;
    
    console.log('Final tree items:', items);
    console.log('=== Tree conversion finished ===');
    
    return {
      treeItems: items,
      rootItems: ['root']
    };
  }, [folders]);
  
  return {
    folders,
    rootItems,
    treeItems,
  };
}