import React, { useRef } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { FileUp, Footprints, MapPin, ShieldCheck, X } from "lucide-react";
import { homeTokens } from "../../MainPage/MainBody/homeTokens";
import { useTimelineImport } from "./useTimelineImport";

const t = homeTokens;

interface TimelineImportModalProps {
  open: boolean;
  onClose: () => void;
  travelStartDate?: string;
  travelEndDate?: string;
  /** 이미 지도에 선택돼 있는 지역 코드 (뱃지 표시용) */
  existingCodes: Set<string>;
  onApply: (codes: string[]) => void;
}

/**
 * 구글 타임라인 JSON 가져오기 모달.
 * transform 조상이 position:fixed 를 깨뜨리므로 반드시 document.body 로 portal.
 */
const TimelineImportModal: React.FC<TimelineImportModalProps> = ({
  open,
  onClose,
  travelStartDate,
  travelEndDate,
  existingCodes,
  onApply,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    fileName,
    isReading,
    parseError,
    readFile,
    totalPointCount,
    filteredPointCount,
    hasTravelDates,
    useDateFilter,
    setUseDateFilter,
    includePath,
    setIncludePath,
    candidates,
    excludedCodes,
    toggleExclude,
    selectedCodes,
    reset,
  } = useTimelineImport(travelStartDate, travelEndDate);

  if (!open) return null;

  const close = () => {
    reset();
    onClose();
  };

  const handleApply = () => {
    onApply(selectedCodes);
    reset();
    onClose();
  };

  const newCount = selectedCodes.filter((c) => !existingCodes.has(c)).length;
  const dateLabel =
    travelStartDate && travelEndDate
      ? `${travelStartDate.slice(0, 10)} – ${travelEndDate.slice(0, 10)}`
      : (travelStartDate ?? travelEndDate ?? "").slice(0, 10);

  return createPortal(
    <Overlay onClick={close}>
      <Panel onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <PanelHeader>
          <div>
            <PanelEyebrow>Google Timeline</PanelEyebrow>
            <PanelTitle>Import visited regions</PanelTitle>
          </div>
          <CloseButton onClick={close} aria-label="Close">
            <X size={16} />
          </CloseButton>
        </PanelHeader>

        <PrivacyNote>
          <ShieldCheck size={13} />
          Your file is read only in this browser — location data is never uploaded.
        </PrivacyNote>

        {!fileName ? (
          <>
            <DropArea onClick={() => fileInputRef.current?.click()} disabled={isReading}>
              <FileUp size={22} />
              <strong>{isReading ? "Reading…" : "Choose your Timeline JSON"}</strong>
              <span>
                Google Maps app → Settings → Location data export ("Timeline.json"). Old
                Takeout "Semantic Location History" files also work.
              </span>
            </DropArea>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f);
                e.target.value = "";
              }}
            />
            {parseError && <ErrorNote>{parseError}</ErrorNote>}
          </>
        ) : (
          <>
            <FileSummary>
              <strong>{fileName}</strong>
              <span>
                {totalPointCount.toLocaleString()} location records
                {hasTravelDates && useDateFilter
                  ? ` · ${filteredPointCount.toLocaleString()} within trip dates`
                  : ""}
              </span>
            </FileSummary>

            <Options>
              {hasTravelDates && (
                <OptionRow>
                  <input
                    id="tl-date-filter"
                    type="checkbox"
                    checked={useDateFilter}
                    onChange={(e) => setUseDateFilter(e.target.checked)}
                  />
                  <label htmlFor="tl-date-filter">
                    Only during this trip <em>({dateLabel})</em>
                  </label>
                </OptionRow>
              )}
              <OptionRow>
                <input
                  id="tl-include-path"
                  type="checkbox"
                  checked={includePath}
                  onChange={(e) => setIncludePath(e.target.checked)}
                />
                <label htmlFor="tl-include-path">
                  Include regions you only passed through <em>(driving, train…)</em>
                </label>
              </OptionRow>
            </Options>

            {candidates.length === 0 ? (
              <EmptyNote>
                No Korean regions detected
                {hasTravelDates && useDateFilter ? " within the trip dates" : ""}.
              </EmptyNote>
            ) : (
              <RegionList>
                {candidates.map((d) => {
                  const checked = !excludedCodes.has(d.region.code);
                  const already = existingCodes.has(d.region.code);
                  return (
                    <RegionRow key={d.region.code}>
                      <input
                        id={`tl-region-${d.region.code}`}
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleExclude(d.region.code)}
                      />
                      <label htmlFor={`tl-region-${d.region.code}`}>
                        <RegionName>
                          {d.region.nameEn} <small>{d.region.nameKo}</small>
                        </RegionName>
                        <RegionMeta>
                          {d.visitCount > 0 && (
                            <span>
                              <MapPin size={11} />
                              {d.visitCount} {d.visitCount === 1 ? "stay" : "stays"}
                            </span>
                          )}
                          {d.pathCount > 0 && (
                            <span>
                              <Footprints size={11} />
                              passed {d.pathCount}×
                            </span>
                          )}
                          {already && <AlreadyBadge>on map</AlreadyBadge>}
                        </RegionMeta>
                      </label>
                    </RegionRow>
                  );
                })}
              </RegionList>
            )}

            <Footer>
              <GhostButton onClick={reset}>Choose another file</GhostButton>
              <ApplyButton onClick={handleApply} disabled={selectedCodes.length === 0}>
                {newCount > 0
                  ? `Add ${newCount} ${newCount === 1 ? "region" : "regions"}`
                  : "Nothing new to add"}
              </ApplyButton>
            </Footer>
          </>
        )}
      </Panel>
    </Overlay>,
    document.body
  );
};

export default TimelineImportModal;

/* ──── Styled ──── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const Panel = styled.div`
  width: 100%;
  max-width: 520px;
  max-height: 84vh;
  display: flex;
  flex-direction: column;
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 20px;
  gap: 14px;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const PanelEyebrow = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${t.color.accent};
`;

const PanelTitle = styled.h2`
  margin: 2px 0 0;
  font-family: ${t.font.serif};
  font-size: 20px;
  font-weight: 700;
  color: ${t.color.text};
`;

const CloseButton = styled.button`
  display: flex;
  padding: 6px;
  background: none;
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.pill};
  color: ${t.color.textSoft};
  cursor: pointer;

  &:hover {
    color: ${t.color.text};
    border-color: ${t.color.border2};
  }
`;

const PrivacyNote = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  font-size: 12px;
  color: ${t.color.textFaint};
`;

const DropArea = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 20px;
  background: ${t.color.surface2};
  border: 1px dashed ${t.color.border2};
  border-radius: ${t.radius.lg};
  color: ${t.color.textSoft};
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: ${t.color.accent};
    color: ${t.color.text};
  }

  strong {
    font-size: 14px;
    color: ${t.color.text};
  }

  span {
    font-size: 12px;
    line-height: 1.5;
    color: ${t.color.textMuted};
    max-width: 380px;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ErrorNote = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: #e07a6a;
`;

const EmptyNote = styled.p`
  margin: 0;
  padding: 18px 0;
  font-size: 13px;
  color: ${t.color.textMuted};
  text-align: center;
`;

const FileSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 13.5px;
    color: ${t.color.text};
    word-break: break-all;
  }

  span {
    font-size: 12px;
    color: ${t.color.textMuted};
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.md};
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    accent-color: ${t.color.accent};
    cursor: pointer;
  }

  label {
    font-size: 13px;
    color: ${t.color.textSoft};
    cursor: pointer;

    em {
      font-style: normal;
      color: ${t.color.textFaint};
    }
  }
`;

const RegionList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.md};
`;

const RegionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;

  & + & {
    border-top: 1px solid ${t.color.border};
  }

  input {
    accent-color: ${t.color.accent};
    cursor: pointer;
  }

  label {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    cursor: pointer;
  }
`;

const RegionName = styled.span`
  font-size: 13.5px;
  color: ${t.color.text};

  small {
    margin-left: 6px;
    font-size: 12px;
    color: ${t.color.textMuted};
  }
`;

const RegionMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11.5px;
    color: ${t.color.textMuted};
  }
`;

const AlreadyBadge = styled.em`
  font-style: normal;
  font-size: 10.5px;
  padding: 2px 8px;
  background: ${t.color.badgeBg};
  border-radius: ${t.radius.pill};
  color: ${t.color.badgeText};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const GhostButton = styled.button`
  padding: 9px 14px;
  background: none;
  border: 1px solid ${t.color.border2};
  border-radius: ${t.radius.md};
  font-size: 13px;
  color: ${t.color.textSoft};
  cursor: pointer;

  &:hover {
    color: ${t.color.text};
  }
`;

const ApplyButton = styled.button`
  padding: 9px 18px;
  background: ${t.color.accentStrong};
  border: none;
  border-radius: ${t.radius.md};
  font-size: 13px;
  font-weight: 600;
  color: ${t.color.text};
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${t.color.accent};
    color: ${t.color.bg};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;
