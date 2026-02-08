// src/component/page/messenger/channel/EmptyChannelState.tsx
import React from 'react';
import { Flex, Text, Button, Avatar } from '@chakra-ui/react';
import { MessageCircle } from 'lucide-react';

interface EmptyChannelStateProps {
  onCreateChannel: () => void;
}

const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({ onCreateChannel }) => {
  return (
    <Flex flex={1} align="center" justify="center" direction="column" bg={"#fafafa"} border={"1px solid #e7e7e7"}>
      <Avatar.Root size="xl" bg="blue.500" mb={4}>
        <Avatar.Fallback>
          <MessageCircle size={32} />
        </Avatar.Fallback>
      </Avatar.Root>
      <Text fontSize="xl" fontWeight="semibold" color="gray.700" mb={2}>
        Welcome to Travel Chat!
      </Text>
      <Text color="gray.500" mb={6} textAlign="center">
        Select a channel from the left to start a conversation
      </Text>
      <Button colorScheme="blue" onClick={onCreateChannel}>
        Create New Channel
      </Button>
    </Flex>
  );
};

export default EmptyChannelState;