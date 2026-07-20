import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { ArrowLeft, FileUp, MapPin, Plus, RotateCcw, Save, X } from "lucide-react";
import KoreaMap from "../../../../common/widget/maps/KoreaMap";
import { homeTokens } from "../../MainPage/MainBody/homeTokens";
import { useTravelMap } from "./useTravelMap";
import TimelineImportModal from "./TimelineImportModal";
import PlaceSearchModal from "./PlaceSearchModal";
import {
  KOREA_MAP_REGIONS,
  KoreaMapRegion,
} from "../../../../constants/koreaMapRegions";

const t = homeTokens;

const TravelMap: React.FC = () => {
  const {
    travel,
    isLoading,
    canEdit,
    selectedCodes,
    selectedRegions,
    toggleRegion,
    addRegions,
    selectedPlaces,
    addPlace,
    removePlace,
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

  const [importOpen, setImportOpen] = useState(false);
  const [placeSearchOpen, setPlaceSearchOpen] = useState(false);
  // 색칠된 지역 클릭 시 그 지역의 다녀간 장소를 보여주는 패널
  const [regionDetail, setRegionDetail] = useState<KoreaMapRegion | null>(null);

  const regionDetailPlaces = useMemo(
    () =>
      regionDetail
        ? selectedPlaces.filter((p) => p.regionCode === regionDetail.code)
        : [],
    [regionDetail, selectedPlaces]
  );

  const addedPlaceIds = useMemo(
    () => new Set(selectedPlaces.map((p) => p.id).filter(Boolean) as string[]),
    [selectedPlaces]
  );
  const regionNameByCode = useMemo(
    () => new Map(KOREA_MAP_REGIONS.map((r) => [r.code, r.nameEn])),
    []
  );

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
              ? "Regions are colored automatically from the places you add. Tap a colored region to see what you visited there."
              : "View-only — tap a colored region to see the places visited there."}
          </StatsHint>
        </StatsCard>

        {/* 다녀온 장소 */}
        {(canEdit || selectedPlaces.length > 0) && (
          <PlacesCard>
            <PlacesHeader>
              <PlacesTitle>
                Places you visited
                {selectedPlaces.length > 0 && <em>{selectedPlaces.length}</em>}
              </PlacesTitle>
              {canEdit && (
                <PlacesActions>
                  <AddPlaceButton onClick={() => setPlaceSearchOpen(true)}>
                    <Plus size={13} />
                    Add place
                  </AddPlaceButton>
                  <ImportButton onClick={() => setImportOpen(true)}>
                    <FileUp size={13} />
                    Google Timeline
                  </ImportButton>
                </PlacesActions>
              )}
            </PlacesHeader>
            {selectedPlaces.length === 0 ? (
              <PlacesEmpty>
                Search the places you visited — their regions are colored on the map
                automatically.
              </PlacesEmpty>
            ) : (
              <PlaceChips>
                {selectedPlaces.map((p, i) => (
                  <PlaceChip key={p.id ?? `${p.name}-${i}`}>
                    <MapPin size={11} />
                    <span>
                      {p.name}
                      {p.regionCode && regionNameByCode.has(p.regionCode) && (
                        <em> · {regionNameByCode.get(p.regionCode)}</em>
                      )}
                    </span>
                    {canEdit && (
                      <button onClick={() => removePlace(p)} aria-label={`Remove ${p.name}`}>
                        <X size={11} />
                      </button>
                    )}
                  </PlaceChip>
                ))}
              </PlaceChips>
            )}
          </PlacesCard>
        )}

        {/* 지도 — 직접 색칠 없음, 색칠된 지역 클릭 시 다녀간 장소 표시 */}
        <MapCard>
          <KoreaMap
            visitedCodes={selectedCodes}
            onRegionClick={setRegionDetail}
            clickVisitedOnly
          />
          {regionDetail && (
            <RegionDetail>
              <RegionDetailHeader>
                <strong>
                  {regionDetail.nameEn} <small>{regionDetail.nameKo}</small>
                </strong>
                <button onClick={() => setRegionDetail(null)} aria-label="Close region detail">
                  <X size={13} />
                </button>
              </RegionDetailHeader>
              {regionDetailPlaces.length > 0 ? (
                <RegionDetailList>
                  {regionDetailPlaces.map((p, i) => (
                    <li key={p.id ?? `${p.name}-${i}`}>
                      <MapPin size={12} />
                      <div>
                        <span>{p.name}</span>
                        {(p.categoryEn || p.category || p.address) && (
                          <em>
                            {p.categoryEn || p.category}
                            {p.address ? ` · ${p.address}` : ""}
                          </em>
                        )}
                      </div>
                    </li>
                  ))}
                </RegionDetailList>
              ) : (
                <RegionDetailEmpty>
                  No saved places here — this region was added from a timeline import.
                </RegionDetailEmpty>
              )}
            </RegionDetail>
          )}
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

      <PlaceSearchModal
        open={placeSearchOpen}
        onClose={() => setPlaceSearchOpen(false)}
        addedIds={addedPlaceIds}
        onSelect={addPlace}
      />

      <TimelineImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        travelStartDate={travel?.startDate}
        travelEndDate={travel?.endDate}
        existingCodes={selectedCodes}
        onApply={addRegions}
      />
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

const PlacesCard = styled.div`
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlacesHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const PlacesTitle = styled.h2`
  margin: 0;
  font-family: ${t.font.serif};
  font-size: 16px;
  font-weight: 700;
  color: ${t.color.text};

  em {
    margin-left: 8px;
    font-style: normal;
    font-family: ${t.font.sans};
    font-size: 12px;
    font-weight: 600;
    color: ${t.color.accent};
  }
`;

const PlacesActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddPlaceButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  background: ${t.color.accentStrong};
  border: none;
  border-radius: ${t.radius.pill};
  font-size: 12.5px;
  font-weight: 600;
  color: ${t.color.text};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: ${t.color.accent};
    color: ${t.color.bg};
  }
`;

const ImportButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  background: none;
  border: 1px solid ${t.color.border2};
  border-radius: ${t.radius.pill};
  font-size: 12.5px;
  color: ${t.color.textSoft};
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    border-color: ${t.color.accent};
    color: ${t.color.text};
  }
`;

const PlacesEmpty = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${t.color.textFaint};
`;

const PlaceChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

const PlaceChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.pill};
  font-size: 12.5px;
  color: ${t.color.textSoft};

  svg:first-child {
    color: ${t.color.accent};
    flex-shrink: 0;
  }

  em {
    font-style: normal;
    color: ${t.color.textMuted};
  }

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

const MapCard = styled.div`
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 18px;
`;

const RegionDetail = styled.div`
  margin-top: 14px;
  padding: 14px 16px;
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.md};
`;

const RegionDetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;

  strong {
    font-family: ${t.font.serif};
    font-size: 15px;
    color: ${t.color.text};

    small {
      margin-left: 6px;
      font-family: ${t.font.sans};
      font-size: 12px;
      font-weight: 400;
      color: ${t.color.textMuted};
    }
  }

  button {
    display: flex;
    padding: 4px;
    background: none;
    border: 1px solid ${t.color.border};
    border-radius: ${t.radius.pill};
    color: ${t.color.textMuted};
    cursor: pointer;

    &:hover {
      color: ${t.color.text};
    }
  }
`;

const RegionDetailList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 8px;

    svg {
      margin-top: 2px;
      color: ${t.color.accent};
      flex-shrink: 0;
    }

    div {
      display: flex;
      flex-direction: column;
      gap: 1px;
      min-width: 0;
    }

    span {
      font-size: 13px;
      font-weight: 600;
      color: ${t.color.text};
    }

    em {
      font-style: normal;
      font-size: 11.5px;
      color: ${t.color.textMuted};
    }
  }
`;

const RegionDetailEmpty = styled.p`
  margin: 0;
  font-size: 12.5px;
  color: ${t.color.textFaint};
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
