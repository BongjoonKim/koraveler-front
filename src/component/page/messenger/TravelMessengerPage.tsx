// src/component/page/messenger/TravelMessengerPage.tsx
import React from 'react';
import { Box, Flex, VStack, Spinner } from '@chakra-ui/react';
import { useTravelMessenger } from '../../../hooks/useTravelMessenger';
import ChatHeader from './chat/ChatHeader';
import MessageInput from './message/MessageInput';
import MessageItem from './message/MessageItem';
import ChannelMemberList from './channel/ChannelMemberList';
import ChannelSidebar from './channel/ChannelSidebar';
import CreateChannelModal from './channel/CreateChannelModal';
import EmptyChannelState from './channel/EmptyChannelState';

const TravelMessengerPage: React.FC = () => {
  const {
    messagesEndRef,
    selectedChannel,
    showMemberList,
    searchQuery,
    showCreateModal,
    newChannelData,
    filteredChannels,
    messages,
    isLoadingMessages,
    handleChannelSelect,
    handleCreateChannel,
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleUpdateChannelData,
    setSearchQuery,
    setShowMemberList,
    createChannelMutation,
  } = useTravelMessenger();
  
  return (
    <Box position="relative" h="100%" overflow="hidden">
      <Flex h="100%" bg="gray.50">
        {/* 채널 사이드바 */}
        <ChannelSidebar
          channels={filteredChannels}
          selectedChannel={selectedChannel}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onChannelSelect={handleChannelSelect}
          onCreateChannel={handleOpenCreateModal}
        />
        
        {/* 메인 채팅 영역 */}
        <Flex flex={1} direction="column" minW={0}>
          {selectedChannel ? (
            <>
              <ChatHeader />
              
              {/* 메시지 영역 */}
              <Box flex={1} overflowY="auto" p={4}>
                {isLoadingMessages ? (
                  <Flex justify="center" align="center" h="100%">
                    <Spinner size="lg" color="blue.500" />
                  </Flex>
                ) : (
                  <VStack gap={4} align="stretch">
                    {messages.map((message) => (
                      <MessageItem key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </VStack>
                )}
              </Box>
              
              <MessageInput />
            </>
          ) : (
            <EmptyChannelState onCreateChannel={handleOpenCreateModal} />
          )}
        </Flex>
      </Flex>
      
      {/* 멤버 리스트 사이드바 */}
      {showMemberList && selectedChannel && (
        <ChannelMemberList
          channelId={selectedChannel.id}
          isVisible={showMemberList}
          onClose={() => setShowMemberList(false)}
          currentUserId="current-user-id"
        />
      )}
      
      {/* 채널 생성 모달 */}
      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreateChannel}
        channelData={newChannelData}
        onUpdateField={handleUpdateChannelData}
        isLoading={createChannelMutation.isPending}
      />
    </Box>
  );
};

export default TravelMessengerPage;