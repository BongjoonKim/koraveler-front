import React from "react";
import styled from "styled-components";
import { ArrowLeft, MapPin, RotateCcw, Save, X } from "lucide-react";
import KoreaMap from "../../../../common/widget/maps/KoreaMap";
import { homeTokens } from "../../MainPage/MainBody/homeTokens";
import { useTravelMap } from "./useTravelMap";

const t = homeTokens;

const TravelMap: React.FC = () => {
  const {
    travel,
    isLoading,
    canEdit,
    selectedCodes,
    selectedRegions,
    toggleRegion,
    isDirty,
    handleSave,
    handleReset,
    isSaving,
    saveError,
    visitedCount,
    totalCount,
    percent,
    goBack,
  } = useTravelMap();

  return (
    <Page>
      <Inner>
        {/* 헤더 */}
        <Header>
          <BackButton onClick={goBack}>
            <ArrowLeft size={16} />
            Dashboard
          </BackButton>
          <TitleBlock>
            <Eyebrow>Korea Travel Map</Eyebrow>
            <Title>{travel?.title ?? (isLoading ? "…" : "Travel")}</Title>
            {travel?.destination && (
              <Destination>
                <MapPin size={13} />
                {travel.destination}
              </Destination>
            )}
          </TitleBlock>
        </Header>

        {/* 정복 현황 */}
        <StatsCard>
          <StatsRow>
            <StatNumber>
              {visitedCount}
              <small>/ {totalCount} regions</small>
            </StatNumber>
            <StatPercent>{percent}%</StatPercent>
          </StatsRow>
          <ProgressTrack>
            <ProgressFill style={{ width: `${percent}%` }} />
          </ProgressTrack>
          <StatsHint>
            {canEdit
              ? "Tap the cities and counties you visited on this trip."
              : "View-only — ask a project member to update the map."}
          </StatsHint>
        </StatsCard>

        {/* 지도 */}
        <MapCard>
          <KoreaMap
            visitedCodes={selectedCodes}
            onRegionClick={canEdit ? toggleRegion : undefined}
          />
        </MapCard>

        {/* 선택된 지역 칩 */}
        {selectedRegions.length > 0 && (
          <ChipsWrap>
            {selectedRegions.map((r) => (
              <Chip key={r.code}>
                {r.nameEn}
                {canEdit && (
                  <button onClick={() => toggleRegion(r)} aria-label={`Remove ${r.nameEn}`}>
                    <X size={11} />
                  </button>
                )}
              </Chip>
            ))}
          </ChipsWrap>
        )}

        {/* 저장 액션 */}
        {canEdit && (
          <ActionBar>
            {saveError && <ErrorText>Failed to save. Please try again.</ErrorText>}
            <ResetButton onClick={handleReset} disabled={!isDirty || isSaving}>
              <RotateCcw size={14} />
              Reset
            </ResetButton>
            <SaveButton onClick={handleSave} disabled={!isDirty || isSaving}>
              <Save size={14} />
              {isSaving ? "Saving…" : isDirty ? "Save Map" : "Saved"}
            </SaveButton>
          </ActionBar>
        )}
      </Inner>
    </Page>
  );
};

export default TravelMap;

/* ──── Styled ──── */

const Page = styled.div`
  flex: 1;
  width: 100%;
  background: ${t.color.bg};
  padding: 28px 16px 60px;
`;

const Inner = styled.div`
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const BackButton = styled.button`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.pill};
  font-size: 13px;
  color: ${t.color.textSoft};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: ${t.color.border2};
    color: ${t.color.text};
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Eyebrow = styled.span`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${t.color.accent};
`;

const Title = styled.h1`
  font-family: ${t.font.serif};
  font-size: 26px;
  font-weight: 700;
  color: ${t.color.text};
  margin: 0;
`;

const Destination = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: ${t.color.textMuted};
`;

const StatsCard = styled.div`
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 18px 20px;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const StatNumber = styled.span`
  font-family: ${t.font.serif};
  font-size: 30px;
  font-weight: 700;
  color: ${t.color.text};

  small {
    margin-left: 8px;
    font-family: ${t.font.sans};
    font-size: 13px;
    font-weight: 400;
    color: ${t.color.textMuted};
  }
`;

const StatPercent = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${t.color.accent};
`;

const ProgressTrack = styled.div`
  height: 6px;
  border-radius: ${t.radius.pill};
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${t.radius.pill};
  background: linear-gradient(90deg, ${t.color.accentStrong}, ${t.color.accent});
  transition: width 0.3s ease;
`;

const StatsHint = styled.p`
  margin: 10px 0 0;
  font-size: 12.5px;
  color: ${t.color.textFaint};
`;

const MapCard = styled.div`
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 18px;
`;

const ChipsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  background: ${t.color.badgeBg};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.pill};
  font-size: 12px;
  color: ${t.color.badgeText};

  button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 1px;
    color: ${t.color.textMuted};
    cursor: pointer;

    &:hover {
      color: ${t.color.text};
    }
  }
`;

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const ErrorText = styled.span`
  margin-right: auto;
  font-size: 12.5px;
  color: #e07a6a;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  background: none;
  border: 1px solid ${t.color.border2};
  border-radius: ${t.radius.md};
  font-size: 13px;
  color: ${t.color.textSoft};
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    color: ${t.color.text};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 20px;
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
