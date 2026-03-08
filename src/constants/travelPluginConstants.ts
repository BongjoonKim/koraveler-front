import {
  Youtube,
  FileText,
  MapPinned,
  Utensils,
  Train,
} from "lucide-react";
import { TravelPluginDefinition } from "../types/travel/travelPluginTypes";

export const TRAVEL_PLUGINS: TravelPluginDefinition[] = [
  {
    id: "youtube-summarizer",
    name: "YouTube Summarizer",
    description: "Paste a YouTube link and get an organized summary of the video content",
    longDescription:
      "Extract key points, timestamps, and travel tips from YouTube travel vlogs and guides. Perfect for researching destinations before your trip.",
    icon: Youtube,
    category: "content",
    status: "available",
    color: "#ef4444",
    colorEnd: "#dc2626",
    tags: ["video", "summary", "research"],
  },
  {
    id: "blog-collector",
    name: "Blog Collector",
    description: "Paste a blog URL to organize and save key travel information",
    longDescription:
      "Automatically extract and organize important details from travel blog posts — itineraries, restaurant recommendations, tips, and more.",
    icon: FileText,
    category: "content",
    status: "available",
    color: "#3b82f6",
    colorEnd: "#2563eb",
    tags: ["blog", "article", "organize"],
  },
  {
    id: "google-saved-places",
    name: "Google Saved Places",
    description: "Connect your Google account to view your saved and starred places",
    longDescription:
      "Import your Google Maps saved places, starred locations, and want-to-go lists directly into your travel project.",
    icon: MapPinned,
    category: "maps",
    status: "coming_soon",
    color: "#22c55e",
    colorEnd: "#16a34a",
    tags: ["google", "maps", "places"],
    requiresAuth: true,
    provider: "Google",
  },
  {
    id: "local-food-finder",
    name: "Local Food Finder",
    description: "Discover popular local restaurants and street food near your destinations",
    icon: Utensils,
    category: "utility",
    status: "coming_soon",
    color: "#f59e0b",
    colorEnd: "#d97706",
    tags: ["food", "restaurant", "local"],
  },
  {
    id: "transit-guide",
    name: "Transit Guide",
    description: "Get public transit routes and tips for getting around Korean cities",
    icon: Train,
    category: "utility",
    status: "coming_soon",
    color: "#8b5cf6",
    colorEnd: "#7c3aed",
    tags: ["transit", "transport", "route"],
  },
];
