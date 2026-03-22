import { useState, useRef, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import {
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  FileText,
  Tag,
  Eye,
  EyeOff,
  Globe,
  Lock,
} from "lucide-react";
import { TravelVisibility } from "../../../../../types/travel/travelTypes";
import {
  useUpdateTravel,
  useDeleteTravel,
} from "../../../../../hooks/useTravelQueries";

export interface TravelSettingsProps {
  travelId: string;
  currentTitle: string;
  currentDescription?: string;
  currentTags?: string[];
  currentVisibility: TravelVisibility;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

function TravelSettings({
  travelId,
  currentTitle,
  currentDescription,
  currentTags,
  currentVisibility,
  isOpen,
  onClose,
  onDeleted,
}: TravelSettingsProps) {
  // Title
  const [title, setTitle] = useState(currentTitle);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Description
  const [description, setDescription] = useState(currentDescription ?? "");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Tags
  const [tags, setTags] = useState<string[]>(currentTags ?? []);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Visibility
  const [visibility, setVisibility] = useState<TravelVisibility>(currentVisibility);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const updateTravel = useUpdateTravel();
  const deleteTravelMutation = useDeleteTravel();

  // 모달이 열릴 때만 props → 로컬 상태 동기화
  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
      setDescription(currentDescription ?? "");
      setTags(currentTags ?? []);
      setVisibility(currentVisibility);
      setIsEditingTitle(false);
      setIsEditingDesc(false);
      setIsEditingTags(false);
      setTagInput("");
      setShowDeleteConfirm(false);
      setDeleteInput("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isEditingDesc && descRef.current) {
      descRef.current.focus();
    }
  }, [isEditingDesc]);

  useEffect(() => {
    if (isEditingTags && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [isEditingTags]);

  // body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // 공통 업데이트 헬퍼
  const saveField = useCallback(
    async (reqBody: Record<string, unknown>) => {
      await updateTravel.mutateAsync({ travelId, reqBody });
    },
    [travelId, updateTravel]
  );

  // --- Title ---
  const handleSaveTitle = async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed === currentTitle) {
      setIsEditingTitle(false);
      setTitle(currentTitle);
      return;
    }
    try {
      await saveField({ title: trimmed });
      setIsEditingTitle(false);
    } catch {
      setTitle(currentTitle);
      setIsEditingTitle(false);
    }
  };

  // --- Description ---
  const handleSaveDesc = async () => {
    const trimmed = description.trim();
    if (trimmed === (currentDescription ?? "")) {
      setIsEditingDesc(false);
      return;
    }
    try {
      await saveField({ description: trimmed });
      setIsEditingDesc(false);
    } catch {
      setDescription(currentDescription ?? "");
      setIsEditingDesc(false);
    }
  };

  // --- Tags ---
  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSaveTags = async () => {
    try {
      console.log(tags);
      await saveField({ tags });
      setIsEditingTags(false);
    } catch {
      setTags(currentTags ?? []);
      setIsEditingTags(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  // --- Visibility ---
  const handleVisibilityChange = async (v: TravelVisibility) => {
    if (v === visibility) return;
    setVisibility(v);
    try {
      await saveField({ visibility: v });
    } catch {
      setVisibility(currentVisibility);
    }
  };

  // --- Delete ---
  const handleDelete = async () => {
    try {
      await deleteTravelMutation.mutateAsync(travelId);
      onDeleted();
    } catch {
      // React Query에서 처리
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSaveTitle();
    else if (e.key === "Escape") {
      setTitle(currentTitle);
      setIsEditingTitle(false);
    }
  };

  if (!isOpen) return null;

  const canDelete = deleteInput === currentTitle;

  return (
    <Overlay onClick={onClose}>
      <StyledTravelSettings onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-header">
          <h2>Project Settings</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="settings-body">
          {/* 프로젝트 이름 */}
          <div className="settings-section">
            <div className="section-label">
              <Pencil size={15} />
              Project Name
            </div>
            {isEditingTitle ? (
              <div className="edit-row">
                <input
                  ref={titleInputRef}
                  className="field-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={handleTitleKeyDown}
                  maxLength={100}
                  placeholder="Enter project name"
                />
                <div className="edit-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setTitle(currentTitle);
                      setIsEditingTitle(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleSaveTitle}
                    disabled={
                      !title.trim() ||
                      title.trim() === currentTitle ||
                      updateTravel.isPending
                    }
                  >
                    {updateTravel.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="field-display"
                onClick={() => setIsEditingTitle(true)}
              >
                <span className="field-text">{currentTitle}</span>
                <Pencil size={14} className="edit-icon" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="settings-section">
            <div className="section-label">
              <FileText size={15} />
              Description
            </div>
            {isEditingDesc ? (
              <div className="edit-row">
                <textarea
                  ref={descRef}
                  className="field-textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your travel project..."
                  rows={4}
                  maxLength={1000}
                />
                <div className="char-count">
                  {description.length}/1000
                </div>
                <div className="edit-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setDescription(currentDescription ?? "");
                      setIsEditingDesc(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleSaveDesc}
                    disabled={
                      description.trim() === (currentDescription ?? "") ||
                      updateTravel.isPending
                    }
                  >
                    {updateTravel.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="field-display"
                onClick={() => setIsEditingDesc(true)}
              >
                <span
                  className={`field-text ${!currentDescription ? "placeholder" : ""}`}
                >
                  {currentDescription || "Add a description..."}
                </span>
                <Pencil size={14} className="edit-icon" />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="settings-section">
            <div className="section-label">
              <Tag size={15} />
              Tags
            </div>
            {isEditingTags ? (
              <div className="edit-row">
                <div className="tags-editor">
                  {tags.map((tag) => (
                    <span key={tag} className="tag-chip editable">
                      #{tag}
                      <button
                        className="tag-remove"
                        onClick={() => removeTag(tag)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={tagInputRef}
                    className="tag-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    maxLength={30}
                  />
                </div>
                <span className="tag-hint">
                  Press Enter or comma to add a tag
                </span>
                <div className="edit-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setTags(currentTags ?? []);
                      setTagInput("");
                      setIsEditingTags(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-save"
                    onClick={handleSaveTags}
                    disabled={updateTravel.isPending}
                  >
                    {updateTravel.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="field-display"
                onClick={() => setIsEditingTags(true)}
              >
                <div className="tags-display">
                  {currentTags && currentTags.length > 0 ? (
                    currentTags.map((tag) => (
                      <span key={tag} className="tag-chip">
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <span className="field-text placeholder">Add tags...</span>
                  )}
                </div>
                <Pencil size={14} className="edit-icon" />
              </div>
            )}
          </div>

          {/* Visibility */}
          <div className="settings-section">
            <div className="section-label">
              {visibility === "PUBLIC" ? <Globe size={15} /> : <Lock size={15} />}
              Visibility
            </div>
            <div className="visibility-options">
              <button
                className={`visibility-option ${visibility === "PUBLIC" ? "active" : ""}`}
                onClick={() => handleVisibilityChange("PUBLIC")}
                disabled={updateTravel.isPending}
              >
                <div className="vis-icon-wrap public">
                  <Eye size={16} />
                </div>
                <div className="vis-info">
                  <span className="vis-title">Public</span>
                  <span className="vis-desc">Anyone can view this project</span>
                </div>
              </button>
              <button
                className={`visibility-option ${visibility === "PRIVATE" ? "active" : ""}`}
                onClick={() => handleVisibilityChange("PRIVATE")}
                disabled={updateTravel.isPending}
              >
                <div className="vis-icon-wrap private">
                  <EyeOff size={16} />
                </div>
                <div className="vis-info">
                  <span className="vis-title">Private</span>
                  <span className="vis-desc">Only members can view</span>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="settings-section danger-zone">
            <div className="section-label danger">
              <Trash2 size={15} />
              Danger Zone
            </div>
            {!showDeleteConfirm ? (
              <button
                className="btn-delete-trigger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 size={15} />
                Delete this project
              </button>
            ) : (
              <div className="delete-confirm">
                <div className="delete-warning">
                  <AlertTriangle size={16} />
                  <span>
                    This action <strong>cannot be undone</strong>. All data
                    including schedules, members, and media will be permanently
                    deleted.
                  </span>
                </div>
                <p className="delete-instruction">
                  Type <strong>{currentTitle}</strong> to confirm:
                </p>
                <input
                  className="delete-input"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={currentTitle}
                />
                <div className="delete-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteInput("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-delete-confirm"
                    disabled={!canDelete || deleteTravelMutation.isPending}
                    onClick={handleDelete}
                  >
                    {deleteTravelMutation.isPending
                      ? "Deleting..."
                      : "Delete Project"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </StyledTravelSettings>
    </Overlay>
  );
}

export default TravelSettings;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 10, 30, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease;
`;

const StyledTravelSettings = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 85vh;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  display: flex;
  flex-direction: column;

  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(99, 102, 241, 0.1);
    flex-shrink: 0;

    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #1e1b4b;
      margin: 0;
    }
  }

  .settings-body {
    overflow-y: auto;
    flex: 1;
  }

  .close-btn {
    padding: 6px;
    border: none;
    background: rgba(99, 102, 241, 0.08);
    border-radius: 10px;
    color: #6366f1;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(99, 102, 241, 0.15);
    }
  }

  .settings-section {
    padding: 20px 24px;
    border-bottom: 1px solid rgba(99, 102, 241, 0.08);

    &:last-child {
      border-bottom: none;
    }
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #4f46e5;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;

    &.danger {
      color: #ef4444;
    }
  }

  /* Field display (클릭하여 편집) */
  .field-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 12px;
    border: 1px solid rgba(99, 102, 241, 0.15);
    cursor: pointer;
    transition: all 0.2s;
    gap: 12px;

    &:hover {
      border-color: rgba(99, 102, 241, 0.3);
      background: rgba(99, 102, 241, 0.03);

      .edit-icon {
        opacity: 1;
      }
    }
  }

  .field-text {
    font-size: 14px;
    font-weight: 500;
    color: #1e1b4b;
    flex: 1;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;

    &.placeholder {
      color: #a5b4fc;
      font-weight: 400;
    }
  }

  .edit-icon {
    color: #a5b4fc;
    opacity: 0;
    transition: opacity 0.2s;
    flex-shrink: 0;
  }

  /* Edit row */
  .edit-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .field-input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #1e1b4b;
    outline: none;
    background: rgba(139, 92, 246, 0.03);
    transition: border-color 0.2s;
    box-sizing: border-box;

    &:focus {
      border-color: #6366f1;
    }
  }

  .field-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 400;
    color: #1e1b4b;
    outline: none;
    background: rgba(139, 92, 246, 0.03);
    transition: border-color 0.2s;
    box-sizing: border-box;
    resize: vertical;
    min-height: 80px;
    font-family: inherit;
    line-height: 1.6;

    &:focus {
      border-color: #6366f1;
    }
  }

  .char-count {
    text-align: right;
    font-size: 11px;
    color: #a5b4fc;
  }

  .edit-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .btn-cancel {
    padding: 8px 16px;
    border: 1px solid rgba(99, 102, 241, 0.2);
    background: transparent;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #6366f1;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(99, 102, 241, 0.05);
    }
  }

  .btn-save {
    padding: 8px 20px;
    border: none;
    background: #6366f1;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #4f46e5;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* Tags */
  .tags-display {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
  }

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(139, 92, 246, 0.1);
    color: #4f46e5;
    font-size: 13px;
    font-weight: 500;

    &.editable {
      padding-right: 6px;
    }
  }

  .tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border: none;
    background: rgba(99, 102, 241, 0.15);
    border-radius: 50%;
    color: #4f46e5;
    cursor: pointer;
    transition: all 0.15s;
    padding: 0;

    &:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
  }

  .tags-editor {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 14px;
    border: 2px solid #8b5cf6;
    border-radius: 12px;
    background: rgba(139, 92, 246, 0.03);
    min-height: 44px;
    align-items: center;
  }

  .tag-input {
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #1e1b4b;
    min-width: 80px;
    flex: 1;

    &::placeholder {
      color: #a5b4fc;
    }
  }

  .tag-hint {
    font-size: 11px;
    color: #a5b4fc;
  }

  /* Visibility */
  .visibility-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .visibility-option {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border: 1.5px solid rgba(99, 102, 241, 0.12);
    border-radius: 14px;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    width: 100%;

    &:hover {
      border-color: rgba(99, 102, 241, 0.25);
      background: rgba(99, 102, 241, 0.03);
    }

    &.active {
      border-color: #8b5cf6;
      background: rgba(139, 92, 246, 0.06);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .vis-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.public {
      background: rgba(76, 175, 80, 0.1);
      color: #4caf50;
    }

    &.private {
      background: rgba(158, 158, 158, 0.12);
      color: #757575;
    }
  }

  .vis-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .vis-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e1b4b;
  }

  .vis-desc {
    font-size: 12px;
    color: #6366f1;
  }

  /* Danger zone */
  .danger-zone {
    background: rgba(239, 68, 68, 0.02);
    border-radius: 0 0 20px 20px;
  }

  .btn-delete-trigger {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 12px;
    background: transparent;
    color: #ef4444;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(239, 68, 68, 0.08);
      border-color: rgba(239, 68, 68, 0.5);
    }
  }

  .delete-confirm {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .delete-warning {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(239, 68, 68, 0.06);
    border-radius: 12px;
    color: #dc2626;
    font-size: 13px;
    line-height: 1.5;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }

  .delete-instruction {
    font-size: 13px;
    color: #374151;
    margin: 0;

    strong {
      color: #1e1b4b;
      font-weight: 600;
    }
  }

  .delete-input {
    width: 100%;
    padding: 10px 14px;
    border: 1.5px solid rgba(239, 68, 68, 0.3);
    border-radius: 10px;
    font-size: 14px;
    color: #1e1b4b;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;

    &:focus {
      border-color: #ef4444;
    }
  }

  .delete-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .btn-delete-confirm {
    padding: 8px 20px;
    border: none;
    background: #ef4444;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      background: #dc2626;
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }
`;
