import {FolderTreeViewProps} from "./FolderTree";
import {useEffect, useState} from "react";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";
import {TreeItem, TreeItemIndex} from "react-complex-tree";

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

export default function useFolderTree(props :FolderTreeViewProps ) {
  const [folders, setFolders] = useState<FoldersDTO[]>([]);
  const [loginUser, setLoginUser] = useRecoilState(recoil.userData);
  const [treeItems, setTreeItems] = useState<Record<TreeItemIndex, FolderTreeItem>>({});
  const [rootItems, setRootItems] = useState<TreeItemIndex[]>([]);
  
  
  useEffect(() => {
  
  }, [loginUser.userId]);
  
  return {
    folders,
    rootItems,
    treeItems,
  }
}