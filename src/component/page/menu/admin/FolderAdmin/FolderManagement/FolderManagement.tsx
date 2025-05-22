import FolderTreeView from "../../../../../../common/widget/FolderTree";
import {useState} from "react";
import FolderForm from "../FolderForm/FolderForm";

interface FolderManagementProps {
  userId?: string;
}

const FolderManagement: React.FC<FolderManagementProps> = ({ userId }) => {
  const [selectedFolder, setSelectedFolder] = useState<FoldersDTO | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // 폴더 선택 핸들러
  const handleFolderSelect = (folder: FoldersDTO) => {
    setSelectedFolder(folder);
  };
  
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
          <FolderTreeView
            key={refreshKey}
            userId={userId}
            onFolderSelect={handleFolderSelect}
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
                <p><strong>경로:</strong> {selectedFolder.path}</p>
                <p><strong>공개:</strong> {selectedFolder.isPublic ? '예' : '아니오'}</p>
                {selectedFolder.description && (
                  <p><strong>설명:</strong> {selectedFolder.description}</p>
                )}
                <p>{selectedFolder.created?.toDateString()}</p>
                <p>{selectedFolder.updated?.toDateString()}</p>
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