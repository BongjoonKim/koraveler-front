import styled from "styled-components";
import { Check, Play } from "lucide-react";
import { TravelMedia } from "../../../../../../types/travel/travelTypes";

export interface MediaGridProps {
  media: TravelMedia[];
  isSelectMode: boolean;
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onMediaClick: (media: TravelMedia) => void;
}

function MediaGrid({
  media,
  isSelectMode,
  selectedIds,
  onSelect,
  onMediaClick,
}: MediaGridProps) {
  const isVideo = (mimeType: string) => mimeType.startsWith("video/");

  const handleClick = (item: TravelMedia) => {
    if (isSelectMode) {
      onSelect(item.id);
    } else {
      onMediaClick(item);
    }
  };

  return (
    <StyledMediaGrid>
      <div className="media-grid">
        {media.map((item) => {
          const selected = selectedIds.has(item.id);
          return (
            <div
              key={item.id}
              className={`media-cell ${selected ? "selected" : ""}`}
              onClick={() => handleClick(item)}
            >
              <img
                src={item.thumbnailUrl || item.fileUrl}
                alt={item.originalFileName}
                loading="lazy"
              />
              {isVideo(item.mimeType) && (
                <div className="video-overlay">
                  <div className="play-icon">
                    <Play size={20} fill="#fff" />
                  </div>
                </div>
              )}
              {isSelectMode && (
                <div
                  className={`select-checkbox ${selected ? "checked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.id);
                  }}
                >
                  {selected && <Check size={14} color="#fff" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </StyledMediaGrid>
  );
}

export default MediaGrid;

const StyledMediaGrid = styled.div`
  .media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
  }

  .media-cell {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.25s ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15);
    }

    &.selected {
      border-color: #8b5cf6;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .video-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }

  .play-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(139, 92, 246, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 2px;
  }

  .select-checkbox {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 2;

    &.checked {
      background: #8b5cf6;
      border-color: #8b5cf6;
    }
  }

  @media screen and (max-width: 600px) {
    .media-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 4px;
    }

    .media-cell {
      border-radius: 8px;
    }
  }
`;
