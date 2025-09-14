// src/component/page/messenger/channel/ChannelSidebar.tsx
import React from 'react';
import { Box, Flex, Text, Button } from '@chakra-ui/react';
import { Search, Plus } from 'lucide-react';
import CusInput from "../../../../common/elements/textField/CusInput";
import ChannelList from './ChannelList';
import type { Channel } from '../../../../types/messenger/messengerTypes';

interface ChannelSidebarProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onChannelSelect: (channel: Channel) => void;
  onCreateChannel: () => void;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
                                                         channels,
                                                         selectedChannel,
                                                         searchQuery,
                                                         onSearchChange,
                                                         onChannelSelect,
                                                         onCreateChannel
                                                       }) => {
  return (
    <Box w="320px" bg="white" borderRight="1px" borderColor="gray.200" flexShrink={0}>
      {/* 헤더 */}
      <Box p={4} borderBottom="1px" borderColor="gray.200" bg="blue.600" height="4rem">
        <Flex justify="space-between" align="center">
          <Text fontSize="xl" fontWeight="bold" color="white">
            여행 채팅
          </Text>
          <Button
            size="sm"
            variant="ghost"
            color="white"
            onClick={onCreateChannel}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <Plus size={16} />
          </Button>
        </Flex>
      </Box>
      
      {/* 검색 */}
      <Box p={4}>
        <CusInput
          placeholder="채널 검색..."
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
          startElement={<Search size={16} color="gray.400" />}
        />
      </Box>
      
      {/* 채널 목록 */}
      <ChannelList
        channels={channels}
        selectedChannel={selectedChannel}
        onChannelSelect={onChannelSelect}
      />
    </Box>
  );
};

export default ChannelSidebar;