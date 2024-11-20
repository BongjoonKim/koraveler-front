import {SearchDocListProps} from "./SearchDocList";
import {useNavigate} from "react-router-dom";

export default function useSearchDocList(props: SearchDocListProps) {
  const navigate = useNavigate();
  
  const handleMove = (id ?: string) => {
    if (id) {
      navigate(`/blog/view/${id}`)
    }
    
  }
  
  return {
    handleMove
  }
}