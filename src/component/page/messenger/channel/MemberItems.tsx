// Member Item Component
import React, {useState} from "react";
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  Portal,
  Text,
  VStack
} from "@chakra-ui/react";
import CusAvatar from "../../../../common/elements/CusAvatar";
import {Bell, Circle, Edit2, MessageCircle, MoreVertical, UserMinus, VolumeX} from "lucide-react";

export default function MemberItem({
                      member,
                      isOnline,
                      isSelected,
                      isCurrentUser,
                      currentUserRole,
                      onClick,
                      onRemove,
                     onTransferRoleOwner,
                      onToggleNotifications,
                      getMemberStatusBadge,
                      getNotificationIcon,
                      formatLastSeen
                    }: any) {
  const [showActions, setShowActions] = useState(false);
  console.log("currentUser", currentUserRole)
  
  return (
    <Box
      position="relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Flex
        align="center"
        justify="space-between"
        px={2.5}
        py={2}
        mx={1}
        borderRadius="10px"
        cursor="pointer"
        bg={isSelected ? "rgba(46, 87, 62, 0.24)" : "transparent"}
        border="1px solid"
        borderColor={isSelected ? "rgba(80, 107, 92, 0.5)" : "transparent"}
        transition="background 0.15s, border-color 0.15s"
        _hover={{
          bg: isSelected ? "rgba(46, 87, 62, 0.3)" : "rgba(255, 255, 255, 0.035)",
          borderColor: isSelected ? "rgba(80, 107, 92, 0.55)" : "rgba(255, 255, 255, 0.05)",
        }}
        onClick={onClick}
      >
        <HStack gap={3} flex={1} minW={0}>
          <Box position="relative" flexShrink={0}>
            <CusAvatar name={member.nickname || member.userId} />
            <Box
              position="absolute"
              bottom="-2px"
              right="-2px"
              bg="#0f1414"
              borderRadius="full"
              p="2px"
              lineHeight={0}
            >
              <Box
                w="9px"
                h="9px"
                borderRadius="full"
                bg={isOnline ? "#7fb89a" : "rgba(255, 255, 255, 0.22)"}
                boxShadow={isOnline ? "0 0 0 2px rgba(127, 184, 154, 0.18)" : "none"}
              />
            </Box>
          </Box>

          <VStack align="start" gap={0.5} flex={1} minW={0}>
            <HStack gap={2} w="100%">
              <Text
                fontSize="sm"
                fontWeight={500}
                truncate
                style={{ color: "#ffffff" }}
              >
                {member.nickname || member.userId}
                {isCurrentUser && (
                  <Text as="span" fontSize="xs" ml={1} style={{ color: "#94a3a0" }}>
                    (Me)
                  </Text>
                )}
              </Text>
              {getMemberStatusBadge(member.status)}
            </HStack>
            <HStack gap={2}>
              <Text fontSize="xs" truncate style={{ color: "#94a3a0" }}>
                {isOnline ? "Online" : `Last seen ${formatLastSeen(member.lastSeenAt)}`}
              </Text>
              {getNotificationIcon(member.notificationLevel)}
            </HStack>
            {member.mutedUntil && new Date(member.mutedUntil) > new Date() && (
              <Text fontSize="xs" style={{ color: "#e58a8a" }}>
                Muted until: {new Date(member.mutedUntil).toLocaleString("en-US")}
              </Text>
            )}
          </VStack>
        </HStack>

        {/* Action Buttons */}
        {showActions && (
          <Menu.Root positioning={{placement : "left-middle"}}>
            <MenuTrigger asChild>
              <IconButton
                size="xs"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
                aria-label="More"
                style={{ color: "#c7d2cc" }}
              >
                <MoreVertical size={14} />
              </IconButton>
            </MenuTrigger>
            <Portal>
              <Menu.Positioner>
                <MenuContent>
                  {!isCurrentUser && (
                    <>
                      <MenuItem value="message">
                        <MessageCircle size={14} />
                        <Text ml={2}>Send Message</Text>
                      </MenuItem>
                      {(member.roleId != "OWNER") && (
                        <MenuItem value="remove" onClick={() => onRemove()}>
                          <UserMinus size={14} />
                          <Text ml={2}>Remove from Channel</Text>
                        </MenuItem>
                      )}
                      {(currentUserRole == "OWNER") && (member?.roleId != "OWNER") && (
                        <MenuItem value="transferRole" onClick={() => onTransferRoleOwner(member.id)}>
                          <UserMinus size={14} />
                          <Text ml={2}>Transfer Owner Role</Text>
                        </MenuItem>
                      )}
                    </>
                  )}
                  {isCurrentUser && (
                    <>
                      <MenuItem value="notifications" onClick={() => onToggleNotifications()}>
                        <Bell size={14} />
                        <Text ml={2}>Notification Settings</Text>
                      </MenuItem>
                      <MenuItem value="nickname">
                        <Edit2 size={14} />
                        <Text ml={2}>Change Nickname</Text>
                      </MenuItem>
                      <MenuItem value="remove" onClick={() => onRemove()}>
                        <UserMinus size={14} />
                        <Text ml={2}>Exit Channel</Text>
                      </MenuItem>
                    </>
                  )}
                </MenuContent>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        )}
      </Flex>
    </Box>
  );
}