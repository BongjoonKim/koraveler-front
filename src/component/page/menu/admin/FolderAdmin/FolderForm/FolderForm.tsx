import {useEffect, useState} from "react";
import {createFolder, updateFolder} from "../../../../../../endpoints/folders-endpoints";
import styled from "styled-components";
import {useAuth} from "../../../../../../appConfig/AuthContext";
import {endpointUtils} from "../../../../../../utils/endpointUtils";

interface FolderFormProps {
  userId?: string;
  folder?: FoldersDTO;
  parentFolder?: FoldersDTO | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FolderForm( {
 userId,
 folder,
 parentFolder = null,
 onSuccess,
 onCancel
} : FolderFormProps) {
  const isEditMode = !!folder?.id;
  
  // 폼 상태 관리
  const [formData, setFormData] = useState<FoldersDTO>({
    id : "",
    name: '',
    path: '',
    parentId: null,
    userId: userId || "",
    isPublic: false,
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {accessToken, setAccessToken} = useAuth();
  
  
  // 초기 데이터 설정
  useEffect(() => {
    if (folder) {
      setFormData({
        id: folder.id,
        name: folder.name,
        path: folder.path,
        parentId: folder.parentId,
        userId: folder.userId,
        isPublic: folder.isPublic,
        description: folder.description || ''
      });
    } else if (parentFolder) {
      // 새 폴더 생성 시 부모 폴더 정보를 기반으로 path 설정
      setFormData(prev => ({
        ...prev,
        parent_id: parentFolder.id || null,
        path: parentFolder.path + '/' + prev.name
      }));
    }
  }, [folder, parentFolder]);
  
  // 입력 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // 이름이 변경되면 경로도 자동으로 업데이트
      if (name === 'name' && parentFolder) {
        newData.path = parentFolder.path + '/' + value;
      }
      
      return newData;
    });
  };
  
  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isEditMode) {
        // 폴더 업데이트
        // await updateFolder(formData)
        await endpointUtils.authAxios({
          func : updateFolder,
          accessToken : accessToken,
          setAccessToken : setAccessToken,
          params : formData
        })
      } else {
        // 새 폴더 생성
        // await createFolder(formData)
        await endpointUtils.authAxios({
          func : createFolder,
          accessToken : accessToken,
          setAccessToken : setAccessToken,
          params : formData
        })
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('폴더 저장 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <StyledFolderForm>
    <form onSubmit={handleSubmit} className="folder-form">
      <h2>{isEditMode ? '폴더 수정' : '새 폴더 생성'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">폴더 이름 *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="path">경로 *</label>
        <input
          type="text"
          id="path"
          name="path"
          value={formData.path}
          onChange={handleChange}
          required
          disabled={!!parentFolder}
        />
        <small>부모 폴더가 있는 경우 자동으로 설정됩니다.</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="description">설명</label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>
      
      <div className="form-group checkbox">
        <input
          type="checkbox"
          id="is_public"
          name="is_public"
          checked={formData.isPublic}
          onChange={handleChange}
        />
        <label htmlFor="is_public">공개 폴더</label>
      </div>
      
      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '저장 중...' : isEditMode ? '저장' : '생성'}
        </button>
      </div>
    </form>
    </StyledFolderForm>
  );
};

const StyledFolderForm = styled.div`
.folder-tree-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
}

.folder-name {
  display: flex;
  align-items: center;
  gap: 5px;
}

.public-indicator {
  color: #0088cc;
  font-size: 12px;
}

.folder-open-icon,
.folder-closed-icon {
  margin-right: 5px;
}

.error {
  color: #d32f2f;
  padding: 10px;
}

.folder-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group.checkbox label {
  margin-bottom: 0;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.form-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background: #4caf50;
  color: white;
}

.form-actions button[type="button"] {
  background: #f5f5f5;
  border: 1px solid #ddd;
}

.folder-management {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
}

.folder-management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.folder-actions {
  display: flex;
  gap: 10px;
}

.folder-actions button {
  padding: 8px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.folder-management-content {
  display: flex;
  gap: 20px;
  height: calc(100% - 60px);
}

.folder-tree-section,
.folder-details-section {
  flex: 1;
  padding: 15px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow: auto;
}

.folder-details h2 {
  margin-top: 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.folder-info p {
  margin: 8px 0;
}

.folder-empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #757575;
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}
`;