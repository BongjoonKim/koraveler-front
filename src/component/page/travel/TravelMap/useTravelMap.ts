import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetTravel,
  useUpdateTravelRegions,
} from "../../../../hooks/useTravelQueries";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import {
  KOREA_MAP_REGION_COUNT,
  KOREA_MAP_REGIONS,
  KoreaMapRegion,
} from "../../../../constants/koreaMapRegions";

export function useTravelMap() {
  const { travelId } = useParams<{ travelId: string }>();
  const navigate = useNavigate();

  const { data: travel, isLoading } = useGetTravel(travelId);
  const { data: currentUser } = useCurrentUser();
  const updateRegions = useUpdateTravelRegions();

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

  const isDirty = useMemo(() => {
    if (selectedCodes.size !== savedCodes.size) return true;
    return [...selectedCodes].some((c) => !savedCodes.has(c));
  }, [selectedCodes, savedCodes]);

  const handleSave = () => {
    if (!travelId || !isDirty) return;
    updateRegions.mutate(
      {
        travelId,
        reqBody: { regionCodes: [...selectedCodes] },
      },
      {
        onSuccess: () => {
          hasEditsRef.current = false;
        },
      }
    );
  };

  const handleReset = () => {
    hasEditsRef.current = false;
    setSelectedCodes(new Set(savedCodes));
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
    isDirty,
    handleSave,
    handleReset,
    isSaving: updateRegions.isPending,
    saveError: updateRegions.isError,
    saveSuccess: updateRegions.isSuccess && !isDirty,
    visitedCount,
    totalCount,
    percent,
    goBack: () => navigate(`/travel/dashboard/${travelId}`),
  };
}
