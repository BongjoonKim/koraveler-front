import React, { useRef, useEffect } from "react";
import {Stack, Button, IconButton, Box, Portal, Menu} from "@chakra-ui/react";
import { Search, User, Menu as MenuIcon } from "lucide-react";
import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuSeparator
} from "@chakra-ui/react";
import SearchModal from "./SearchModal";
import useRightHeader from "./useRightHeader";
import { useNavigate } from "react-router-dom";
import CusAvatar from "../../elements/CusAvatar";
import CusModal from "../../elements/CusModal";

function RightHeader() {
  const {
    loginUser,
    handleCreate,
    handleOpenModal,
    searchModalOpen,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick,
    sliderRef,
    cusAvaRef,
  } = useRightHeader();
  
  const navigate = useNavigate();
  
  // 로그아웃 핸들러
  const handleLogout = () => {
    // 로그아웃 로직 추가
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };
  
  // 프로필 페이지로 이동
  const handleProfile = () => {
    navigate('/profile');
  };
  
  // 설정 페이지로 이동
  const handleSettings = () => {
    navigate('/settings');
  };
  
  // 내 블로그로 이동
  const handleMyBlogs = () => {
    navigate('/blog/my');
  };
  
  // 로그인 페이지로 이동
  const handleLogin = () => {
    navigate('/login');
  };
  
  // 회원가입 페이지로 이동
  const handleSignup = () => {
    navigate('/signup');
  };
  
  return (
    <>
      {/* Search Modal */}
      <CusModal isOpen={searchModalOpen} onClose={handleOpenModal} size={"xl"} backdropDarkness={0.6}
      >
        <SearchModal onClose={handleOpenModal}/>
      </CusModal>
      <Stack direction="row" gap={4}>
        {/* Search Button - Desktop */}
        <Button
          variant="ghost"
          colorPalette="gray"
          size="sm"
          borderRadius="full"
          display={{ base: "none", sm: "flex" }}
          onClick={handleOpenModal}
        >
          <Search size={16} />
          Search
        </Button>
        
        {/* Search Icon - Mobile */}
        <IconButton
          aria-label="Search"
          variant="ghost"
          borderRadius="full"
          display={{ base: "flex", sm: "none" }}
          onClick={handleOpenModal}
        >
          <Search size={20} />
        </IconButton>
        
        {/* Create Button - 로그인한 사용자만 표시 */}
        {loginUser && (
          <Button
            variant="solid"
            colorPalette="indigo"
            size="sm"
            borderRadius="full"
            onClick={handleCreate}
            display={{ base: "none", md: "flex" }}
          >
            Create Post
          </Button>
        )}
        
        {/* User Menu with ref */}
        <Box ref={cusAvaRef}>
          <MenuRoot open={isSliderOpen}>
            <MenuTrigger asChild>
              <IconButton
                aria-label="User menu"
                variant="ghost"
                borderRadius="full"
                onClick={handleAvatarClick}
              >
                {loginUser ? (
                  <CusAvatar
                    size="sm"
                    name={loginUser?.userId || loginUser?.name}
                  />
                ) : (
                  <User size={20} />
                )}
              </IconButton>
            </MenuTrigger>
          <Portal>
            <Menu.Positioner>
              <Box ref={sliderRef}>
                  <MenuContent>
                    {loginUser ? (
                      <>
                        <MenuItem value="profile" onClick={handleProfile}>
                          Profile
                        </MenuItem>
                        <MenuItem value="blogs" onClick={handleMyBlogs}>
                          My Blogs
                        </MenuItem>
                        <MenuItem value="create" onClick={handleCreate}>
                          Chat
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem value="logout" onClick={handleLogout} color="red.600">
                          Logout
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem value="login" onClick={handleLogin}>
                          Login
                        </MenuItem>
                        <MenuItem value="signup" onClick={handleSignup}>
                          Sign Up
                        </MenuItem>
                      </>
                    )}
                  </MenuContent>
                </Box>
            </Menu.Positioner>
          </Portal>
          </MenuRoot>
        </Box>
      {/* Mobile Menu Button */}
        <IconButton
          aria-label="Open menu"
          variant="ghost"
          borderRadius="full"
          display={{ base: "flex", md: "none" }}
        >
          <MenuIcon size={20} />
        </IconButton>
      </Stack>
    </>
  );
}

export default RightHeader;