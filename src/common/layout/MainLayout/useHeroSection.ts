import {useAtom} from "jotai";
import {searchInfoAtom, searchInfoQueryAtom} from "../../../stores/jotai/jotai";
import {useCallback, useRef, useState} from "react";
import {debounce} from "lodash";
import {useQuery} from "@tanstack/react-query";

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
        return null;
      }
      
    }
  })
  
}