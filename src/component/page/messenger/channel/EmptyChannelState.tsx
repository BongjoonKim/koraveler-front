// src/component/page/messenger/channel/EmptyChannelState.tsx
import React from 'react';
import { Flex, Text, Button, Avatar } from '@chakra-ui/react';
import { MessageCircle } from 'lucide-react';

interface EmptyChannelStateProps {
  onCreateChannel: () => void;
}

const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({ onCreateChannel }) => {
  return (
    <Flex flex={1} align="center" justify="center" direction="column">
      <Avatar.Root size="xl" bg="blue.500" mb={4}>
        <Avatar.Fallback>
          <MessageCircle size={32} />
        </Avatar.Fallback>
      </Avatar.Root>
      <Text fontSize="xl" fontWeight="semibold" color="gray.700" mb={2}>
        여행 채팅에 오신 것을 환영합니다!
      </Text>
      <Text color="gray.500" mb={6} textAlign="center">
        왼쪽에서 채널을 선택하여 대화를 시작하세요
      </Text>
      <Button colorScheme="blue" onClick={onCreateChannel}>
        새 채널 만들기
      </Button>
    </Flex>
  );
};

export default EmptyChannelState;