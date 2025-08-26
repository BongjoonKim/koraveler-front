import {useNavigate} from "react-router-dom";


export default function useSidebar() {
  const navigate = useNavigate();
  
  const onChatbotClick = () => {
    navigate(`/chat`)
  }
  
  return {
    onChatbotClick
  }
}