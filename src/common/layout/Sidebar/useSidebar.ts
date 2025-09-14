import {useNavigate} from "react-router-dom";


export default function useSidebar() {
  const navigate = useNavigate();
  
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
    onHomeClick
  }
}