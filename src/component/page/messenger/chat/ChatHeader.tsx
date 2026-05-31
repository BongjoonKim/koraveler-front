// src/component/page/messenger/chat/ChatHeader.tsx

import { useAtom } from "jotai";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button, createToaster, Dialog,
  Flex,
  HStack,
  IconButton, Menu, Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@chakra-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@chakra-ui/react";
import {ChevronLeft, Info, LogOut, Phone, Settings, Star, Users} from "lucide-react";
import { selectedChannelAtom, showMemberListAtom } from "../../../../stores/messengerStore/messengerStore";
import { useState } from "react";
import {useDeleteChannel, useLeaveChannel} from "../../../../hooks/useMessengerQueries";

const toaster = createToaster({
  placement: 'top',
});

export default function ChatHeader() {
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMemberList, setShowMemberList] = useAtom(showMemberListAtom);
  const leaveChannelMutation = useLeaveChannel();
  
  
  const handleShowMembers = () => {
    setShowMemberList(true);
  };
  
  if (!selectedChannel) return null;
  
  const handleOutChannel = async () => {
    try {
      await leaveChannelMutation.mutateAsync(selectedChannel.id);
      
      toaster.create({
        title: '채널을 나갔습니다',
        description: `#${selectedChannel.name} 채널에서 퇴장했습니다.`,
        status: 'success',
        duration: 3000,
      });
      
      setSelectedChannel(null);
    } catch (error) {
      toaster.create({
        title: '채널 나가기 실패',
        description: '잠시 후 다시 시도해주세요.',
        status: 'error',
        duration: 3000,
      });
    }
  }
  
  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        p={4}
        borderBottom="1px solid rgba(255, 255, 255, 0.06)"
        bg="#0f1414"
        height="4rem"
      >
        <HStack gap={3}>
          <IconButton variant={"ghost"} onClick={() => setSelectedChannel(null)} style={{ color: "#c7d2cc" }}>
            <ChevronLeft />
          </IconButton>
          <Avatar.Root size="md">
            <Avatar.Image
              src={selectedChannel.avatarUrl}
              alt={selectedChannel.name}
            />
            <Avatar.Fallback>
              {selectedChannel.name?.charAt(0)?.toUpperCase() || '?'}
            </Avatar.Fallback>
          </Avatar.Root>
          <VStack align="start" gap={0}>
            <HStack>
              <Text fontWeight="bold" fontSize="lg" style={{ color: "#ffffff" }}>
                {selectedChannel.channelType === 'DIRECT_MESSAGE' ? '' : '#'}{selectedChannel.name}
              </Text>
              {selectedChannel.channelType === 'PRIVATE' && (
                <Badge colorPalette="purple" size="sm">비공개</Badge>
              )}
            </HStack>
            <Text fontSize="sm" style={{ color: "#94a3a0" }}>
              Member {selectedChannel.memberCount}
            </Text>
          </VStack>
        </HStack>

        <HStack gap={2}>
          {/* 멤버 목록 보기 버튼 추가 */}
          <IconButton
            aria-label="멤버 목록"
            size="sm"
            variant="ghost"
            onClick={handleShowMembers}
            style={{ color: "#c7d2cc" }}
          >
            <Users size={16} />
          </IconButton>

          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                aria-label="채널 설정"
                size="sm"
                variant="ghost"
                style={{ color: "#c7d2cc" }}
              >
                <Settings size={16} />
              </IconButton>
            </MenuTrigger>
            <Portal>
              <Menu.Positioner>
              <MenuContent
                css={{
                  zIndex: 9999,  // CSS prop으로 z-index 설정
                  position: 'relative',
                }}
              >
                <MenuItem onClick={() => setIsModalOpen(true)} css={{ cursor: "pointer" }}>
                  <Info size={14} style={{ marginRight: '8px' }} />
                  채널 정보
                </MenuItem>
                <MenuItem onClick={handleShowMembers} css={{ cursor: "pointer" }}>
                  <Users size={14} style={{ marginRight: '8px' }} />
                  멤버 관리
                </MenuItem>
                <MenuItem onClick={handleOutChannel} color="red.500" css={{ cursor: "pointer" }}>
                  <LogOut size={14} style={{ marginRight: '8px' }}  />
                  채널 나가기
                </MenuItem>
              </MenuContent>
              </Menu.Positioner>
            </Portal>
          </MenuRoot>
        </HStack>
      </Flex>
      
      {/* Chakra UI v3 Dialog */}
      <Dialog.Root open={isModalOpen} onOpenChange={(details: { open: boolean }) => setIsModalOpen(details.open)} placement="center" >
        <Portal>
        <Dialog.Positioner>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>채널 정보</DialogTitle>
          </DialogHeader>
          <DialogBody pb={6}>
            <VStack gap={4} align="stretch">
              <HStack>
                <Avatar.Root size="lg">
                  <Avatar.Image
                    src={selectedChannel.avatarUrl}
                    alt={selectedChannel.name}
                  />
                  <Avatar.Fallback>
                    {selectedChannel.name?.charAt(0)?.toUpperCase() || '?'}
                  </Avatar.Fallback>
                </Avatar.Root>
                <VStack align="start" gap={0}>
                  <Text fontWeight="bold" fontSize="xl">{selectedChannel.name}</Text>
                  <Text color="gray.500">멤버 {selectedChannel.memberCount}명</Text>
                </VStack>
              </HStack>
              {selectedChannel.description && (
                <Box>
                  <Text fontWeight="semibold" mb={2}>설명</Text>
                  <Text color="gray.600">{selectedChannel.description}</Text>
                </Box>
              )}
            </VStack>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleShowMembers}
              style={{ marginRight: 'auto' }}
            >
              멤버 관리
            </Button>
            <DialogActionTrigger asChild>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                닫기
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
        </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}