import styled from "styled-components";
import { TbMessageChatbot } from "react-icons/tb";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { BiHome } from "react-icons/bi";
import CusIconButton from "../../elements/buttons/CusIconButton";

export interface SidebarProps {
  onChatbotClick?: () => void;
  onBlogClick?: () => void;
  onHomeClick?: () => void;
}

function Sidebar({ onChatbotClick, onBlogClick, onHomeClick }: SidebarProps) {
  return (
    <StyledSidebar>
      <NavigationContainer>
        <LogoSection>
          <LogoButton onClick={onHomeClick} aria-label="홈">
            <BiHome size={24} />
          </LogoButton>
        </LogoSection>
        
        <NavItemsContainer style={{height: "6rem"}}>
          <NavItem>
            <CusIconButton
              aria-label="AI 챗봇"
              onClick={onChatbotClick}
              style={{
                height: '48px',
                width: '48px',
                borderRadius: '24px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                color: '#5f6368'
              }}
            >
              <TbMessageChatbot size={24} />
            </CusIconButton>
          </NavItem>
          
          <NavItem>
            <CusIconButton
              aria-label="블로그"
              onClick={onBlogClick}
              style={{
                height: '48px',
                width: '48px',
                borderRadius: '24px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                color: '#5f6368'
              }}
            >
              <HiOutlineDocumentText size={24} />
            </CusIconButton>
          </NavItem>
        </NavItemsContainer>
      </NavigationContainer>
    </StyledSidebar>
  );
}

export default Sidebar;

const StyledSidebar = styled.div`
  height: 100vh;
  width: 72px;
  border-right: 1px solid #e1e5e9;
  background-color: #ffffff;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
`;

const NavigationContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  border-bottom: 1px solid #e1e5e9;
`;

const LogoButton = styled.button`
  height: 48px;
  width: 48px;
  border-radius: 24px;
  background-color: #e60023;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  color: white;

  &:hover {
    background-color: #d50019;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 12px;
  flex: 1;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    &:hover {
      background-color: #f1f3f4 !important;
      color: #202124 !important;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
      background-color: #e8eaed !important;
    }

    &:focus {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }
  }
`;