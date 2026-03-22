import {SearchDocListProps} from "./SearchDocList";
import {useNavigate} from "react-router-dom";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";

export default function useSearchDocList(props: SearchDocListProps) {
  const navigate = useNavigate();
  const { blogViewUrl } = useBlogLocale();

  const handleMove = (id ?: string) => {
    if (id) {
      navigate(blogViewUrl(id))
      props.onClose();
    }
  }
  
  return {
    handleMove
  }
}