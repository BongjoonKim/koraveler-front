import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";
import { X, LayoutGrid, Eye, EyeOff, GripVertical } from "lucide-react";
import { TravelDashboardItem } from "../../../../../types/travel/travelTypes";
import { getWidgetDef } from "../../../../../constants/travelDashboardItems";
import { useUpdateTravel } from "../../../../../hooks/useTravelQueries";

export interface DashboardCustomizeProps {
  travelId: string;
  currentItems: TravelDashboardItem[]; // resolveDashboardItems() 결과
  isOpen: boolean;
  onClose: () => void;
}

function DashboardCustomize({
  travelId,
  currentItems,
  isOpen,
  onClose,
}: DashboardCustomizeProps) {
  const [items, setItems] = useState<TravelDashboardItem[]>(currentItems);
  const dragIndexRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const updateTravel = useUpdateTravel();

  // 모달이 열릴 때만 props → 로컬 상태 동기화
  useEffect(() => {
    if (isOpen) setItems(currentItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleVisible = (key: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const setDisplay = (key: string, display: "stat" | "row") => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, display } : item))
    );
  };

  // --- 드래그 순서 변경 ---
  const handleDragStart = (index: number, key: string) => {
    dragIndexRef.current = index;
    setDragging(key);
  };

  const handleDragEnter = (index: number) => {
    const from = dragIndexRef.current;
    if (from === null || from === index) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndexRef.current = index;
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragging(null);
  };

  const handleSave = async () => {
    try {
      await updateTravel.mutateAsync({
        travelId,
        reqBody: { dashboardItems: items },
      });
      onClose();
    } catch {
      // 실패 시 모달 유지 — 재시도 가능
    }
  };

  return createPortal(
    <Overlay onClick={onClose}>
      <StyledDashboardCustomize onClick={(e) => e.stopPropagation()}>
        <div className="customize-header">
          <h2>
            <LayoutGrid size={18} />
            Customize Dashboard
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <p className="customize-hint">
          Drag to reorder. Box items appear in the stats grid (max 4 per row),
          Row items stack as full-width sections.
        </p>

        <div className="customize-body">
          {items.map((item, index) => {
            const def = getWidgetDef(item.key);
            if (!def) return null;
            const ItemIcon = def.icon;
            const canChooseDisplay = def.displays.length > 1;
            return (
              <div
                key={item.key}
                className={`widget-row ${item.visible ? "" : "hidden"} ${
                  dragging === item.key ? "dragging" : ""
                }`}
                draggable
                onDragStart={() => handleDragStart(index, item.key)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={handleDragEnd}
              >
                <GripVertical size={15} className="drag-handle" />
                <ItemIcon size={16} className="widget-icon" />
                <span className="widget-label">{def.label}</span>

                {canChooseDisplay && item.visible && (
                  <div className="display-toggle">
                    <button
                      className={item.display === "stat" ? "active" : ""}
                      onClick={() => setDisplay(item.key, "stat")}
                    >
                      Box
                    </button>
                    <button
                      className={item.display === "row" ? "active" : ""}
                      onClick={() => setDisplay(item.key, "row")}
                    >
                      Row
                    </button>
                  </div>
                )}

                <button
                  className={`visible-toggle ${item.visible ? "on" : ""}`}
                  onClick={() => toggleVisible(item.key)}
                  aria-label={item.visible ? "Hide" : "Show"}
                >
                  {item.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="customize-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-save"
            onClick={handleSave}
            disabled={updateTravel.isPending}
          >
            {updateTravel.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </StyledDashboardCustomize>
    </Overlay>,
    document.body
  );
}

export default DashboardCustomize;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.65);
  animation: ${fadeIn} 0.2s ease both;
`;

const StyledDashboardCustomize = styled.div`
  display: flex;
  flex-direction: column;
  width: min(520px, 100%);
  max-height: min(680px, calc(100vh - 3rem));
  min-height: 0;
  background: #14191a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  color: #e8eaeb;
  animation: ${slideUp} 0.25s ease both;

  .customize-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px 12px;

    h2 {
      display: flex;
      align-items: center;
      gap: 9px;
      font-size: 17px;
      font-weight: 600;
      color: #ffffff;

      svg {
        color: #7fb89a;
      }
    }
  }

  .customize-hint {
    padding: 0 20px 12px;
    margin: 0;
    font-size: 12.5px;
    line-height: 1.5;
    color: #94a3a0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  }

  .close-btn {
    padding: 6px;
    border: none;
    background: transparent;
    color: #94a3a0;
    cursor: pointer;
    border-radius: 8px;

    &:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #ffffff;
    }
  }

  .customize-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 20px;
  }

  .widget-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 6px;
    transition: opacity 0.15s ease, border-color 0.15s ease;
    cursor: grab;

    &.hidden {
      opacity: 0.45;
    }

    &.dragging {
      border-color: rgba(127, 184, 154, 0.6);
      background: rgba(46, 87, 62, 0.18);
    }
  }

  .drag-handle {
    color: #5b6663;
    flex-shrink: 0;
    cursor: grab;
  }

  .widget-icon {
    color: #7fb89a;
    flex-shrink: 0;
  }

  .widget-label {
    flex: 1;
    font-size: 14px;
    color: #e8eaeb;
  }

  .display-toggle {
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    overflow: hidden;

    button {
      padding: 4px 11px;
      border: none;
      background: transparent;
      color: #94a3a0;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;

      &.active {
        background: rgba(46, 87, 62, 0.4);
        color: #b6d4c1;
      }
    }
  }

  .visible-toggle {
    padding: 6px;
    border: none;
    background: transparent;
    color: #94a3a0;
    cursor: pointer;
    border-radius: 8px;

    &.on {
      color: #7fb89a;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.07);
    }
  }

  .customize-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
  }

  .btn-cancel {
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: transparent;
    border-radius: 10px;
    color: #c7d2cc;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  .btn-save {
    padding: 8px 18px;
    border: none;
    background: #2f5743;
    border-radius: 10px;
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: #386851;
    }

    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }
`;
