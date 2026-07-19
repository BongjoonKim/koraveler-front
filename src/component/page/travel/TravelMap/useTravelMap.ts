import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTravel,
  useUpdateTravelPlaces,
  useUpdateTravelRegions,
} from "../../../../hooks/useTravelQueries";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import {
  KOREA_MAP_REGION_COUNT,
  KOREA_MAP_REGIONS,
  KoreaMapRegion,
} from "../../../../constants/koreaMapRegions";
import { VisitedPlace } from "../../../../types/travel/travelTypes";
import { PlaceItem } from "../../../../types/place/placeTypes";
import { locateRegion } from "../../../../utils/koreaRegionLocator";

export function useTravelMap() {
  const { travelId } = useParams<{ travelId: string }>();
  const navigate = useNavigate();

  const { data: travel, isLoading } = useGetTravel(travelId);
  const { data: currentUser } = useCurrentUser();
  const updateRegions = useUpdateTravelRegions();
  const updatePlaces = useUpdateTravelPlaces();

  // 편집 권한: ADMIN/USER만 (VIEWER 읽기 전용) — TravelDashboard와 동일 기준
  const canEdit = useMemo(() => {
    const me = travel?.members?.find((m) => m.userId === currentUser?.id);
    return !!me && me.role !== "VIEWER";
  }, [travel?.members, currentUser?.id]);

  // 저장된 방문 지역
  const savedCodes = useMemo(
    () => new Set(travel?.visitedRegionCodes ?? []),
    [travel?.visitedRegionCodes]
  );

  // 로컬 선택 상태 (저장 전 편집분)
  // 편집 중에는 백그라운드 refetch가 서버 상태로 덮어쓰지 않도록 가드
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const hasEditsRef = useRef(false);
  useEffect(() => {
    if (!hasEditsRef.current) {
      setSelectedCodes(new Set(savedCodes));
    }
  }, [savedCodes]);

  const toggleRegion = (region: KoreaMapRegion) => {
    if (!canEdit) return;
    hasEditsRef.current = true;
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(region.code)) next.delete(region.code);
      else next.add(region.code);
      return next;
    });
  };

  // 타임라인 가져오기 등 외부 소스에서 지역 일괄 추가 (기존 선택 유지, 합집합)
  const addRegions = (codes: string[]) => {
    if (!canEdit || codes.length === 0) return;
    hasEditsRef.current = true;
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      codes.forEach((c) => next.add(c));
      return next;
    });
  };

  // ── 다녀온 장소 (순서·시간 미기록) ──
  const savedPlaces = useMemo(
    () => travel?.visitedPlaces ?? [],
    [travel?.visitedPlaces]
  );
  const [selectedPlaces, setSelectedPlaces] = useState<VisitedPlace[]>([]);
  useEffect(() => {
    if (!hasEditsRef.current) {
      setSelectedPlaces(savedPlaces);
    }
  }, [savedPlaces]);

  // 장소 검색 결과 선택 → 장소 추가 + 해당 지역 자동 색칠
  const addPlace = (item: PlaceItem) => {
    if (!canEdit) return;
    if (selectedPlaces.some((p) => p.id && p.id === item.id)) return;
    const region = locateRegion(item.lat, item.lng);
    hasEditsRef.current = true;
    setSelectedPlaces((prev) => [
      ...prev,
      {
        id: item.id,
        name: item.name,
        nameEn: item.nameEn,
        category: item.category,
        categoryEn: item.categoryEn,
        address: item.roadAddressKo || item.addressKo,
        lat: item.lat,
        lng: item.lng,
        regionCode: region?.code,
      },
    ]);
    if (region) {
      setSelectedCodes((prev) => {
        const next = new Set(prev);
        next.add(region.code);
        return next;
      });
    }
  };

  // 장소 제거 (지역 색칠은 유지 — 지역 칩에서 별도 제거 가능)
  const removePlace = (place: VisitedPlace) => {
    if (!canEdit) return;
    hasEditsRef.current = true;
    setSelectedPlaces((prev) => prev.filter((p) => p !== place));
  };

  const regionsDirty = useMemo(() => {
    if (selectedCodes.size !== savedCodes.size) return true;
    return [...selectedCodes].some((c) => !savedCodes.has(c));
  }, [selectedCodes, savedCodes]);

  const placesDirty = useMemo(() => {
    if (selectedPlaces.length !== savedPlaces.length) return true;
    const savedIds = new Set(savedPlaces.map((p) => p.id ?? `${p.name}:${p.lat}`));
    return selectedPlaces.some((p) => !savedIds.has(p.id ?? `${p.name}:${p.lat}`));
  }, [selectedPlaces, savedPlaces]);

  const isDirty = regionsDirty || placesDirty;

  // ⚠️ 순차 저장 필수: 두 PUT 모두 백엔드에서 문서 전체를 load→save 하므로
  // 동시에 보내면 나중 요청이 먼저 요청의 변경분을 옛 값으로 덮어쓴다 (lost update).
  const handleSave = async () => {
    if (!travelId || !isDirty) return;
    try {
      if (regionsDirty) {
        await updateRegions.mutateAsync({
          travelId,
          reqBody: { regionCodes: [...selectedCodes] },
        });
      }
      if (placesDirty) {
        await updatePlaces.mutateAsync({
          travelId,
          reqBody: { places: selectedPlaces },
        });
      }
      hasEditsRef.current = false;
    } catch {
      // 에러는 mutation isError 로 표시
    }
  };

  const handleReset = () => {
    hasEditsRef.current = false;
    setSelectedCodes(new Set(savedCodes));
    setSelectedPlaces(savedPlaces);
  };

  // 선택된 지역 목록 (칩 표시용)
  const selectedRegions = useMemo(
    () => KOREA_MAP_REGIONS.filter((r) => selectedCodes.has(r.code)),
    [selectedCodes]
  );

  const visitedCount = selectedCodes.size;
  const totalCount = KOREA_MAP_REGION_COUNT;
  const percent = Math.round((visitedCount / totalCount) * 100);

  return {
    travelId,
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
    isSaving: updateRegions.isPending || updatePlaces.isPending,
    saveError: updateRegions.isError || updatePlaces.isError,
    saveSuccess:
      (updateRegions.isSuccess || updatePlaces.isSuccess) && !isDirty,
    visitedCount,
    totalCount,
    percent,
    goBack: () => navigate(`/travel/dashboard/${travelId}`),
  };
}
