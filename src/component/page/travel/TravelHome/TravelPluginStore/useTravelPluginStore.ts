import { useState, useMemo } from "react";
import { TRAVEL_PLUGINS } from "../../../../../constants/travelPluginConstants";
import {
  TravelPluginDefinition,
  TravelPluginCategory,
} from "../../../../../types/travel/travelPluginTypes";

export function useTravelPluginStore() {
  const [selectedCategory, setSelectedCategory] = useState<
    TravelPluginCategory | "all"
  >("all");
  const [selectedPlugin, setSelectedPlugin] =
    useState<TravelPluginDefinition | null>(null);

  const filteredPlugins = useMemo(() => {
    if (selectedCategory === "all") return TRAVEL_PLUGINS;
    return TRAVEL_PLUGINS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const handlePluginSelect = (plugin: TravelPluginDefinition) => {
    if (plugin.status === "coming_soon") return;
    setSelectedPlugin(plugin);
  };

  return {
    plugins: filteredPlugins,
    selectedCategory,
    setSelectedCategory,
    selectedPlugin,
    setSelectedPlugin,
    handlePluginSelect,
  };
}
