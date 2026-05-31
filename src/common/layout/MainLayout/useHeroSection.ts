import {useAtom} from "jotai";
import {searchInfoQueryAtom} from "../../../stores/jotai/jotai";
import {KeyboardEvent, useCallback, useEffect, useRef, useState} from "react";
import {debounce} from "lodash";
import {useQuery} from "@tanstack/react-query";
import {searchDocuments} from "../../../endpoints/blog-endpoints";

interface UseHeroSearchProps {
  minSearchLength?: number;
  debounceMs?: number;
}

export default function useHeroSection({
  minSearchLength = 2,
  debounceMs = 300
} : UseHeroSearchProps = {}) {
  const [searchInfoQuery, setSearchInfoQuery] = useAtom(searchInfoQueryAtom);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, debounceMs),
    [debounceMs]
  );
  
  // Handle search input change
  const handleSearchChange = useCallback((value: string) => {
    setSearchInfoQuery(value);
    
    if (value.length >= minSearchLength) {
      setIsDropdownOpen(true);
      debouncedSearch(value);
    } else {
      setIsDropdownOpen(false);
      setDebouncedQuery("");
    }
  }, [minSearchLength, debouncedSearch, setSearchInfoQuery]);
  
  const {data, isLoading, error} = useQuery({
    queryKey: ["searchInfo", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < minSearchLength) {
        return {documents: []};
      }
      const response = await searchDocuments({
        params: {
          value: debouncedQuery,
          page: 0,
          size: 30
        }
      })
      
      if (response?.status !== 200) {
        throw new Error(response.statusText);
      }
      
      return response.data;
    },
    enabled: debouncedQuery.length >= minSearchLength,
    staleTime: 60000
  });
  
  useEffect((() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      // 검색바 컨테이너 클릭은 무시
      if (dropdownRef.current && dropdownRef.current.contains(target)) return;
      // portal 로 떠 있는 SearchDropdown 내부 클릭도 무시
      if (target instanceof Element && target.closest("[data-search-dropdown]")) return;
      setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }));
  
  const handleKeyDown = useCallback((event : KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
      searchInputRef.current?.blur();
    }
  }, []);
  
  return {
    searchInfoQuery,
    handleSearchChange,
    isDropdownOpen,
    setIsDropdownOpen,
    documents: data?.documents || [],
    isLoading,
    error,
    dropdownRef,
    searchInputRef,
    handleKeyDown,
  };
}