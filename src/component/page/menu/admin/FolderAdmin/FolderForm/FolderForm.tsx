import {FormEvent, useEffect, useState} from "react";
import styled from "styled-components";
import {useCreateFolder, useDeleteFolder, useUpdateFolder} from "../../../../../../hooks/useFolderQueries";
import {homeTokens} from "../../../../MainPage/MainBody/homeTokens";
import {
  Alert,
  DangerButton,
  Label,
  OutlineButton,
  PrimaryButton,
  SectionTitle,
} from "../../../../profile/profileUi";

const t = homeTokens;

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
  const createFolderMutation = useCreateFolder();
  const updateFolderMutation = useUpdateFolder();
  const deleteFolderMutation = useDeleteFolder();

  // 폼 상태 관리
  const [formData, setFormData] = useState<FoldersDTO & { parentName?: string }>({
    name: '',
    path: '',
    parentId: null,
    parentName : "",
    userId: userId || "",
    isPublic: false,
    description: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 초기 데이터 설정
  useEffect(() => {
    if (folder) {
      setFormData({
        id: folder.id,
        name: folder.name,
        path: folder.path,
        parentId: parentFolder?.id ? parentFolder?.id :folder.parentId,
        parentName : parentFolder?.name,
        userId: folder.userId,
        isPublic: folder.isPublic,
        description: folder.description || ''
      });
    } else if (parentFolder) {
      // 새 폴더 생성 시 부모 폴더 정보를 기반으로 path 설정
      setFormData(prev => ({
        ...prev,
        parentId: parentFolder.id || null,
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
        await updateFolderMutation.mutateAsync(formData);
      } else {
        // 새 폴더 생성
        await createFolderMutation.mutateAsync(formData);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError('Something went wrong while saving the folder.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!folder?.id) {
      setError("There is no folder to delete.");
      return;
    }

    try {
      await deleteFolderMutation.mutateAsync(folder.id);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setError("Something went wrong while deleting the folder.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <StyledFolderForm>
    <form onSubmit={handleSubmit} className="folder-form">
      <SectionTitle>{isEditMode ? 'Edit folder' : 'New folder'}</SectionTitle>

      {error && <Alert tone="error">{error}</Alert>}

      <div className="field">
        <Label htmlFor="name">Folder name *</Label>
        <input
          className="text-input"
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <Label htmlFor="parentName">Parent folder</Label>
        <input
          className="text-input"
          type="text"
          id="parentName"
          name="parentName"
          value={parentFolder?.name || ''}
          onChange={handleChange}
          disabled={!parentFolder}
        />
        <small className="hint">Set automatically when a parent folder is selected.</small>
      </div>

      <div className="field">
        <Label htmlFor="description">Description</Label>
        <textarea
          className="text-input"
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <label className="checkbox-row" htmlFor="isPublic">
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={formData.isPublic}
          onChange={handleChange}
        />
        <span>Public folder</span>
      </label>

      <div className="form-actions">
        {isEditMode && (
          <DangerButton
            type="button"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </DangerButton>
        )}
        <OutlineButton
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </OutlineButton>
        <PrimaryButton
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : isEditMode ? 'Save' : 'Create'}
        </PrimaryButton>
      </div>
    </form>
    </StyledFolderForm>
  );
};

const StyledFolderForm = styled.div`
    height: 100%;
    color: ${t.color.text};
    font-family: ${t.font.sans};

    .folder-form {
        background: ${t.color.surface};
        border: 0.5px solid ${t.color.border};
        border-radius: ${t.radius.lg};
        padding: 26px;
        display: flex;
        flex-direction: column;
        gap: 18px;

        @media (max-width: 640px) {
            padding: 20px 18px;
        }
    }

    /* profileUi 의 TextInput 과 동일한 톤의 네이티브 인풋 */
    .text-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.04);
        border: 0.5px solid rgba(255, 255, 255, 0.12);
        border-radius: ${t.radius.md};
        padding: 12px;
        color: ${t.color.text};
        font-family: ${t.font.sans};
        font-size: 15px;
        outline: none;
        color-scheme: dark;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;

        &::placeholder {
            color: ${t.color.textFaint};
        }

        &:focus {
            border-color: ${t.color.accent};
            box-shadow: 0 0 0 3px rgba(143, 191, 148, 0.14);
        }

        &:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
    }

    textarea.text-input {
        resize: vertical;
        min-height: 76px;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .hint {
        font-size: 12px;
        color: ${t.color.textFaint};
    }

    .checkbox-row {
        display: flex;
        align-items: center;
        gap: 9px;
        cursor: pointer;
        font-size: 14px;
        color: ${t.color.textSoft};

        input[type="checkbox"] {
            width: 16px;
            height: 16px;
            accent-color: ${t.color.accentStrong};
            cursor: pointer;
        }
    }

    .form-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 4px;
    }
`;
