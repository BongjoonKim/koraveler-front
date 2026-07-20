import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bike,
  Bus,
  Car,
  Check,
  FileUp,
  Footprints,
  GripVertical,
  Map as MapIcon,
  MapPin,
  Pencil,
  Plane,
  Plus,
  Search,
  Ship,
  Train,
  TrainFront,
  TramFront,
  Trash2,
  X,
} from "lucide-react";
import MapInfo from "../../../../common/widget/maps/MapInfo";
import KoreaMap from "../../../../common/widget/maps/KoreaMap";
import { MapController } from "../../../../types/maps/mapTypes";
import {
  useGetMyTravels,
  useGetTravel,
  useUpdateTravelPlaces,
  useUpdateTravelRegions,
} from "../../../../hooks/useTravelQueries";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import { TransportMode, VisitedPlace } from "../../../../types/travel/travelTypes";
import { PlaceItem } from "../../../../types/place/placeTypes";
import { KoreaMapRegion } from "../../../../constants/koreaMapRegions";
import {
  filterByDateRange,
  parseGoogleTimeline,
  TimelineParseError,
} from "../../../../utils/googleTimelineParser";
import { buildCourseDraft, CourseDraftStop } from "../../../../utils/timelineCourse";
import { locateRegion } from "../../../../utils/koreaRegionLocator";
import PlaceSearchModal from "../TravelMap/PlaceSearchModal";
import { homeTokens } from "../../MainPage/MainBody/homeTokens";

const t = homeTokens;

// 구글 타임라인 수준의 다양한 이동 수단 (TRANSIT 은 레거시 저장값 표시용)
const TRANSPORT_MODES: { mode: TransportMode; label: string; icon: typeof Car }[] = [
  { mode: "WALK", label: "Walk", icon: Footprints },
  { mode: "BICYCLE", label: "Bicycle", icon: Bike },
  { mode: "CAR", label: "Car", icon: Car },
  { mode: "BUS", label: "Bus", icon: Bus },
  { mode: "SUBWAY", label: "Subway", icon: TrainFront },
  { mode: "TRAIN", label: "Train", icon: Train },
  { mode: "TRAM", label: "Tram", icon: TramFront },
  { mode: "FERRY", label: "Ferry", icon: Ship },
  { mode: "FLIGHT", label: "Flight", icon: Plane },
];

function transportIcon(mode?: TransportMode) {
  if (mode === "TRANSIT") return Train; // 레거시 값 호환
  return TRANSPORT_MODES.find((m) => m.mode === mode)?.icon ?? Car;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Triple 식 번호 핀 (naver 마커 icon = HTML content) */
function numberedPinHtml(n: number, active: boolean): string {
  const bg = active ? "#3a9d6e" : "#2e7d52";
  return `
    <div style="
      width: 30px; height: 30px; border-radius: 50% 50% 50% 4px;
      background: ${bg}; border: 2px solid #f3f4f1;
      display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 13px; font-weight: 700;
      font-family: 'Noto Sans KR', sans-serif;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    ">${n}</div>`;
}

/* ── 구간 이동 정보 (이동 수단 + 소요 시간, 수동 입력) ── */
interface LegRowProps {
  place: VisitedPlace; // 구간의 도착 장소 (이동 정보가 여기 저장됨)
  canEdit: boolean;
  saving: boolean;
  onSave: (mode: TransportMode, minutes: number | null) => void;
}

const LegRow: React.FC<LegRowProps> = ({ place, canEdit, saving, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState<TransportMode>(place.transportMode ?? "CAR");
  const [minutesText, setMinutesText] = useState(
    place.durationMinutes != null ? String(place.durationMinutes) : ""
  );

  const hasLeg = !!place.transportMode || place.durationMinutes != null;
  const Icon = transportIcon(place.transportMode);

  const startEdit = () => {
    setMode(place.transportMode ?? "CAR");
    setMinutesText(place.durationMinutes != null ? String(place.durationMinutes) : "");
    setEditing(true);
  };

  const confirm = () => {
    const minutes = parseInt(minutesText, 10);
    onSave(mode, isFinite(minutes) && minutes > 0 ? minutes : null);
    setEditing(false);
  };

  if (editing) {
    return (
      <LegWrap>
        <LegEditor>
          {TRANSPORT_MODES.map(({ mode: m, label, icon: MIcon }) => (
            <ModeButton
              key={m}
              $active={mode === m}
              onClick={() => setMode(m)}
              title={label}
              aria-label={label}
            >
              <MIcon size={13} />
            </ModeButton>
          ))}
          <MinutesInput
            type="number"
            min={1}
            value={minutesText}
            onChange={(e) => setMinutesText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirm();
              if (e.key === "Escape") setEditing(false);
            }}
            placeholder="30"
            autoFocus
          />
          <MinutesUnit>min</MinutesUnit>
          <LegIconButton onClick={confirm} aria-label="Save travel time">
            <Check size={13} />
          </LegIconButton>
          <LegIconButton onClick={() => setEditing(false)} aria-label="Cancel">
            <X size={13} />
          </LegIconButton>
        </LegEditor>
      </LegWrap>
    );
  }

  return (
    <LegWrap>
      {hasLeg ? (
        <LegChip
          as={canEdit ? "button" : "span"}
          onClick={canEdit ? startEdit : undefined}
          $clickable={canEdit}
          disabled={saving}
        >
          <Icon size={12} />
          {place.durationMinutes != null ? formatDuration(place.durationMinutes) : "—"}
          {canEdit && <Pencil size={10} />}
        </LegChip>
      ) : canEdit ? (
        <AddLegButton onClick={startEdit} disabled={saving}>
          <Plus size={11} />
          travel time
        </AddLegButton>
      ) : (
        <LegSpacer />
      )}
    </LegWrap>
  );
};

/* ── 드래그 가능한 코스 항목 (구간 leg + 장소 — leg 는 도착 장소와 함께 이동) ── */
interface CoursePlaceItemProps {
  place: VisitedPlace;
  index: number;
  active: boolean;
  dragging: boolean;
  canEdit: boolean;
  saving: boolean;
  onFocus: () => void;
  onSaveLeg: (mode: TransportMode, minutes: number | null) => void;
  onDragStart: (index: number, e: React.PointerEvent) => void;
}

const CoursePlaceItem: React.FC<CoursePlaceItemProps> = ({
  place,
  index,
  active,
  dragging,
  canEdit,
  saving,
  onFocus,
  onSaveLeg,
  onDragStart,
}) => {
  return (
    <CourseItemWrap data-course-item $dragging={dragging}>
      {index > 0 && (
        <LegRow place={place} canEdit={canEdit} saving={saving} onSave={onSaveLeg} />
      )}
      <TimelineItem $active={active} onClick={onFocus}>
        <OrderBadge $active={active}>{index + 1}</OrderBadge>
        <ItemBody>
          <ItemName>{place.name}</ItemName>
          {(place.categoryEn || place.category) && (
            <ItemMeta>{place.categoryEn || place.category}</ItemMeta>
          )}
          {place.address && (
            <ItemAddress>
              <MapPin size={10} />
              {place.address}
            </ItemAddress>
          )}
        </ItemBody>
        {canEdit && (
          <DragHandle
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => onDragStart(index, e)}
            aria-label={`Reorder ${place.name}`}
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </DragHandle>
        )}
      </TimelineItem>
    </CourseItemWrap>
  );
};

type CourseTab = "course" | "map";

/** 초안 정차지 + 사용자가 검색으로 붙인 장소 */
interface DraftStopWithPlace extends CourseDraftStop {
  place?: PlaceItem;
}

function formatStayRange(s: CourseDraftStop): string {
  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "?";
  return `${fmt(s.arrival)} – ${fmt(s.departure)}`;
}

/**
 * Travel Course — 다녀온 장소를 트리플처럼 번호 타임라인 + 네이버 지도 코스로 표시.
 * 구간별 이동 수단·소요 시간은 사용자가 수동 입력 (경로 API 미연동).
 * "Korea Map" 탭은 이 프로젝트가 아니라 내 모든 프로젝트의 장소·지역을 합산해 보여준다.
 */
const TravelCourse: React.FC = () => {
  const { travelId } = useParams<{ travelId: string }>();
  const navigate = useNavigate();
  const { data: travel, isLoading } = useGetTravel(travelId);
  const { data: currentUser } = useCurrentUser();
  const { data: myTravels } = useGetMyTravels(0, 100);
  const updatePlaces = useUpdateTravelPlaces();
  const updateRegions = useUpdateTravelRegions();

  const [tab, setTab] = useState<CourseTab>("course");
  const [controller, setController] = useState<MapController | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const controllerRef = useRef<MapController | null>(null);
  // 지도 fitBounds 1회 실행 가드 (초안 로드/해제 시 리셋)
  const fittedRef = useRef(false);
  // 전체 지도 탭: 지역 클릭 → 전 프로젝트 장소 패널
  const [regionDetail, setRegionDetail] = useState<KoreaMapRegion | null>(null);

  // 편집 권한: TravelMap/Dashboard 와 동일 기준 (VIEWER 제외 멤버)
  const canEdit = useMemo(() => {
    const me = travel?.members?.find((m) => m.userId === currentUser?.id);
    return !!me && me.role !== "VIEWER";
  }, [travel?.members, currentUser?.id]);

  // 좌표 있는 장소만 코스에 포함 (저장 순서 = 코스 순서)
  const places = useMemo(
    () => (travel?.visitedPlaces ?? []).filter((p) => p.lat != null && p.lng != null),
    [travel?.visitedPlaces]
  );
  // 좌표 없는 장소는 코스에 안 보이지만 저장 시 목록 뒤에 보존
  const hiddenPlaces = useMemo(
    () => (travel?.visitedPlaces ?? []).filter((p) => p.lat == null || p.lng == null),
    [travel?.visitedPlaces]
  );

  // 드래그 정렬용 로컬 순서 (드래그 중 즉시 반영, 드롭 시 저장)
  const [ordered, setOrdered] = useState<VisitedPlace[]>([]);
  const orderedRef = useRef<VisitedPlace[]>([]);
  useEffect(() => {
    setOrdered(places);
    orderedRef.current = places;
  }, [places]);
  // 드롭 시 순서 저장 (실제로 바뀐 경우만)
  const saveOrder = () => {
    if (!travelId || !travel?.visitedPlaces) return;
    const next = [...orderedRef.current, ...hiddenPlaces];
    const cur = travel.visitedPlaces;
    const changed = next.length !== cur.length || next.some((p, i) => p !== cur[i]);
    if (changed) updatePlaces.mutate({ travelId, reqBody: { places: next } });
  };

  /* ── 자체 포인터 기반 드래그 재정렬 (핸들에서 시작, 포인터 y 가 항목 중앙을 넘으면 교환) ── */
  const listRef = useRef<HTMLDivElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const startDrag = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    setDragIndex(index);
    dragIndexRef.current = index;

    const onMove = (ev: PointerEvent) => {
      const cur = dragIndexRef.current;
      const listEl = listRef.current;
      if (cur == null || !listEl) return;
      const items = Array.from(listEl.querySelectorAll<HTMLElement>("[data-course-item]"));
      // 포인터 y 가 어느 항목의 중앙을 넘었는지로 목표 인덱스 결정
      let target = cur;
      items.forEach((el, i) => {
        if (i === cur) return;
        const r = el.getBoundingClientRect();
        const mid = r.top + r.height / 2;
        if (i < cur && ev.clientY < mid) target = Math.min(target, i);
        if (i > cur && ev.clientY > mid) target = Math.max(target, i);
      });
      if (target !== cur) {
        const next = [...orderedRef.current];
        const [moved] = next.splice(cur, 1);
        next.splice(target, 0, moved);
        orderedRef.current = next;
        setOrdered(next);
        dragIndexRef.current = target;
        setDragIndex(target);
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      dragIndexRef.current = null;
      setDragIndex(null);
      saveOrder();
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
  };

  // 구간 이동 정보 저장 — 도착 장소에 기록, 전체 교체 PUT (현재 로컬 순서 기준)
  const saveLeg = (destPlace: VisitedPlace, mode: TransportMode, minutes: number | null) => {
    if (!travelId) return;
    const next = [
      ...orderedRef.current.map((p) =>
        p === destPlace
          ? { ...p, transportMode: mode, durationMinutes: minutes ?? undefined }
          : p
      ),
      ...hiddenPlaces,
    ];
    updatePlaces.mutate({ travelId, reqBody: { places: next } });
  };

  /* ── 타임라인 업로드 → 코스 초안 (사용자 확인·보정 후 저장) ──
   * 파일은 브라우저에서만 파싱. 체류 클러스터로 정차지를 재구성하고,
   * 사용자가 장소 검색으로 각 정차지를 보정한 뒤 저장하면 코스가 교체된다. */
  const timelineInputRef = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState<DraftStopWithPlace[] | null>(null);
  const [draftFileName, setDraftFileName] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [draftSearchIndex, setDraftSearchIndex] = useState<number | null>(null);
  const [draftSaving, setDraftSaving] = useState(false);

  const handleTimelineFile = (file: File) => {
    setDraftError(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let points = parseGoogleTimeline(String(reader.result));
        // 여행 기간이 있으면 기간 내 기록만 사용 (기간 밖뿐이면 전체 유지)
        if (travel?.startDate || travel?.endDate) {
          const inRange = filterByDateRange(points, travel?.startDate, travel?.endDate);
          if (inRange.length > 0) points = inRange;
        }
        const stops = buildCourseDraft(points);
        if (stops.length === 0) {
          setDraftError("No stays detected in this timeline file.");
          return;
        }
        setDraft(stops);
        setDraftFileName(file.name);
        setActiveIndex(null);
        fittedRef.current = false;
      } catch (e) {
        setDraftError(
          e instanceof TimelineParseError ? e.message : "Failed to read this file."
        );
      }
    };
    reader.onerror = () => setDraftError("Failed to read this file.");
    reader.readAsText(file);
  };

  const assignDraftPlace = (index: number, item: PlaceItem) => {
    setDraft((prev) =>
      prev ? prev.map((s, i) => (i === index ? { ...s, place: item } : s)) : prev
    );
    setDraftSearchIndex(null);
  };

  const removeDraftStop = (index: number) => {
    setDraft((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));
  };

  const cancelDraft = () => {
    setDraft(null);
    setDraftFileName(null);
    setDraftError(null);
    setActiveIndex(null);
    fittedRef.current = false;
  };

  const saveDraft = async () => {
    if (!travelId || !draft || draft.length === 0) return;
    setDraftSaving(true);
    try {
      const placesFromDraft: VisitedPlace[] = draft.map((s, i) => {
        const lat = s.place?.lat ?? s.lat;
        const lng = s.place?.lng ?? s.lng;
        const region = locateRegion(lat, lng);
        return {
          id: s.place?.id,
          name:
            s.place?.name ??
            `Stop ${i + 1}${s.region ? ` · ${s.region.nameEn}` : ""}`,
          nameEn: s.place?.nameEn,
          category: s.place?.category,
          categoryEn: s.place?.categoryEn,
          address: s.place ? s.place.roadAddressKo || s.place.addressKo : undefined,
          lat,
          lng,
          regionCode: region?.code,
          transportMode: i > 0 ? (s.guessedMode ?? undefined) : undefined,
          durationMinutes: i > 0 ? (s.travelMinutesFromPrev ?? undefined) : undefined,
        };
      });
      // ⚠️ 순차 저장 필수 — regions/places 동시 PUT 은 lost update
      await updatePlaces.mutateAsync({ travelId, reqBody: { places: placesFromDraft } });
      const codes = new Set(travel?.visitedRegionCodes ?? []);
      placesFromDraft.forEach((p) => p.regionCode && codes.add(p.regionCode));
      await updateRegions.mutateAsync({ travelId, reqBody: { regionCodes: [...codes] } });
      cancelDraft();
    } catch {
      setDraftError("Failed to save the course. Please try again.");
    } finally {
      setDraftSaving(false);
    }
  };

  /* ── 내 모든 프로젝트 합산 (Korea Map 탭) ── */
  const allTravels = useMemo(() => myTravels?.travels ?? [], [myTravels?.travels]);
  const aggregateCodes = useMemo(() => {
    const set = new Set<string>();
    allTravels.forEach((tr) => tr.visitedRegionCodes?.forEach((c) => set.add(c)));
    return set;
  }, [allTravels]);
  const aggregatePlaces = useMemo(
    () =>
      allTravels.flatMap((tr) =>
        (tr.visitedPlaces ?? []).map((p) => ({ place: p, travelTitle: tr.title }))
      ),
    [allTravels]
  );
  const regionDetailPlaces = useMemo(
    () =>
      regionDetail
        ? aggregatePlaces.filter(({ place }) => place.regionCode === regionDetail.code)
        : [],
    [regionDetail, aggregatePlaces]
  );

  const handleMapLoad = useCallback((c: MapController) => {
    controllerRef.current = c;
    setController(c);
  }, []);

  // 지도에 표시할 포인트 — 초안 검토 중엔 초안 정차지, 아니면 저장된 코스
  const mapPoints = useMemo(
    () =>
      draft
        ? draft.map((s, i) => ({
            lat: s.place?.lat ?? s.lat,
            lng: s.place?.lng ?? s.lng,
            name: s.place?.name ?? `Stop ${i + 1}`,
          }))
        : ordered.map((p) => ({ lat: p.lat!, lng: p.lng!, name: p.name })),
    [draft, ordered]
  );
  const mapPointsRef = useRef(mapPoints);
  useEffect(() => {
    mapPointsRef.current = mapPoints;
  }, [mapPoints]);

  // 포인트·활성 상태가 바뀔 때 마커/폴리라인 다시 그림 (드래그·초안 수정 즉시 갱신)
  useEffect(() => {
    const c = controllerRef.current;
    if (!c || mapPoints.length === 0) return;

    c.clearMarkers();
    c.clearPolylines();

    mapPoints.forEach((p, i) => {
      c.addMarker({
        position: { lat: p.lat, lng: p.lng },
        title: p.name,
        icon: numberedPinHtml(i + 1, activeIndex === i),
        onClick: () => setActiveIndex(i),
      });
    });

    if (mapPoints.length > 1) {
      c.drawPolyline({
        path: mapPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
        strokeColor: "#3a9d6e",
        strokeWeight: 3,
        strokeOpacity: 0.75,
      });
    }
  }, [controller, mapPoints, activeIndex]);

  // 최초 로드·초안 전환 시 전체 코스가 보이도록 fitBounds
  useEffect(() => {
    const c = controllerRef.current;
    if (!c || mapPoints.length === 0 || fittedRef.current) return;
    fittedRef.current = true;
    if (mapPoints.length === 1) {
      c.setCenter({ lat: mapPoints[0].lat, lng: mapPoints[0].lng });
      c.setZoom(13);
      return;
    }
    const lats = mapPoints.map((p) => p.lat);
    const lngs = mapPoints.map((p) => p.lng);
    c.fitBounds(
      {
        sw: { lat: Math.min(...lats), lng: Math.min(...lngs) },
        ne: { lat: Math.max(...lats), lng: Math.max(...lngs) },
      },
      60
    );
  }, [controller, mapPoints]);

  const focusStop = (index: number) => {
    setActiveIndex(index);
    const c = controllerRef.current;
    const p = mapPointsRef.current[index];
    if (!c || !p) return;
    if (c.morph) c.morph({ lat: p.lat, lng: p.lng }, 14);
    else {
      c.panTo({ lat: p.lat, lng: p.lng });
      c.setZoom(14);
    }
  };

  return (
    <Page>
      <Inner>
        <Header>
          <BackButton onClick={() => navigate(`/travel/dashboard/${travelId}`)}>
            <ArrowLeft size={16} />
            Dashboard
          </BackButton>
          <TitleBlock>
            <Eyebrow>Travel Course</Eyebrow>
            <Title>{travel?.title ?? (isLoading ? "…" : "Travel")}</Title>
            {places.length > 0 && (
              <SubTitle>
                {places.length} {places.length === 1 ? "place" : "places"} on this course
              </SubTitle>
            )}
          </TitleBlock>
        </Header>

        {/* 탭: 이 프로젝트 코스 / 전 프로젝트 Korea Map */}
        <TabBar>
          <TabButton $active={tab === "course"} onClick={() => setTab("course")}>
            Course
          </TabButton>
          <TabButton $active={tab === "map"} onClick={() => setTab("map")}>
            Korea Map
            <em>all projects</em>
          </TabButton>
        </TabBar>

        {tab === "course" &&
          (places.length === 0 && !draft ? (
            <EmptyCard>
              <MapIcon size={32} />
              <p>No places on the course yet</p>
              <span>
                Add the places you visited on the Korea Travel Map page, or rebuild
                the course from your Google Timeline export.
              </span>
              <EmptyActions>
                <AddButton onClick={() => navigate(`/travel/map/${travelId}`)}>
                  <Plus size={14} />
                  Add places
                </AddButton>
                {canEdit && (
                  <ImportTimelineButton onClick={() => timelineInputRef.current?.click()}>
                    <FileUp size={13} />
                    Import Google Timeline
                  </ImportTimelineButton>
                )}
              </EmptyActions>
              {draftError && <DraftError>{draftError}</DraftError>}
            </EmptyCard>
          ) : (
            <CourseLayout>
              {/* 타임라인 (Triple 식 번호 코스) — 초안 검토 중엔 초안 목록 */}
              <TimelineCard>
                {draft ? (
                  <>
                    <DraftHeader>
                      <strong>Timeline draft</strong>
                      <span>
                        {draftFileName} · {draft.length}{" "}
                        {draft.length === 1 ? "stop" : "stops"}
                      </span>
                    </DraftHeader>
                    <DraftHint>
                      Check each stop — attach the right place with search, remove
                      wrong ones. Saving replaces the current course.
                    </DraftHint>
                    <TimelineList>
                      {draft.map((s, i) => {
                        const LegIcon = transportIcon(s.guessedMode ?? undefined);
                        return (
                          <div key={`${s.arrival}-${i}`}>
                            {i > 0 && (
                              <LegWrap>
                                <LegChip as="span" $clickable={false}>
                                  <LegIcon size={12} />
                                  {s.travelMinutesFromPrev != null
                                    ? formatDuration(s.travelMinutesFromPrev)
                                    : "—"}
                                </LegChip>
                              </LegWrap>
                            )}
                            <TimelineItem
                              $active={activeIndex === i}
                              onClick={() => focusStop(i)}
                            >
                              <OrderBadge $active={activeIndex === i}>
                                {i + 1}
                              </OrderBadge>
                              <ItemBody>
                                <ItemName>
                                  {s.place?.name ?? `Stop ${i + 1}`}
                                  {!s.place && <DraftUnmatched>unmatched</DraftUnmatched>}
                                </ItemName>
                                <ItemMeta>
                                  {s.region?.nameEn ?? "Outside Korea"}
                                  {s.place &&
                                    ` · ${s.place.categoryEn || s.place.category}`}
                                </ItemMeta>
                                <ItemAddress>
                                  {formatStayRange(s)} · stayed{" "}
                                  {formatDuration(Math.max(1, s.dwellMinutes))}
                                </ItemAddress>
                              </ItemBody>
                              <DraftActions>
                                <DraftIconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDraftSearchIndex(i);
                                  }}
                                  title="Find the actual place"
                                >
                                  <Search size={13} />
                                </DraftIconButton>
                                <DraftIconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeDraftStop(i);
                                  }}
                                  title="Remove this stop"
                                >
                                  <Trash2 size={13} />
                                </DraftIconButton>
                              </DraftActions>
                            </TimelineItem>
                          </div>
                        );
                      })}
                    </TimelineList>
                    {draftError && <DraftError>{draftError}</DraftError>}
                    <DraftFooter>
                      <GhostButton onClick={cancelDraft} disabled={draftSaving}>
                        Cancel
                      </GhostButton>
                      <SaveDraftButton onClick={saveDraft} disabled={draftSaving}>
                        {draftSaving
                          ? "Saving…"
                          : `Save ${draft.length} ${draft.length === 1 ? "stop" : "stops"} as course`}
                      </SaveDraftButton>
                    </DraftFooter>
                  </>
                ) : (
                  <>
                    {canEdit && (
                      <CourseToolbar>
                        <ImportTimelineButton
                          onClick={() => timelineInputRef.current?.click()}
                        >
                          <FileUp size={13} />
                          Import Google Timeline
                        </ImportTimelineButton>
                        {draftError && <DraftError>{draftError}</DraftError>}
                      </CourseToolbar>
                    )}
                    <TimelineList ref={listRef}>
                      {ordered.map((p, i) => (
                        <CoursePlaceItem
                          key={p.id ?? `${p.name}-${i}`}
                          place={p}
                          index={i}
                          active={activeIndex === i}
                          dragging={dragIndex === i}
                          canEdit={canEdit}
                          saving={updatePlaces.isPending}
                          onFocus={() => focusStop(i)}
                          onSaveLeg={(mode, minutes) => saveLeg(p, mode, minutes)}
                          onDragStart={startDrag}
                        />
                      ))}
                    </TimelineList>
                    <ManageHint>
                      {canEdit
                        ? "Drag the handle to reorder the course. Manage places on the "
                        : "Manage places on the "}
                      <button onClick={() => navigate(`/travel/map/${travelId}`)}>
                        Korea Travel Map
                      </button>
                      .
                    </ManageHint>
                  </>
                )}
              </TimelineCard>

              {/* 네이버 지도 */}
              <MapCard>
                <MapInfo
                  provider="naver"
                  center={{ lat: 36.5, lng: 127.8 }}
                  zoom={7}
                  width="100%"
                  height="100%"
                  showSearch={false}
                  onMapLoad={handleMapLoad}
                />
              </MapCard>
            </CourseLayout>
          ))}

        {tab === "map" && (
          <KoreaMapCard>
            <KoreaMapStats>
              <strong>{aggregateCodes.size}</strong>
              <span>/ 162 regions · combined across all your projects</span>
            </KoreaMapStats>
            <KoreaMap
              visitedCodes={aggregateCodes}
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
                    {regionDetailPlaces.map(({ place, travelTitle }, i) => (
                      <li key={place.id ?? `${place.name}-${i}`}>
                        <MapPin size={12} />
                        <div>
                          <span>{place.name}</span>
                          <em>
                            {travelTitle}
                            {(place.categoryEn || place.category) &&
                              ` · ${place.categoryEn || place.category}`}
                          </em>
                        </div>
                      </li>
                    ))}
                  </RegionDetailList>
                ) : (
                  <RegionDetailEmpty>
                    No saved places here — this region was colored from a timeline import.
                  </RegionDetailEmpty>
                )}
              </RegionDetail>
            )}
          </KoreaMapCard>
        )}
      </Inner>

      {/* 타임라인 파일 입력 (브라우저에서만 파싱, 서버 전송 없음) */}
      <HiddenFileInput
        ref={timelineInputRef}
        type="file"
        accept=".json,application/json"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleTimelineFile(f);
          e.target.value = "";
        }}
      />

      {/* 초안 정차지 보정용 장소 검색 (카카오 검색 재사용) */}
      <PlaceSearchModal
        open={draftSearchIndex != null}
        onClose={() => setDraftSearchIndex(null)}
        addedIds={new Set()}
        onSelect={(p) => {
          if (draftSearchIndex != null) assignDraftPlace(draftSearchIndex, p);
        }}
      />
    </Page>
  );
};

export default TravelCourse;

/* ──── Styled ──── */

const MAP_HEIGHT = 640;

const Page = styled.div`
  flex: 1;
  width: 100%;
  background: ${t.color.bg};
  padding: 28px 16px 60px;
`;

const Inner = styled.div`
  max-width: 1100px;
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

const SubTitle = styled.span`
  font-size: 13px;
  color: ${t.color.textMuted};
`;

const TabBar = styled.div`
  display: flex;
  gap: 8px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: baseline;
  gap: 6px;
  padding: 8px 18px;
  background: ${(p) => (p.$active ? t.color.accentStrong : t.color.surface)};
  border: 1px solid ${(p) => (p.$active ? t.color.accentStrong : t.color.border)};
  border-radius: ${t.radius.pill};
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => (p.$active ? t.color.text : t.color.textSoft)};
  cursor: pointer;
  transition: all 0.15s;

  em {
    font-style: normal;
    font-size: 10.5px;
    font-weight: 400;
    opacity: 0.75;
  }

  &:hover {
    border-color: ${t.color.accent};
    color: ${t.color.text};
  }
`;

const EmptyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 56px 20px;
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  color: ${t.color.textMuted};
  text-align: center;

  p {
    margin: 6px 0 0;
    font-size: 15px;
    font-weight: 600;
    color: ${t.color.text};
  }

  span {
    font-size: 13px;
  }
`;

const AddButton = styled.button`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  background: ${t.color.accentStrong};
  border: none;
  border-radius: ${t.radius.pill};
  font-size: 13px;
  font-weight: 600;
  color: ${t.color.text};
  cursor: pointer;

  &:hover {
    background: ${t.color.accent};
    color: ${t.color.bg};
  }
`;

const CourseLayout = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 16px;
  align-items: stretch;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const TimelineCard = styled.div`
  background: ${t.color.surface};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 16px;
  /* 타임라인 개수와 무관하게 지도와 같은 높이 유지 */
  height: ${MAP_HEIGHT}px;
  display: flex;
  flex-direction: column;

  @media (max-width: 860px) {
    height: 380px;
    order: 2;
  }
`;

const TimelineList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 4px;
`;

const CourseItemWrap = styled.div<{ $dragging: boolean }>`
  position: relative;
  border-radius: ${t.radius.md};
  ${(p) =>
    p.$dragging &&
    `
    outline: 1px dashed ${t.color.accent};
    background: rgba(46, 125, 82, 0.08);
    z-index: 2;
  `}
`;

const DragHandle = styled.button`
  flex-shrink: 0;
  align-self: center;
  display: flex;
  padding: 4px 2px;
  background: none;
  border: none;
  color: ${t.color.textFaint};
  cursor: grab;
  touch-action: none;

  &:hover {
    color: ${t.color.textSoft};
  }

  &:active {
    cursor: grabbing;
  }
`;

/* ── 구간(leg) 표시 ── */
const LegWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 0 2px 22px;
  position: relative;

  /* 연결선 */
  &::before {
    content: "";
    position: absolute;
    left: 22px;
    top: 0;
    bottom: 0;
    width: 1px;
    background: ${t.color.border2};
  }
`;

const LegChip = styled.span<{ $clickable: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 14px;
  padding: 3px 10px;
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.pill};
  font-size: 11px;
  color: ${t.color.textSoft};
  cursor: ${(p) => (p.$clickable ? "pointer" : "default")};

  svg:first-child {
    color: ${t.color.accent};
  }

  svg:last-child {
    color: ${t.color.textFaint};
  }

  &:hover {
    ${(p) => p.$clickable && `border-color: ${t.color.accent};`}
  }
`;

const AddLegButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 14px;
  padding: 3px 10px;
  background: none;
  border: 1px dashed ${t.color.border2};
  border-radius: ${t.radius.pill};
  font-size: 11px;
  color: ${t.color.textFaint};
  cursor: pointer;

  &:hover {
    border-color: ${t.color.accent};
    color: ${t.color.textSoft};
  }
`;

const LegSpacer = styled.span`
  height: 18px;
`;

const LegEditor = styled.div`
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-left: 14px;
  padding: 6px 9px;
  max-width: 300px;
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border2};
  border-radius: ${t.radius.md};
`;

const ModeButton = styled.button<{ $active: boolean }>`
  display: flex;
  padding: 4px 7px;
  background: ${(p) => (p.$active ? t.color.accentStrong : "none")};
  border: none;
  border-radius: ${t.radius.pill};
  color: ${(p) => (p.$active ? t.color.text : t.color.textMuted)};
  cursor: pointer;

  &:hover {
    color: ${t.color.text};
  }
`;

const MinutesInput = styled.input`
  width: 44px;
  padding: 2px 6px;
  background: ${t.color.bg};
  border: 1px solid ${t.color.border};
  border-radius: 6px;
  font-size: 11.5px;
  color: ${t.color.text};
  outline: none;

  &:focus {
    border-color: ${t.color.accent};
  }

  /* number 스피너 제거 */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const MinutesUnit = styled.span`
  font-size: 10.5px;
  color: ${t.color.textFaint};
`;

const LegIconButton = styled.button`
  display: flex;
  padding: 3px;
  background: none;
  border: none;
  color: ${t.color.textMuted};
  cursor: pointer;

  &:hover {
    color: ${t.color.text};
  }
`;

const TimelineItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 11px;
  padding: 10px;
  border-radius: ${t.radius.md};
  border: 1px solid ${(p) => (p.$active ? t.color.accentStrong : "transparent")};
  background: ${(p) => (p.$active ? "rgba(46,125,82,0.14)" : "transparent")};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: rgba(46, 125, 82, 0.1);
  }
`;

const OrderBadge = styled.span<{ $active: boolean }>`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(p) => (p.$active ? t.color.accent : t.color.accentStrong)};
  color: ${(p) => (p.$active ? t.color.bg : t.color.text)};
  font-size: 12.5px;
  font-weight: 700;
`;

const ItemBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const ItemName = styled.span`
  font-size: 13.5px;
  font-weight: 600;
  color: ${t.color.text};
`;

const ItemMeta = styled.span`
  font-size: 11.5px;
  color: ${t.color.accent};
`;

const ItemAddress = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: ${t.color.textMuted};

  svg {
    flex-shrink: 0;
  }
`;

const ManageHint = styled.p`
  margin: 12px 0 0;
  padding-top: 12px;
  border-top: 1px solid ${t.color.border};
  font-size: 11.5px;
  color: ${t.color.textFaint};

  button {
    background: none;
    border: none;
    padding: 0;
    font-size: 11.5px;
    color: ${t.color.accent};
    cursor: pointer;
    text-decoration: underline;
  }
`;

const MapCard = styled.div`
  height: ${MAP_HEIGHT}px;
  border-radius: ${t.radius.lg};
  overflow: hidden;
  border: 1px solid ${t.color.border};

  @media (max-width: 860px) {
    height: 420px;
    order: 1;
  }
`;

/* ── 타임라인 초안 ── */
const HiddenFileInput = styled.input`
  display: none;
`;

const EmptyActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CourseToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${t.color.border};
`;

const ImportTimelineButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 0;
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

const DraftHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 6px;

  strong {
    font-family: ${t.font.serif};
    font-size: 15px;
    color: ${t.color.text};
  }

  span {
    font-size: 11.5px;
    color: ${t.color.textMuted};
    word-break: break-all;
  }
`;

const DraftHint = styled.p`
  margin: 0 0 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${t.color.border};
  font-size: 11.5px;
  line-height: 1.5;
  color: ${t.color.textFaint};
`;

const DraftUnmatched = styled.em`
  margin-left: 7px;
  font-style: normal;
  font-size: 10px;
  padding: 2px 7px;
  background: rgba(224, 122, 106, 0.14);
  border-radius: ${t.radius.pill};
  color: #e07a6a;
`;

const DraftActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  align-self: center;
`;

const DraftIconButton = styled.button`
  display: flex;
  padding: 6px;
  background: none;
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.pill};
  color: ${t.color.textMuted};
  cursor: pointer;

  &:hover {
    border-color: ${t.color.accent};
    color: ${t.color.text};
  }
`;

const DraftError = styled.p`
  margin: 8px 0 0;
  font-size: 12px;
  color: #e07a6a;
`;

const DraftFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${t.color.border};
`;

const GhostButton = styled.button`
  padding: 8px 14px;
  background: none;
  border: 1px solid ${t.color.border2};
  border-radius: ${t.radius.md};
  font-size: 12.5px;
  color: ${t.color.textSoft};
  cursor: pointer;

  &:hover:not(:disabled) {
    color: ${t.color.text};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

const SaveDraftButton = styled.button`
  padding: 8px 16px;
  background: ${t.color.accentStrong};
  border: none;
  border-radius: ${t.radius.md};
  font-size: 12.5px;
  font-weight: 600;
  color: ${t.color.text};
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${t.color.accent};
    color: ${t.color.bg};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

/* ── Korea Map 탭 (전 프로젝트 합산) ── */
const KoreaMapCard = styled.div`
  background: ${t.color.surface2};
  border: 1px solid ${t.color.border};
  border-radius: ${t.radius.lg};
  padding: 18px;
`;

const KoreaMapStats = styled.p`
  margin: 0 0 12px;
  display: flex;
  align-items: baseline;
  gap: 7px;

  strong {
    font-family: ${t.font.serif};
    font-size: 24px;
    font-weight: 700;
    color: ${t.color.text};
  }

  span {
    font-size: 12.5px;
    color: ${t.color.textMuted};
  }
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
