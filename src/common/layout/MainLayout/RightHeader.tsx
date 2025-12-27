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
    currentUser,
    handleCreate,
    handleOpenModal,
    searchModalOpen,
    isSliderOpen,
    setSliderOpen,
    handleAvatarClick,
    sliderRef,
    cusAvaRef,
    handleProfile,
    handleSettings,
    handleMyBlogs,
    handleLogin,
    handleLogout,
    handleSignup,
    handleChat,
    handleAdmin,
    handleUser,
  } = useRightHeader();
  
  console.log("currentUser", currentUser)
  
  return (
    <>
      {/* Search Modal */}
      <CusModal isOpen={searchModalOpen} onClose={handleOpenModal} size={"xl"} backdropDarkness={0.6}
      >
        <SearchModal onClose={handleOpenModal}/>
      </CusModal>
      <Stack direction="row" gap={4} h={"full"} alignItems="center">
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
        {currentUser && (
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
                {currentUser ? (
                  <CusAvatar
                    size="sm"
                    name={currentUser?.id || currentUser?.username}
                  />
                ) : (
                  <User size={"full"} />
                )}
              </IconButton>
            </MenuTrigger>
            <Portal>
              <Menu.Positioner>
                <Box
                  ref={sliderRef}
                  css={{
                    zIndex: 99999,  // Box에 직접 높은 z-index 적용
                    position: 'relative'
                  }}
                >
                  <MenuContent
                    css={{
                      zIndex: 99999,  // MenuContent에도 직접 z-index 적용
                      position: 'relative',
                      backgroundColor: 'white',  // 배경색 명시
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'  // 그림자 추가
                    }}
                  >
                    {currentUser ? (
                      <>
                        <MenuItem value="profile" onClick={handleProfile}>
                          Profile
                        </MenuItem>
                        <MenuItem value="blogs" onClick={handleMyBlogs}>
                          My Blogs
                        </MenuItem>
                        <MenuItem value="create" onClick={handleChat}>
                          Chat
                        </MenuItem>
                        <MenuSeparator />
                        <MenuItem value="admin/menu" onClick={handleUser}>
                          User
                        </MenuItem>
                        {currentUser.roles?.includes("admin") ? (
                          <MenuItem value="admin/menu" onClick={handleAdmin}>
                            Admin
                          </MenuItem>
                        ) : (
                          <></>
                        )}
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
        {/*  <IconButton*/}
        {/*    aria-label="Open menu"*/}
        {/*    variant="ghost"*/}
        {/*    borderRadius="full"*/}
        {/*    display={{ base: "flex", md: "none" }}*/}
        {/*  >*/}
        {/*    <MenuIcon size={20} />*/}
        {/*  </IconButton>*/}
      </Stack>
    </>
  );
}

export default RightHeader;