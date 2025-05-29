import FolderTree from "../../../../../../common/widget/FolderTree";
import {useCallback, useEffect, useState} from "react";
import FolderForm from "../FolderForm/FolderForm";
import {TreeItemIndex} from "react-complex-tree";
import {endpointUtils} from "../../../../../../utils/endpointUtils";
import {getAllLoginUserFolders, getParentFolder} from "../../../../../../endpoints/folders-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";
import {useAuth} from "../../../../../../appConfig/AuthContext";
import moment from "moment";
import styled from "styled-components";
import CusModal from "../../../../../../common/elements/CusModal";

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
  const [folderModal, setFolderModal] = useState<boolean>(false);
  
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
  
  const getParentFolderData = useCallback(async() => {
    try {
      const res =  await endpointUtils.authAxios({
        func: getParentFolder,
        accessToken : accessToken,
        setAccessToken : setAccessToken,
        params : {childId : selectedFolder?.id}
      });
      
      if (res.status != 200) {
        throw res.statusText
      }
      setSelectedFolder(res.data)
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: e?.toString(),
      });
    }

  }, [folderModal, selectedFolder])
  
  // 새 폴더 생성 버튼 핸들러
  const handleCreateFolder = () => {
    setFormMode('create');
    setShowForm(true);
    setFolderModal(true)
  };
  
  // 폴더 편집 버튼 핸들러
  const handleEditFolder = () => {
    if (selectedFolder) {
      setFormMode('edit');
      setShowForm(true);
      setFolderModal(true)
    }
  };
  
  // 폼 성공 핸들러
  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshKey(prev => prev + 1); // 트리 새로고침
    setFolderModal(false)
  };
  
  // 폼 취소 핸들러
  const handleFormCancel = () => {
    setShowForm(false);
    setFolderModal(false);
  };
  
  const closeFolderModal = () => {
    setFolderModal(false);
  }
  
  useEffect(() => {
    getAllFolders();
  }, []);
  
  console.log("선택한 폴더", selectedFolder)
  
  return (
    <StyledFolderManagement>
    <div className="folder-management">
      <div className="folder-management-content">
        <div className="folder-tree-section">
          <h2>폴더 구조</h2>
          <div className="folder-tree-container">
            <FolderTree
              key={refreshKey}
              handleFolderSelect={handleFolderSelect}
              folders={folders}
              selectedFolderId={selectedFolder?.id} // 선택된 폴더 ID 전달
            />
            
            {/* 플로팅 액션 버튼들 */}
            <div className="floating-actions">
              {/* 새 폴더 버튼 - 항상 표시 */}
              <button
                className="floating-btn floating-btn-primary"
                onClick={handleCreateFolder}
                title="새 폴더"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              {/* 폴더 편집 버튼 - 선택된 폴더가 있을 때만 표시 */}
              {selectedFolder && (
                <button
                  className="floating-btn floating-btn-edit"
                  onClick={handleEditFolder}
                  title="폴더 수정"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              )}
            </div>
          </div>
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
      <CusModal isOpen={folderModal} onClose={closeFolderModal}>
        <FolderForm
          userId={userId}
          folder={formMode === 'edit' ? selectedFolder || undefined : undefined}
          parentFolder={formMode === 'create' ? selectedFolder : null}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </CusModal>
    </StyledFolderManagement>
  );
};

export default FolderManagement;

const StyledFolderManagement = styled.div`
    /* 폴더 관리 전체 레이아웃 */
    .folder-management {
        position: relative;
        height: 100%;
        min-height: 600px;
    }

    .folder-management-content {
        display: flex;
        gap: 20px;
        height: 100%;
    }

    .folder-tree-section {
        flex: 1;
        min-width: 300px;
    }

    .folder-tree-container {
        position: relative;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        background: #fff;
        min-height: 500px;
        overflow: hidden;
    }

    .folder-details-section {
        flex: 1;
        min-width: 300px;
    }

    /* 플로팅 액션 버튼 컨테이너 */
    .floating-actions {
        position: absolute;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 100;
    }

    /* 플로팅 버튼 기본 스타일 */
    .floating-btn {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        position: relative;
        overflow: hidden;
    }

    .floating-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .floating-btn:active {
        transform: translateY(0);
        transition: transform 0.1s;
    }

    /* 새 폴더 버튼 (주요 액션) */
    .floating-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .floating-btn-primary:hover {
        background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    }

    /* 편집 버튼 (보조 액션) */
    //.floating-btn-edit {
    //    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    //    color: white;
    //    animation: slideInUp 0.3s ease-out;
    //}

    //.floating-btn-edit:hover {
    //    background: linear-gradient(135deg, #ec7ef8 0%, #f04658 100%);
    //}

    /* 툴팁 효과 */
    .floating-btn::before {
        content: attr(title);
        position: absolute;
        right: 70px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        pointer-events: none;
    }

    .floating-btn::after {
        content: '';
        position: absolute;
        right: 62px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid rgba(0, 0, 0, 0.8);
        border-top: 4px solid transparent;
        border-bottom: 4px solid transparent;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .floating-btn:hover::before,
    .floating-btn:hover::after {
        opacity: 1;
        visibility: visible;
    }

    /* 버튼 등장 애니메이션 */
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* 리플 효과 */
    .floating-btn::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        transition: width 0.3s, height 0.3s;
    }

    .floating-btn:active::after {
        width: 100%;
        height: 100%;
    }

    /* 모바일 반응형 */
    @media (max-width: 768px) {
        .folder-management-content {
            flex-direction: column;
        }

        .floating-actions {
            bottom: 15px;
            right: 15px;
        }

        .floating-btn {
            width: 48px;
            height: 48px;
        }

        .floating-btn svg {
            width: 16px;
            height: 16px;
        }
    }
`;