import {useNavigate} from "react-router-dom";
import {useCurrentUser} from "../../../hooks/useCurrentUser";


export default function useSidebar() {
  const navigate = useNavigate();
  
  // 현재 사용자 정보
  const currentUser = useCurrentUser();
  
  const onChatbotClick = () => {
    navigate(`/chat`)
  }
  
  const onBlogClick = () => {
    navigate(`/blog/home`)
  }
  
  const onHomeClick = () => {
    navigate(`/blog/home`)
  }
  
  return {
    onChatbotClick,
    onBlogClick,
    onHomeClick,
    currentUser,
  }
}