// 멤버 아이템 컴포넌트
import React, {useState} from "react";
import {Box, Flex, HStack, IconButton, Menu, MenuContent, MenuItem, MenuTrigger, Text, VStack} from "@chakra-ui/react";
import CusAvatar from "../../../../common/elements/CusAvatar";
import {Bell, Circle, Edit2, MessageCircle, MoreVertical, UserMinus, VolumeX} from "lucide-react";

export default function MemberItem({
                      member,
                      isOnline,
                      isSelected,
                      isCurrentUser,
                      onClick,
                      onRemove,
                      onToggleNotifications,
                      getMemberStatusBadge,
                      getNotificationIcon,
                      formatLastSeen
                    }: any) {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <Box
      position="relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Flex
        align="center"
        justify="space-between"
        p={2}
        borderRadius="md"
        cursor="pointer"
        bg={isSelected ? 'gray.100' : 'transparent'}
        _hover={{ bg: 'gray.50' }}
        onClick={onClick}
      >
        <HStack gap={3} flex={1}>
          <Box position="relative">
            <CusAvatar name={member.nickname || member.userId} />
            <Box
              position="absolute"
              bottom={-1}
              right={-1}
              bg="white"
              borderRadius="full"
              p="1px"
            >
              {member.isMuted ? (
                <VolumeX size={10} className="text-gray-400" />
              ) : isOnline ? (
                <Circle size={8} className="text-green-500 fill-green-500" />
              ) : (
                <Circle size={8} className="text-gray-300 fill-gray-300" />
              )}
            </Box>
          </Box>
          
          <VStack align="start" gap={0} flex={1} minW={0}>
            <HStack gap={2}>
              <Text fontSize="sm" fontWeight="medium" truncate>
                {member.nickname || member.userId}
                {isCurrentUser && (
                  <Text as="span" color="gray.500" fontSize="xs" ml={1}>
                    (나)
                  </Text>
                )}
              </Text>
              {getMemberStatusBadge(member.status)}
            </HStack>
            <HStack gap={2}>
              <Text fontSize="xs" color="gray.500" truncate>
                {isOnline ? '활동 중' : `마지막 접속: ${formatLastSeen(member.lastSeenAt)}`}
              </Text>
              {getNotificationIcon(member.notificationLevel)}
            </HStack>
            {member.mutedUntil && new Date(member.mutedUntil) > new Date() && (
              <Text fontSize="xs" color="red.500">
                음소거 종료: {new Date(member.mutedUntil).toLocaleString('ko-KR')}
              </Text>
            )}
          </VStack>
        </HStack>
        
        {/* 액션 버튼들 */}
        {showActions && (
          <Menu.Root>
            <MenuTrigger asChild>
              <IconButton
                size="xs"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                aria-label="더보기"
              >
                <MoreVertical size={14} />
              </IconButton>
            </MenuTrigger>
            <MenuContent>
              {!isCurrentUser && (
                <>
                  <MenuItem value="message">
                    <MessageCircle size={14} />
                    <Text ml={2}>메시지 보내기</Text>
                  </MenuItem>
                  <MenuItem value="remove" onClick={() => onRemove()}>
                    <UserMinus size={14} />
                    <Text ml={2}>채널에서 제거</Text>
                  </MenuItem>
                </>
              )}
              {isCurrentUser && (
                <>
                  <MenuItem value="notifications" onClick={() => onToggleNotifications()}>
                    <Bell size={14} />
                    <Text ml={2}>알림 설정</Text>
                  </MenuItem>
                  <MenuItem value="nickname">
                    <Edit2 size={14} />
                    <Text ml={2}>닉네임 변경</Text>
                  </MenuItem>
                </>
              )}
            </MenuContent>
          </Menu.Root>
        )}
      </Flex>
    </Box>
  );
}