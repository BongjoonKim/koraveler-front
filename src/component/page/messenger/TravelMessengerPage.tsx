// src/component/page/messenger/TravelMessengerPage.tsx
import React from 'react';
import {Box, Flex, VStack, Spinner, Container} from '@chakra-ui/react';
import { useTravelMessenger } from '../../../hooks/useTravelMessenger';
import ChatHeader from './chat/ChatHeader';
import MessageItem from './message/MessageItem';
import ChannelMemberList from './channel/ChannelMemberList';
import ChannelSidebar from './channel/ChannelSidebar';
import CreateChannelModal from './channel/CreateChannelModal';
import EmptyChannelState from './channel/EmptyChannelState';
import ModernMessageInput from "./message/ModernMessageInput";

const TravelMessengerPage: React.FC = () => {
  const {
    messagesEndRef,
    selectedChannel,
    showMemberList,
    searchQuery,
    showCreateModal,
    newChannelData,
    filteredChannels,
    isMobile,
    shouldShowSidebar,
    shouldShowChat,
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
    <Container
      maxW="7xl"
      px={{ base: 0, sm: 0, lg: 0 }}
      h={"100%"}
      flex={"1"}
      flexDirection={"column"}
      display={"flex"}
      bg="gray.50"  // ✅ 전체 배경: 연한 회색
    >
      <Box
        position="relative"
        h="100%"
        overflow="hidden"
        display={'flex'}
        flex={"1"}
        flexDirection={"column"}
      >
        <Flex h="100%" bg="gray.50">  {/* ✅ Flex 배경도 gray.50 */}
          
          {/* 채널 사이드바 - 흰색으로 배경과 구분 */}
          {shouldShowSidebar && (
            <ChannelSidebar
              isMobile={isMobile}
              channels={filteredChannels}
              selectedChannel={selectedChannel}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onChannelSelect={handleChannelSelect}
              onCreateChannel={handleOpenCreateModal}
            />
          )}
          
          {/* 메인 채팅 영역 */}
          {shouldShowChat && (
            <Flex
              flex={1}
              direction="column"
              minW={0}
              w={isMobile && selectedChannel ? "100%" : undefined}
              bg={selectedChannel ? "white" : "gray.50"}  // 채팅 선택 시 흰색
            >
              {selectedChannel ? (
                <>
                  <ChatHeader />
                  
                  {/* 메시지 영역 */}
                  <Box
                    flex={1}
                    overflowY="auto"
                    p={4}
                    maxW={isMobile ? "100%" : "100%"}
                    bg="gray.50"  // ✅ 메시지 배경: 연한 회색
                    borderRight={"1px solid #e7e7e7"}
                    borderLeft={"1px solid #e7e7e7"}
                  >
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
                  
                  <ModernMessageInput />
                </>
              ) : (
                <EmptyChannelState onCreateChannel={handleOpenCreateModal} />
              )}
            </Flex>
          )}
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
    </Container>
  );
};

export default TravelMessengerPage;