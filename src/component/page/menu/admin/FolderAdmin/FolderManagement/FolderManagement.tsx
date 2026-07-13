import FolderTree from "../../../../../../common/widget/FolderTree";
import {useCallback, useState} from "react";
import FolderForm from "../FolderForm/FolderForm";
import {TreeItemIndex} from "react-complex-tree";
import {getParentFolder} from "../../../../../../endpoints/folders-endpoints";
import {useRecoilState} from "recoil";
import recoil from "../../../../../../stores/recoil";
import styled from "styled-components";
import CusModal from "../../../../../../common/elements/CusModal";
import FolderInfo from "../FolderInfo";
import useAuthEP from "../../../../../../utils/useAuthEP";
import {useMyFolders} from "../../../../../../hooks/useFolderQueries";
import {homeTokens} from "../../../../MainPage/MainBody/homeTokens";

const t = homeTokens;

interface FolderManagementProps {
  userId?: string;
}

const FolderManagement: React.FC<FolderManagementProps> = ({ userId }) => {
  const [selectedFolder, setSelectedFolder] = useState<FoldersDTO | undefined | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);

  const {data : folders} = useMyFolders();
  const [folderModal, setFolderModal] = useState<boolean>(false);
  const authEP = useAuthEP();

  // 폴더 선택 핸들러 - 토글 기능 추가
  const handleFolderSelect = (items: TreeItemIndex[]) => {
    // 선택된 항목이 없으면 선택 해제
    if (!items || items.length === 0) {
      setSelectedFolder(null);
      setShowForm(false);
      return;
    }

    const newSelectedFolder = folders[items[0]].data;

    // 현재 선택된 폴더와 새로 선택한 폴더가 같으면 선택 해제
    if (selectedFolder && selectedFolder.id === newSelectedFolder.id) {
      setSelectedFolder(null);
      setShowForm(false);
    } else {
      // 다른 폴더이거나 처음 선택하는 경우
      setSelectedFolder(newSelectedFolder);
    }
  };

  const getParentFolderData = useCallback(async() => {
    try {
      const res = await authEP({
        func: getParentFolder,
        params: { childId: selectedFolder?.id }
      })

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

  return (
    <StyledFolderManagement>
    <div className="folder-management">
      <div className="folder-management-content">
        <div className="folder-tree-section">
          <div className="folder-tree-container">
            <FolderTree
              key={refreshKey}
              handleFolderSelect={handleFolderSelect}
              folders={folders}
              selectedFolderId={selectedFolder?.id} // 선택된 폴더 ID 전달
              dark
            />

            {/* 플로팅 액션 버튼들 */}
            <div className="floating-actions">
              {/* 새 폴더 버튼 - 항상 표시 */}
              <button
                className="floating-btn floating-btn-primary"
                onClick={handleCreateFolder}
                title="New folder"
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
                  title="Edit folder"
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
            <FolderInfo selectedFolder={selectedFolder} />
          ) : (
            <div className="folder-placeholder">
              <p className="placeholder-title">Select a folder</p>
              <p className="placeholder-sub">
                Pick a folder from the tree to see its details, or create a new
                one with the + button.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
      <CusModal isOpen={folderModal} onClose={closeFolderModal} variant="dark">
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
    height: 100%;
    color: ${t.color.text};
    font-family: ${t.font.sans};

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
        height: 100%;
        position: relative;
        border: 0.5px solid ${t.color.border};
        border-radius: ${t.radius.lg};
        background: ${t.color.surface};
        overflow: hidden;

        /* react-complex-tree 다크/브랜드 톤 (BlogPostSetting 과 동일 계열) */
        --rct-color-tree-bg: transparent;
        --rct-color-focustree-item-selected-bg: rgba(143, 191, 148, 0.16);
        --rct-color-focustree-item-hover-bg: rgba(255, 255, 255, 0.05);
        --rct-color-focustree-item-active-bg: rgba(143, 191, 148, 0.24);
        --rct-color-focustree-item-selected-text: #ffffff;
        --rct-color-focustree-item-hover-text: #ffffff;
        --rct-color-focustree-item-active-text: #ffffff;
        --rct-bar-color: ${t.color.accent};
    }

    .folder-details-section {
        flex: 1;
        min-width: 300px;
    }

    /* 빈 상태(폴더 미선택) */
    .folder-placeholder {
        height: 100%;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        border: 0.5px dashed ${t.color.border2};
        border-radius: ${t.radius.lg};
        padding: 32px 24px;
    }

    .placeholder-title {
        font-family: ${t.font.serif};
        font-size: 19px;
        font-weight: 500;
        color: ${t.color.textSoft};
        margin: 0 0 8px;
    }

    .placeholder-sub {
        font-size: 13.5px;
        color: ${t.color.textMuted};
        max-width: 320px;
        line-height: 1.55;
        margin: 0;
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
        width: 52px;
        height: 52px;
        border-radius: 50%;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
        position: relative;
    }

    .floating-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
    }

    .floating-btn:active {
        transform: translateY(0);
        transition: transform 0.1s;
    }

    /* 새 폴더 버튼 (주요 액션) */
    .floating-btn-primary {
        background: ${t.color.accentStrong};
        color: #eef7ef;
    }

    .floating-btn-primary:hover {
        filter: brightness(1.1);
    }

    /* 편집 버튼 (보조 액션) */
    .floating-btn-edit {
        background: ${t.color.surface3};
        border: 0.5px solid ${t.color.border2};
        color: ${t.color.textSoft};
        animation: slideInUp 0.25s ease-out;
    }

    .floating-btn-edit:hover {
        background: ${t.color.badgeBg};
        color: ${t.color.badgeText};
    }

    /* 툴팁 효과 */
    .floating-btn::before {
        content: attr(title);
        position: absolute;
        right: 66px;
        top: 50%;
        transform: translateY(-50%);
        background: ${t.color.surface3};
        border: 0.5px solid ${t.color.border2};
        color: ${t.color.textSoft};
        padding: 7px 11px;
        border-radius: 6px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s ease;
        pointer-events: none;
    }

    .floating-btn:hover::before {
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
            width: 46px;
            height: 46px;
        }

        .floating-btn svg {
            width: 16px;
            height: 16px;
        }
    }
`;
