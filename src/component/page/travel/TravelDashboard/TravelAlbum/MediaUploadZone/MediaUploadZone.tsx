import { useState, useRef, useCallback, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { CloudUpload, Check, AlertCircle, X } from "lucide-react";
import { useUploadTravelMedia } from "../../../../../../hooks/useTravelQueries";

interface UploadItem {
  file: File;
  id: string;
  status: "pending" | "uploading" | "done" | "error";
  preview: string;
}

export interface MediaUploadZoneProps {
  travelId: string;
  onUploadComplete: () => void;
}

function MediaUploadZone({ travelId, onUploadComplete }: MediaUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadTravelMedia();

  const addFilesToQueue = useCallback((files: File[]) => {
    const validFiles = files.filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    if (validFiles.length === 0) return;

    const newItems: UploadItem[] = validFiles.map((file) => ({
      file,
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      status: "pending" as const,
      preview: URL.createObjectURL(file),
    }));

    setUploadQueue((prev) => [...prev, ...newItems]);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files);
      addFilesToQueue(files);
    },
    [addFilesToQueue]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        addFilesToQueue(Array.from(e.target.files));
        e.target.value = "";
      }
    },
    [addFilesToQueue]
  );

  const removeFromQueue = useCallback((id: string) => {
    setUploadQueue((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  // Process upload queue
  useEffect(() => {
    const pendingItems = uploadQueue.filter((i) => i.status === "pending");
    const uploadingItems = uploadQueue.filter((i) => i.status === "uploading");

    if (pendingItems.length === 0 && uploadingItems.length === 0) {
      if (uploadQueue.length > 0 && uploadQueue.every((i) => i.status === "done" || i.status === "error")) {
        setIsUploading(false);
      }
      return;
    }

    if (uploadingItems.length >= 2) return;

    const nextItem = pendingItems[0];
    if (!nextItem) return;

    setIsUploading(true);

    setUploadQueue((prev) =>
      prev.map((i) =>
        i.id === nextItem.id ? { ...i, status: "uploading" as const } : i
      )
    );

    uploadMutation
      .mutateAsync({ travelId, file: nextItem.file })
      .then(() => {
        setUploadQueue((prev) =>
          prev.map((i) =>
            i.id === nextItem.id ? { ...i, status: "done" as const } : i
          )
        );
      })
      .catch(() => {
        setUploadQueue((prev) =>
          prev.map((i) =>
            i.id === nextItem.id ? { ...i, status: "error" as const } : i
          )
        );
      });
  }, [uploadQueue, travelId, uploadMutation]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      uploadQueue.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  const allDone =
    uploadQueue.length > 0 &&
    uploadQueue.every((i) => i.status === "done" || i.status === "error");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <StyledMediaUploadZone>
      <div
        className={`dropzone ${isDragOver ? "drag-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="file-input"
          onChange={handleFileSelect}
        />
        <CloudUpload size={32} className="dropzone-icon" />
        <p className="dropzone-text">
          Drag photos or videos here
        </p>
        <span className="dropzone-sub">or click to browse</span>
      </div>

      {uploadQueue.length > 0 && (
        <div className="upload-queue">
          {uploadQueue.map((item) => (
            <div key={item.id} className={`queue-item ${item.status}`}>
              <img
                src={item.preview}
                alt={item.file.name}
                className="queue-preview"
              />
              <div className="queue-info">
                <span className="queue-name">{item.file.name}</span>
                <span className="queue-size">
                  {formatFileSize(item.file.size)}
                </span>
              </div>
              <div className="queue-status">
                {item.status === "uploading" && (
                  <div className="upload-spinner" />
                )}
                {item.status === "done" && (
                  <Check size={16} className="status-done" />
                )}
                {item.status === "error" && (
                  <AlertCircle size={16} className="status-error" />
                )}
                {(item.status === "pending" || item.status === "error") && (
                  <button
                    className="queue-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(item.id);
                    }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {allDone && (
            <button className="done-btn" onClick={onUploadComplete}>
              Done
            </button>
          )}
        </div>
      )}
    </StyledMediaUploadZone>
  );
}

export default MediaUploadZone;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledMediaUploadZone = styled.div`
  margin-bottom: 16px;

  .dropzone {
    border: 2px dashed rgba(99, 102, 241, 0.4);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.25s ease;
    background: rgba(255, 255, 255, 0.5);

    &:hover,
    &.drag-over {
      border-color: #8b5cf6;
      border-style: solid;
      background: rgba(139, 92, 246, 0.05);
    }
  }

  .file-input {
    display: none;
  }

  .dropzone-icon {
    color: #a5b4fc;
  }

  .dropzone-text {
    font-size: 15px;
    font-weight: 500;
    color: #4f46e5;
  }

  .dropzone-sub {
    font-size: 13px;
    color: #a5b4fc;
  }

  .upload-queue {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .queue-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(99, 102, 241, 0.1);

    &.done {
      opacity: 0.7;
    }

    &.error {
      border-color: rgba(239, 68, 68, 0.2);
    }
  }

  .queue-preview {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
  }

  .queue-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .queue-name {
    font-size: 13px;
    font-weight: 500;
    color: #1e1b4b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .queue-size {
    font-size: 11px;
    color: #a5b4fc;
  }

  .queue-status {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .upload-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(139, 92, 246, 0.2);
    border-top-color: #8b5cf6;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }

  .status-done {
    color: #22c55e;
  }

  .status-error {
    color: #ef4444;
  }

  .queue-remove {
    display: flex;
    align-items: center;
    border: none;
    background: none;
    color: #a5b4fc;
    cursor: pointer;
    padding: 2px;

    &:hover {
      color: #ef4444;
    }
  }

  .done-btn {
    align-self: flex-end;
    padding: 8px 20px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    margin-top: 4px;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
  }

  @media screen and (max-width: 600px) {
    .dropzone {
      padding: 1.5rem;
    }
  }
`;
