import { useState, useMemo } from "react";
import { TRAVEL_PLUGINS } from "../../../../../constants/travelPluginConstants";
import {
  TravelPluginDefinition,
  TravelPluginCategory,
} from "../../../../../types/travel/travelPluginTypes";
import { useTravelProjectSelectModal } from "./TravelProjectSelectModal";

// 프로젝트 선택이 필요한 플러그인 ID 목록
const PLUGINS_REQUIRING_PROJECT = ["travel-chat", "korea-map"];

export function useTravelPluginStore() {
  const [selectedCategory, setSelectedCategory] = useState<
    TravelPluginCategory | "all"
  >("all");
  const [selectedPlugin, setSelectedPlugin] =
    useState<TravelPluginDefinition | null>(null);

  const projectSelectModal = useTravelProjectSelectModal();

  const filteredPlugins = useMemo(() => {
    if (selectedCategory === "all") return TRAVEL_PLUGINS;
    return TRAVEL_PLUGINS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handlePluginSelect = (plugin: TravelPluginDefinition) => {
    if (plugin.status === "coming_soon") return;

    // 프로젝트 선택이 필요한 플러그인은 모달 열기
    if (PLUGINS_REQUIRING_PROJECT.includes(plugin.id)) {
      projectSelectModal.openModal(plugin);
      return;
    }

    setSelectedPlugin(plugin);
  };

  return {
    plugins: filteredPlugins,
    selectedCategory,
    setSelectedCategory,
    selectedPlugin,
    setSelectedPlugin,
    handlePluginSelect,
    projectSelectModal,
  };
}
