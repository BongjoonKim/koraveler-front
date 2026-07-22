import { useState } from "react";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import {
  useDiscoveryDigest,
  useRequestDiscovery,
} from "../../../../hooks/useDiscoveryQueries";

export type DiscoveryLocale = "en" | "ko" | "ja" | "zh";

export function useTravelDiscovery() {
  const [inputValue, setInputValue] = useState("");
  const [locale, setLocale] = useState<DiscoveryLocale>("en");
  const [searched, setSearched] = useState<{
    query: string;
    locale: DiscoveryLocale;
  } | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUser();
  const digestQuery = useDiscoveryDigest(
    searched?.query ?? "",
    searched?.locale ?? "en"
  );
  const collectMutation = useRequestDiscovery();

  const handleSearch = () => {
    const query = inputValue.trim();
    if (!query) return;
    setSearched({ query, locale });
    // 로그인 상태면 수집 트리거 (서버가 신선한 캐시 여부를 판단해 재수집 결정)
    if (currentUser) {
      collectMutation.mutate({ query, locale });
    }
  };

  const handleRefresh = () => {
    if (!searched || !currentUser) return;
    collectMutation.mutate({ ...searched, force: true });
  };

  const digest = digestQuery.data?.digest ?? null;
  const jobStatus = digestQuery.data?.jobStatus ?? null;
  const isCollecting =
    collectMutation.isPending ||
    jobStatus === "QUEUED" ||
    jobStatus === "PROCESSING";

  const authFailed =
    collectMutation.isError &&
    collectMutation.error?.message === "AUTHENTICATION_FAILED";

  return {
    inputValue,
    setInputValue,
    locale,
    setLocale,
    searched,
    handleSearch,
    handleRefresh,
    digest,
    jobStatus,
    errorMessage: digestQuery.data?.errorMessage ?? null,
    isCollecting,
    isLoading: digestQuery.isLoading,
    authFailed,
    isLoggedIn: !!currentUser,
    playingVideoId,
    setPlayingVideoId,
  };
}

// ISO8601 duration (PT12M34S) → "12:34"
export function formatDuration(iso?: string): string | null {
  if (!iso) return null;
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return null;
  const h = parseInt(match[1] ?? "0", 10);
  const m = parseInt(match[2] ?? "0", 10);
  const s = parseInt(match[3] ?? "0", 10);
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatViewCount(count?: number): string | null {
  if (count == null) return null;
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M views`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K views`;
  return `${count} views`;
}
