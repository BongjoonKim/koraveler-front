import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyTravels } from "../../../../../../hooks/useTravelQueries";
import { TravelResponse } from "../../../../../../types/travel/travelTypes";
import { TravelPluginDefinition } from "../../../../../../types/travel/travelPluginTypes";

export function useTravelProjectSelectModal() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyTravels(0, 50);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<TravelResponse | null>(null);
  const [targetPlugin, setTargetPlugin] = useState<TravelPluginDefinition | null>(null);

  const travels: TravelResponse[] = data?.travels ?? [];

  // 검색 필터링
  const filteredTravels = useMemo(() => {
    if (!searchQuery.trim()) return travels;
    const q = searchQuery.toLowerCase();
    return travels.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.destination?.toLowerCase().includes(q)
    );
  }, [travels, searchQuery]);

  const openModal = (plugin: TravelPluginDefinition) => {
    setTargetPlugin(plugin);
    setSelectedProject(null);
    setSearchQuery("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTargetPlugin(null);
    setSelectedProject(null);
    setSearchQuery("");
  };

  // 프로젝트 선택 후 해당 플러그인 페이지로 이동
  const handleApply = () => {
    if (!selectedProject || !targetPlugin) return;

    // 플러그인별 라우트 매핑
    const routeMap: Record<string, string> = {
      "travel-chat": `/travel/chat/${selectedProject.id}`,
    };

    const route = routeMap[targetPlugin.id];
    if (route) {
      closeModal();
      navigate(route);
    }
  };

  return {
    isOpen,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedProject,
    setSelectedProject,
    targetPlugin,
    filteredTravels,
    openModal,
    closeModal,
    handleApply,
  };
}
