// src/component/page/messenger/TravelMessengerPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Input,
  Textarea,
  Button,
  Badge,
  Separator,
  createToaster,
  Avatar,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
  DialogTitle,
  Portal
} from '@chakra-ui/react';

// Lucide React Icons
import {
  Search,
  Plus,
  MessageCircle
} from 'lucide-react';

// Store imports
import {
  selectedChannelAtom,
  messageInputAtom,
  showMemberListAtom
} from '../../../stores/messengerStore/messengerStore';

// Hook imports
import {useChatManager} from '../../../hooks/useChatManager';
import { useWebSocket } from '../../../hooks/useWebSocket';
import {
  useMyChannels,
  useCreateChannel,
  useJoinChannel
} from '../../../hooks/useMessengerQueries';

// Component imports
import ChatHeader from './chat/ChatHeader';
import MessageInput from './message/MessageInput';
import MessageItem from './message/MessageItem';
import {CusInputGroup} from "../../../common/elements/textField/CusInput";

const toaster = createToaster({
  placement: 'top-right',
});

const TravelMessengerPage: React.FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Jotai atoms
  const [selectedChannel, setSelectedChannel] = useAtom(selectedChannelAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [showMemberList, setShowMemberList] = useAtom(showMemberListAtom);
  
  // Local state
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChannelData, setNewChannelData] = useState({
    name: '',
    description: '',
    channelType: 'GROUP' as const
  });
  
  // Hooks
  const {
    channels,
    messages,
    channelMembers,
    isSocketConnected,
    handleSendMessage,
    isSendingMessage
  } = useChatManager();
  
  const { startTyping, stopTyping } = useWebSocket();
  const createChannelMutation = useCreateChannel();
  const joinChannelMutation = useJoinChannel();
  
  // Effects
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleCreateChannel = async () => {
    if (!newChannelData.name.trim()) {
      toaster.create({
        title: '채널명을 입력해주세요',
        status: 'warning',
        duration: 2000
      });
      return;
    }
    
    try {
      const result = await createChannelMutation.mutateAsync(newChannelData);
      console.log('채널 생성 결과:', result); // 디버깅용 로그 추가
      setShowCreateModal(false);
      setNewChannelData({ name: '', description: '', channelType: 'GROUP' });
      toaster.create({
        title: '채널이 생성되었습니다',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      console.error('채널 생성 에러:', error); // 에러 로깅
      toaster.create({
        title: '채널 생성에 실패했습니다',
        status: 'error',
        duration: 2000
      });
    }
  };
  
  const handleChannelSelect = (channel: any) => {
    setSelectedChannel(channel);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else if (selectedChannel) {
      startTyping(selectedChannel.id);
      // 2초 후 타이핑 중지
      setTimeout(() => stopTyping(selectedChannel.id), 2000);
    }
  };
  
  const filteredChannels = channels.filter((channel : any)=>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Flex h="100%" bg="gray.50">
      {/* 연결 상태 표시 */}
      {/*<Box position="fixed" top={4} right={4} zIndex={1000}>*/}
      {/*  <Flex*/}
      {/*    align="center"*/}
      {/*    bg="white"*/}
      {/*    px={3}*/}
      {/*    py={2}*/}
      {/*    borderRadius="lg"*/}
      {/*    shadow="md"*/}
      {/*    border="1px"*/}
      {/*    borderColor="gray.200"*/}
      {/*  >*/}
      {/*    <Box*/}
      {/*      w={2}*/}
      {/*      h={2}*/}
      {/*      borderRadius="full"*/}
      {/*      bg={isSocketConnected ? "green.400" : "red.400"}*/}
      {/*      mr={2}*/}
      {/*    />*/}
      {/*    <Text fontSize="sm" color="gray.600">*/}
      {/*      {isSocketConnected ? '연결됨' : '연결 끊김'}*/}
      {/*    </Text>*/}
      {/*  </Flex>*/}
      {/*</Box>*/}
      
      {/* 사이드바 - 채널 목록 */}
      <Box w="320px" bg="white" borderRight="1px" borderColor="gray.200">
        {/* 헤더 */}
        <Box p={4} borderBottom="1px" borderColor="gray.200" bg="blue.600">
          <Flex justify="space-between" align="center">
            <Text fontSize="xl" fontWeight="bold" color="white">
              여행 채팅
            </Text>
            <Button
              size="sm"
              variant="ghost"
              color="white"
              onClick={() => setShowCreateModal(true)}
              _hover={{ bg: "whiteAlpha.200" }}
            >
              <Plus size={16} />
            </Button>
          </Flex>
        </Box>
        
        {/* 검색 */}
        <Box p={4}>
          <CusInputGroup
            placeholder="채널 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            inputLeftElement={<Search size={16} color="gray.400" />}
          />
        </Box>
        
        {/* 채널 목록 */}
        <VStack gap={1} px={2} pb={4} overflowY="auto" flex={1}>
          {filteredChannels.map((channel : any) => (
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
              onClick={() => handleChannelSelect(channel)}
            >
              <HStack gap={3}>
                <Avatar.Root size="sm">
                  <Avatar.Image src={channel.avatarUrl} />
                  <Avatar.Fallback>{channel.name.charAt(0).toUpperCase()}</Avatar.Fallback>
                </Avatar.Root>
                <VStack align="start" gap={0} flex={1} minW={0}>
                  <HStack w="full" justify="space-between">
                    <Text
                      fontWeight={channel.unreadMessageCount > 0 ? "bold" : "medium"}
                      fontSize="sm"
                      color={channel.unreadMessageCount > 0 ? "gray.900" : "gray.700"}
                      truncate
                    >
                      #{channel.name}
                    </Text>
                    {channel.unreadMessageCount > 0 && (
                      <Badge colorScheme="red" variant="solid" fontSize="xs">
                        {channel.unreadMessageCount > 99 ? '99+' : channel.unreadMessageCount}
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
      </Box>
      
      {/* 메인 채팅 영역 */}
      <Flex flex={1} direction="column">
        {selectedChannel ? (
          <>
            {/* 채팅 헤더 */}
            <ChatHeader />
            
            {/* 메시지 영역 */}
            <Box flex={1} overflowY="auto" p={4}>
              <VStack gap={4} align="stretch">
                {Array.isArray(messages) && messages.map((message : any) => (
                  <MessageItem key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </VStack>
            </Box>
            
            {/* 메시지 입력 */}
            <MessageInput />
          </>
        ) : (
          /* 채널 선택 전 화면 */
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
            <Button
              colorScheme="blue"
              onClick={() => setShowCreateModal(true)}
            >
              새 채널 만들기
            </Button>
          </Flex>
        )}
      </Flex>
      
      {/* 멤버 리스트 사이드바 */}
      {/*{showMemberList && selectedChannel && (*/}
      {/*  <ChannelMemberList*/}
      {/*    channelId={selectedChannel.id}*/}
      {/*    isVisible={showMemberList}*/}
      {/*    onClose={() => setShowMemberList(false)}*/}
      {/*    currentUserId="current-user-id" // 실제 구현시 사용자 ID 전달*/}
      {/*  />*/}
      {/*)}*/}
      
      {/* 채널 생성 모달 */}
      <DialogRoot open={showCreateModal} onOpenChange={(details : any) => setShowCreateModal(details.open)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 채널 만들기</DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <VStack gap={4}>
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    채널 이름
                  </Text>
                  <Input
                    placeholder="예: 제주도 여행"
                    value={newChannelData.name}
                    onChange={(e) => setNewChannelData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                  />
                </Box>
                
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    채널 타입
                  </Text>
                  <select
                    value={newChannelData.channelType}
                    onChange={(e) => setNewChannelData(prev => ({
                      ...prev,
                      channelType: e.target.value as any
                    }))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px'
                    }}
                  >
                    <option value="PUBLIC">공개 채널</option>
                    <option value="PRIVATE">비공개 채널</option>
                    <option value="GROUP">그룹 채널</option>
                  </select>
                </Box>
                
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    설명 (선택사항)
                  </Text>
                  <Textarea
                    placeholder="채널에 대한 간단한 설명을 입력하세요"
                    value={newChannelData.description}
                    onChange={(e) => setNewChannelData(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                  />
                </Box>
              </VStack>
            </DialogBody>
            
            <DialogFooter>
              <Button mr={3} onClick={() => setShowCreateModal(false)}>
                취소
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCreateChannel}
                loading={createChannelMutation.isPending}
              >
                만들기
              </Button>
            </DialogFooter>
          </DialogContent>
      </DialogRoot>
    </Flex>
  );
};

export default TravelMessengerPage;