import { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import {
  Image as ImageIcon,
  Plus,
  CheckSquare,
  Download,
  Trash2,
  X,
} from "lucide-react";
import {
  useGetTravelMedia,
  useDeleteTravelMedia,
  useDownloadTravelMedia,
} from "../../../../../hooks/useTravelQueries";
import { TravelMedia } from "../../../../../types/travel/travelTypes";
import MediaGrid from "./MediaGrid";
import MediaUploadZone from "./MediaUploadZone";
import MediaLightbox from "./MediaLightbox";

export interface TravelAlbumProps {
  travelId: string;
}

function TravelAlbum({ travelId }: TravelAlbumProps) {
  const { data: media = [], isLoading } = useGetTravelMedia(travelId);
  const deleteMutation = useDeleteTravelMedia();
  const { downloadSingle, downloadBatch } = useDownloadTravelMedia();

  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<TravelMedia | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Selection handlers
  const handleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === media.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(media.map((m) => m.id)));
    }
  }, [selectedIds.size, media]);

  const toggleSelectMode = useCallback(() => {
    setIsSelectMode((prev) => {
      if (prev) setSelectedIds(new Set());
      return !prev;
    });
  }, []);

  // Media click
  const handleMediaClick = useCallback((item: TravelMedia) => {
    setLightboxMedia(item);
  }, []);

  // Lightbox navigation
  const handleLightboxNav = useCallback(
    (direction: "prev" | "next") => {
      if (!lightboxMedia) return;
      const currentIndex = media.findIndex((m) => m.id === lightboxMedia.id);
      const nextIndex =
        direction === "prev" ? currentIndex - 1 : currentIndex + 1;
      if (nextIndex >= 0 && nextIndex < media.length) {
        setLightboxMedia(media[nextIndex]);
      }
    },
    [lightboxMedia, media]
  );

  // Delete
  const handleDelete = useCallback(
    async (mediaId: string) => {
      try {
        await deleteMutation.mutateAsync({ travelId, mediaId });
        if (lightboxMedia?.id === mediaId) {
          setLightboxMedia(null);
        }
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(mediaId);
          return next;
        });
      } catch (err) {
        console.error("Delete failed:", err);
      }
    },
    [travelId, deleteMutation, lightboxMedia]
  );

  // Batch download
  const handleBatchDownload = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setIsDownloading(true);
    try {
      const ids = Array.from(selectedIds);
      if (ids.length === 1) {
        const item = media.find((m) => m.id === ids[0]);
        if (item) {
          await downloadSingle(travelId, item.id, item.originalFileName);
        }
      } else {
        await downloadBatch(travelId, ids);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  }, [selectedIds, media, travelId, downloadSingle, downloadBatch]);

  // Batch delete
  const handleBatchDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      try {
        await deleteMutation.mutateAsync({ travelId, mediaId: id });
      } catch (err) {
        console.error(`Delete failed for ${id}:`, err);
      }
    }
    setSelectedIds(new Set());
  }, [selectedIds, travelId, deleteMutation]);

  return (
    <StyledTravelAlbum>
      <div className="dash-section">
        {/* Header */}
        <div className="section-header">
          <h3 className="section-title">
            <ImageIcon size={16} />
            Album
            {media.length > 0 && (
              <span className="media-count">{media.length}</span>
            )}
          </h3>
          <div className="album-actions">
            {isSelectMode && (
              <>
                <button
                  className="action-btn select-all-btn"
                  onClick={handleSelectAll}
                >
                  {selectedIds.size === media.length ? "Deselect" : "All"}
                </button>
                {selectedIds.size > 0 && (
                  <>
                    <button
                      className="action-btn download-btn"
                      onClick={handleBatchDownload}
                      disabled={isDownloading}
                    >
                      <Download size={15} />
                      <span>{selectedIds.size}</span>
                    </button>
                    <button
                      className="action-btn delete-action-btn"
                      onClick={handleBatchDelete}
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
                <button className="action-btn close-select" onClick={toggleSelectMode}>
                  <X size={15} />
                </button>
              </>
            )}
            {!isSelectMode && media.length > 0 && (
              <button className="action-btn" onClick={toggleSelectMode}>
                <CheckSquare size={15} />
              </button>
            )}
            <button
              className="section-action"
              onClick={() => setIsUploadOpen((prev) => !prev)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Upload Zone */}
        <AnimatePresence>
          {isUploadOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
              <MediaUploadZone
                travelId={travelId}
                onUploadComplete={() => setIsUploadOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {isLoading ? (
          <div className="album-loading">
            <div className="loading-spinner" />
            <span>Loading photos...</span>
          </div>
        ) : media.length === 0 ? (
          <div className="empty-album">
            <ImageIcon size={32} />
            <p>No photos yet</p>
            <span>Upload your first travel photo</span>
          </div>
        ) : (
          <MediaGrid
            media={media}
            isSelectMode={isSelectMode}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onMediaClick={handleMediaClick}
          />
        )}
      </div>

      {/* Lightbox */}
      <MediaLightbox
        isOpen={!!lightboxMedia}
        onClose={() => setLightboxMedia(null)}
        media={lightboxMedia}
        allMedia={media}
        travelId={travelId}
        onNavigate={handleLightboxNav}
        onDelete={handleDelete}
      />
    </StyledTravelAlbum>
  );
}

export default TravelAlbum;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledTravelAlbum = styled.div`
  .dash-section {
    padding: 1.25rem 0;
    border-bottom: 1px solid rgba(99, 102, 241, 0.12);
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1e1b4b;
  }

  .media-count {
    font-size: 12px;
    font-weight: 600;
    color: #8b5cf6;
    background: rgba(139, 92, 246, 0.1);
    padding: 1px 8px;
    border-radius: 10px;
  }

  .album-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.8);
    color: #4f46e5;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.1);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .download-btn {
    background: rgba(139, 92, 246, 0.08);
    border-color: rgba(139, 92, 246, 0.25);
    color: #7c3aed;

    &:hover {
      background: rgba(139, 92, 246, 0.15);
    }
  }

  .delete-action-btn {
    border-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.08);
    }
  }

  .close-select {
    border: none;
    background: transparent;
    color: #a5b4fc;

    &:hover {
      color: #6366f1;
    }
  }

  .select-all-btn {
    font-size: 11px;
    padding: 4px 8px;
  }

  .section-action {
    padding: 6px;
    border: 1.5px dashed rgba(99, 102, 241, 0.35);
    border-radius: 10px;
    background: transparent;
    color: #a5b4fc;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: rgba(139, 92, 246, 0.5);
      color: #8b5cf6;
      background: rgba(139, 92, 246, 0.05);
    }
  }

  .album-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 2rem 1rem;
    color: #6366f1;
    font-size: 14px;
  }

  .loading-spinner {
    width: 28px;
    height: 28px;
    border: 3px solid rgba(139, 92, 246, 0.2);
    border-top-color: #8b5cf6;
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
  }

  .empty-album {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 2.5rem 1rem;
    color: #a5b4fc;
    text-align: center;

    p {
      font-size: 15px;
      font-weight: 500;
      color: #6366f1;
    }

    span {
      font-size: 13px;
      color: #a5b4fc;
    }
  }
`;
