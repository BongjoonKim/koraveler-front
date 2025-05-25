import FolderTree from "../../../../../../common/widget/FolderTree";
import {useCallback, useEffect, useState} from "react";
import FolderForm from "../FolderForm/FolderForm";
import {TreeItemIndex} from "react-complex-tree";
import {endpointUtils} from "../../../../../../utils/endpointUtils";
import {getAllLoginUserFolders} from "../../../../../../endpoints/folders-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";
import {useAuth} from "../../../../../../appConfig/AuthContext";
import moment from "moment";

interface FolderManagementProps {
  userId?: string;
}

const FolderManagement: React.FC<FolderManagementProps> = ({ userId }) => {
  const [selectedFolder, setSelectedFolder] = useState<FoldersDTO | undefined | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  const {accessToken, setAccessToken} = useAuth();
  const [folders, setFolders] = useState<any>({});
  
  // 폴더 선택 핸들러 - 토글 기능 추가
  const handleFolderSelect = (items: TreeItemIndex[]) => {
    console.log("folders", folders);
    
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
  };
  
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
  
  // 새 폴더 생성 버튼 핸들러
  const handleCreateFolder = () => {
    setFormMode('create');
    setShowForm(true);
  };
  
  // 폴더 편집 버튼 핸들러
  const handleEditFolder = () => {
    if (selectedFolder) {
      setFormMode('edit');
      setShowForm(true);
    }
  };
  
  // 폼 성공 핸들러
  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1); // 트리 새로고침
  };
  
  // 폼 취소 핸들러
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  useEffect(() => {
    getAllFolders();
  }, []);
  
  return (
    <div className="folder-management">
      <div className="folder-management-header">
        <h1>폴더 관리</h1>
        <div className="folder-actions">
          <button onClick={handleCreateFolder}>새 폴더</button>
          {selectedFolder && (
            <button onClick={handleEditFolder}>수정</button>
          )}
        </div>
      </div>
      
      <div className="folder-management-content">
        <div className="folder-tree-section">
          <h2>폴더 구조</h2>
          <FolderTree
            key={refreshKey}
            handleFolderSelect={handleFolderSelect}
            folders={folders}
            selectedFolderId={selectedFolder?.id} // 선택된 폴더 ID 전달
          />
        </div>
        
        <div className="folder-details-section">
          {showForm ? (
            <FolderForm
              userId={userId}
              folder={formMode === 'edit' ? selectedFolder || undefined : undefined}
              parentFolder={formMode === 'create' ? selectedFolder : null}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          ) : selectedFolder ? (
            <div className="folder-details">
              <h2>{selectedFolder.name}</h2>
              <div className="folder-info">
                <p><strong>경로:</strong> {selectedFolder?.path}</p>
                <p><strong>공개:</strong> {selectedFolder.isPublic ? '예' : '아니오'}</p>
                {selectedFolder.description && (
                  <p><strong>설명:</strong> {selectedFolder.description}</p>
                )}
                <p>{moment(selectedFolder?.created).toISOString()}</p>
                <p>{moment(selectedFolder?.updated).toISOString()}</p>
              </div>
            </div>
          ) : (
            <div className="folder-empty-state">
              <p>폴더를 선택하거나 새 폴더를 생성하세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderManagement;