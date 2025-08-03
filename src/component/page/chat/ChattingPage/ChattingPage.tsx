export default function ChattingPage() {
  
  return (
    <VStack spacing={1} align="stretch">
      {channels.map((channel) => (
        <ChannelListItem
          key={channel.id}
          isSelected={selectedChannel?.id === channel.id}
          hasUnread={!!channel.unreadMessageCount}
          onClick={() => setSelectedChannel(channel)}
        >
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Avatar size="sm" name={channel.name} src={channel.avatarUrl} />
              <VStack align="start" spacing={0}>
                <Text fontWeight={channel.unreadMessageCount ? "bold" : "normal"} fontSize="sm">
                  {channel.channelType === 'DIRECT_MESSAGE' ? '🔒' : '#'} {channel.name}
                </Text>
                {channel.lastMessage && (
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {channel.lastMessage.message}
                  </Text>
                )}
              </VStack>
            </HStack>
            <VStack spacing={1}>
              {channel.unreadMessageCount && channel.unreadMessageCount > 0 && (
                <Badge colorScheme="blue" borderRadius="full" fontSize="xs">
                  {channel.unreadMessageCount > 99 ? '99+' : channel.unreadMessageCount}
                </Badge>
              )}
              {channel.isMuted && <Text fontSize="xs">🔇</Text>}
            </VStack>
          </HStack>
        </ChannelListItem>
      ))}
    </VStack>
  );
}