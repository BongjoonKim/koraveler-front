export default function MessageItem({ message }) {
  const [currentUser] = useAtom(currentUserAtom);
  const isMyMessage = message.userId === currentUser.id;
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  return (
    <Flex
      direction={isMyMessage ? 'row-reverse' : 'row'}
      align="flex-end"
      mb={4}
      gap={2}
    >
      {!isMyMessage && (
        <Avatar size="sm" name={message.userNickname} src={message.userAvatarUrl} />
      )}
      
      <VStack align={isMyMessage ? 'flex-end' : 'flex-start'} spacing={1} maxW="70%">
        {!isMyMessage && (
          <Text fontSize="xs" color="gray.600" ml={2}>
            {message.userNickname}
          </Text>
        )}
        
        <MessageBubble isMyMessage={isMyMessage}>
          <Text fontSize="sm" lineHeight="1.4">
            {message.message}
          </Text>
          {message.isEdited && (
            <Text fontSize="xs" color={isMyMessage ? "whiteAlpha.700" : "gray.500"} mt={1}>
              (편집됨)
            </Text>
          )}
        </MessageBubble>
        
        <HStack spacing={2} align="center">
          <Text fontSize="xs" color="gray.500">
            {formatTime(message.createdAt)}
          </Text>
          {message.reactions && message.reactions.length > 0 && (
            <HStack spacing={1}>
              {message.reactions.map((reaction, index) => (
                <Button
                  key={index}
                  size="xs"
                  variant={reaction.isMyReaction ? "solid" : "outline"}
                  colorScheme={reaction.isMyReaction ? "blue" : "gray"}
                  borderRadius="full"
                  fontSize="xs"
                  px={2}
                  py={1}
                  minH="auto"
                >
                  {reaction.emoji} {reaction.count}
                </Button>
              ))}
            </HStack>
          )}
        </HStack>
      </VStack>
    </Flex>
  );
};