import {SearchModalProps} from "./SearchModal";
import {useState} from "react";

export default function useSearchModal(props : SearchModalProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  
  return {
    searchValue,
  }
}