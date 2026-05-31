import React from "react";
import { Box, Flex, Container, VStack, Text } from "@chakra-ui/react";
import styled from "styled-components";
import { useTravelChat } from "./useTravelChat";
import TravelChannelList from "./TravelChannelList";
import TravelChannelCreate from "./TravelChannelCreate";
import ChatHeader from "../../messenger/chat/ChatHeader";
import MessageItem from "../../messenger/message/MessageItem";
import ModernMessageInput from "../../messenger/message/ModernMessageInput";
import MessageDateDivider from "../../messenger/message/MessageDateDivider";
import ChannelMemberList from "../../messenger/channel/ChannelMemberList";
import { MessageCircle } from "lucide-react";

const TravelChat: React.FC = () => {
  const {
    travelId,
    travel,
    messagesEndRef,
    scrollContainerRef,
    loadMoreTriggerRef,
    selectedChannel,
    selectedTravelChannel,
    showMemberList,
    showCreateModal,
    isMobile,
    shouldShowSidebar,
    shouldShowChat,
    travelChannels,
    isLoadingChannels,
    messages,
    hasMoreMessages,
    handleChannelSelect,
    handleCreateChannel,
    handleBack,
    setShowCreateModal,
    setShowMemberList,
    createChannelMutation,
    isSameDay,
  } = useTravelChat();

  return (
    <Container
      maxW="7xl"
      px={{ base: 0, lg: 0 }}
      h="100%"
      flex="1"
      flexDirection="column"
      display="flex"
      bg="#0a0c0c"
    >
      <Box
        position="relative"
        h="100%"
        overflow="hidden"
        display="flex"
        flex="1"
        flexDirection="column"
      >
        <Flex h="100%" bg="#0a0c0c">
          {/* 채널 사이드바 */}
          {shouldShowSidebar && (
            <TravelChannelList
              channels={travelChannels}
              isLoading={isLoadingChannels}
              selectedChannelId={selectedChannel?.id}
              travelTitle={travel?.title}
              onSelect={handleChannelSelect}
              onCreateChannel={() => setShowCreateModal(true)}
              onBack={handleBack}
            />
          )}

          {/* 메인 채팅 영역 */}
          {shouldShowChat && (
            <Flex
              flex={1}
              direction="column"
              minW={0}
              w={isMobile && selectedChannel ? "100%" : undefined}
              bg={selectedChannel ? "#0a0c0c" : "#0a0c0c"}
            >
              {selectedChannel ? (
                <>
                  <ChatHeader />

                  {/* 메시지 영역 */}
                  <Box
                    ref={scrollContainerRef}
                    flex={1}
                    overflowY="auto"
                    p={4}
                    bg="#0a0c0c"
                    borderRight="1px solid rgba(255, 255, 255, 0.06)"
                    borderLeft="1px solid rgba(255, 255, 255, 0.06)"
                  >
                    {!hasMoreMessages && (
                      <Flex direction="column" align="center" py={6} mb={4}>
                        <Box
                          w={12}
                          h={12}
                          borderRadius="full"
                          bg="rgba(46, 87, 62, 0.28)"
                          border="1px solid rgba(80, 107, 92, 0.45)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          mb={3}
                        >
                          <Text fontSize="xl">💬</Text>
                        </Box>
                        <Text fontWeight="bold" fontSize="lg" style={{ color: "#ffffff" }} mb={1}>
                          {selectedChannel?.name}
                        </Text>
                        <Text fontSize="sm" style={{ color: "#94a3a0" }}>
                          Conversation started on{" "}
                          {selectedChannel?.createdAt &&
                            new Date(selectedChannel.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                        </Text>
                        <Box w="60%" h="1px" bg="rgba(255, 255, 255, 0.08)" mt={4} />
                      </Flex>
                    )}
                    <div ref={loadMoreTriggerRef} style={{ height: "1px" }} />
                    <VStack gap={4} align="stretch">
                      {messages.map((message, inx) => {
                        const showDivider = !isSameDay(
                          inx,
                          messages[inx - 1]?.createdAt,
                          message.createdAt
                        );
                        return (
                          <React.Fragment key={message.id}>
                            {showDivider && <MessageDateDivider date={message.createdAt} />}
                            <MessageItem message={message} />
                          </React.Fragment>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </VStack>
                  </Box>

                  <ModernMessageInput />
                </>
              ) : (
                <EmptyChat>
                  <EmptyIcon>
                    <MessageCircle size={32} />
                  </EmptyIcon>
                  <EmptyTitle>Select a channel</EmptyTitle>
                  <EmptyDesc>
                    Choose a channel from the list to start chatting with your travel companions
                  </EmptyDesc>
                </EmptyChat>
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
            travelId={travelId}
            travelChannelId={selectedTravelChannel?.id}
          />
        )}

        {/* 채널 생성 모달 */}
        <TravelChannelCreate
          isOpen={showCreateModal}
          isLoading={createChannelMutation.isPending}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateChannel}
        />
      </Box>
    </Container>
  );
};

export default TravelChat;

const EmptyChat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(46, 87, 62, 0.22);
  border: 1px solid rgba(80, 107, 92, 0.45);
  color: #7fb89a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8px;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: #94a3a0;
  max-width: 280px;
`;
