// src/component/page/messenger/channel/ChannelList.tsx
import React from 'react';
import { Box, VStack, HStack, Text, Badge, Avatar } from '@chakra-ui/react';
import type { Channel } from '../../../../types/messenger/messengerTypes';

interface ChannelListProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
                                                   channels,
                                                   selectedChannel,
                                                   onChannelSelect
                                                 }) => {
  return (
    <VStack gap={1} px={2} pb={4} overflowY="auto" flex={1}>
      {channels.map((channel) => (
        <Box
          key={channel.id}
          w="full"
          p={3}
          borderRadius="lg"
          cursor="pointer"
          bg={selectedChannel?.id === channel.id ? "blue.50" : "transparent"}
          borderLeft={selectedChannel?.id === channel.id ? "4px" : "4px"}
          borderColor={selectedChannel?.id === channel.id ? "blue.500" : "transparent"}
          _hover={{ bg: "gray.50" }}
          onClick={() => onChannelSelect(channel)}
        >
          <HStack gap={3}>
            <Avatar.Root size="sm">
              <Avatar.Image src={channel.avatarUrl} />
              <Avatar.Fallback>{channel.name.charAt(0).toUpperCase()}</Avatar.Fallback>
            </Avatar.Root>
            <VStack align="start" gap={0} flex={1} minW={0}>
              <HStack w="full" justify="space-between">
                <Text
                  fontWeight={(channel.unreadMessageCount || 0) > 0 ? "bold" : "medium"}
                  fontSize="sm"
                  color={(channel.unreadMessageCount || 0) > 0 ? "gray.900" : "gray.700"}
                  truncate
                >
                  #{channel.name}
                </Text>
                {(channel.unreadMessageCount || 0) > 0 && (
                  <Badge colorScheme="red" variant="solid" fontSize="xs">
                    {(channel.unreadMessageCount || 0) > 99 ? '99+' : channel.unreadMessageCount}
                  </Badge>
                )}
              </HStack>
              {channel.lastMessage && (
                <Text fontSize="xs" color="gray.500" truncate w="full">
                  {channel.lastMessage.message}
                </Text>
              )}
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default ChannelList;