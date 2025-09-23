// src/component/page/messenger/message/MessageInput.tsx
import React, { useRef, useState, useCallback } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Textarea,
  Button,
  IconButton,
  Grid,
  Text,
  createToaster
} from '@chakra-ui/react';
import {
  Paperclip,
  Image,
  File,
  MapPin,
  Smile,
  Send,
  Mic,
  X
} from 'lucide-react';

// Store imports
import {
  selectedChannelAtom,
  messageInputAtom,
  mentionedUsersAtom,
  showAttachmentsAtom,
  showEmojiPickerAtom
} from '../../../../stores/messengerStore/messengerStore';

// Hook imports
import {useChatManager} from '../../../../hooks/useChatManager';
import { useWebSocket } from '../../../../hooks/useWebSocket';
import { useFileUpload } from '../../../../hooks/useMessengerQueries';

const toaster = createToaster({
  placement: "top",
});

const MessageInput: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Atoms
  const [selectedChannel] = useAtom(selectedChannelAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [mentionedUsers, setMentionedUsers] = useAtom(mentionedUsersAtom);
  const [showAttachments, setShowAttachments] = useAtom(showAttachmentsAtom);
  const [showEmojiPicker, setShowEmojiPicker] = useAtom(showEmojiPickerAtom);
  
  // Local state
  const [isRecording, setIsRecording] = useState(false);
  
  // Hooks
  const { handleSendMessage, isSendingMessage } = useChatManager();
  const { startTyping, stopTyping } = useWebSocket();
  const fileUploadMutation = useFileUpload();
  
  // 타이핑 타이머 관리
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessageInput(value);
    
    // 타이핑 이벤트 처리
    if (selectedChannel) {
      startTyping(selectedChannel.id);
      
      // 기존 타이머 클리어
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // 2초 후 타이핑 중지
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedChannel.id);
      }, 2000);
    }
  }, [selectedChannel, setMessageInput, startTyping, stopTyping]);
  
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      if (messageInput.trim()) {
        handleSendMessage();
        // 타이핑 중지
        if (selectedChannel) {
          stopTyping(selectedChannel.id);
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        // textarea 높이 초기화
        if (textareaRef.current) {
          textareaRef.current.style.height = '36px';
        }
      }
    }
  }, [messageInput, handleSendMessage, selectedChannel, stopTyping]);
  
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || !selectedChannel) return;
    
    Array.from(files).forEach(file => {
      // 파일 크기 체크 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        toaster.create({
          title: '파일 크기 초과',
          description: '10MB 이하의 파일만 업로드 가능합니다.',
          status: 'error',
          duration: 3000
        });
        return;
      }
      
      fileUploadMutation.mutate(file, {
        onSuccess: (response) => {
          // 파일 업로드 성공 시 메시지로 전송
          const fileMessage = {
            channelId: selectedChannel.id,
            message: file.name,
            messageType: file.type.startsWith('image/') ? 'IMAGE' as const : 'FILE' as const,
            attachments: [{
              fileName: file.name,
              fileUrl: response.data.fileUrl,
              mimeType: file.type,
              fileSize: file.size
            }]
          };
          
          handleSendMessage();
        },
        onError: () => {
          toaster.create({
            title: '파일 업로드 실패',
            description: '파일 업로드 중 오류가 발생했습니다.',
            status: 'error',
            duration: 3000
          });
        }
      });
    });
  }, [selectedChannel, fileUploadMutation, handleSendMessage]);
  
  const handleEmojiSelect = useCallback((emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  }, [setMessageInput, setShowEmojiPicker]);
  
  // 음성 녹음 시작
  const startVoiceRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      // 실제 녹음 로직 구현
      toaster.create({
        title: '음성 녹음 시작',
        status: 'info',
        duration: 2000
      });
    } catch (error) {
      toaster.create({
        title: '마이크 접근 권한이 필요합니다',
        status: 'error',
        duration: 3000
      });
    }
  }, []);
  
  if (!selectedChannel) {
    return (
      <Box p={4} textAlign="center" bg="gray.50">
        <Text color="gray.500">채널을 선택해주세요</Text>
      </Box>
    );
  }
  
  return (
    <Box position="relative" bg="white" borderTop="1px" borderColor="gray.200">
      {/* 첨부파일 옵션 - 입력창 위에 표시 */}
      {showAttachments && (
        <Box
          position="absolute"
          bottom="100%"
          left={0}
          right={0}
          mb={2}
          mx={4}
          p={3}
          bg="white"
          borderRadius="lg"
          shadow="lg"
          border="1px"
          borderColor="gray.200"
          zIndex={10}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">파일 첨부</Text>
            <IconButton
              aria-label="닫기"
              size="xs"
              variant="ghost"
              onClick={() => setShowAttachments(false)}
            >
              <X size={14} />
            </IconButton>
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap={2}>
            <Button
              variant="ghost"
              size="sm"
              h="auto"
              flexDirection="column"
              p={2}
              onClick={() => fileInputRef.current?.click()}
              _hover={{ bg: "gray.100" }}
            >
              <File size={20} />
              <Text fontSize="xs" mt={1}>파일</Text>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              h="auto"
              flexDirection="column"
              p={2}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.click();
                }
              }}
              _hover={{ bg: "gray.100" }}
            >
              <Image size={20} />
              <Text fontSize="xs" mt={1}>이미지</Text>
            </Button>
            {/*<Button*/}
            {/*  variant="ghost"*/}
            {/*  size="sm"*/}
            {/*  h="auto"*/}
            {/*  flexDirection="column"*/}
            {/*  p={2}*/}
            {/*  onClick={startVoiceRecording}*/}
            {/*  _hover={{ bg: "gray.100" }}*/}
            {/*>*/}
            {/*  <Mic size={20} />*/}
            {/*  <Text fontSize="xs" mt={1}>음성</Text>*/}
            {/*</Button>*/}
            {/*<Button*/}
            {/*  variant="ghost"*/}
            {/*  size="sm"*/}
            {/*  h="auto"*/}
            {/*  flexDirection="column"*/}
            {/*  p={2}*/}
            {/*  _hover={{ bg: "gray.100" }}*/}
            {/*>*/}
            {/*  <MapPin size={20} />*/}
            {/*  <Text fontSize="xs" mt={1}>위치</Text>*/}
            {/*</Button>*/}
          </Grid>
        </Box>
      )}
      
      {/* 이모지 피커 - 입력창 위에 표시 */}
      {showEmojiPicker && (
        <Box
          position="absolute"
          bottom="100%"
          right={4}
          mb={2}
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          shadow="lg"
          p={3}
          w="280px"
          zIndex={20}
        >
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">이모지</Text>
            <IconButton
              aria-label="닫기"
              size="xs"
              variant="ghost"
              onClick={() => setShowEmojiPicker(false)}
            >
              <X size={14} />
            </IconButton>
          </Flex>
          <Grid templateColumns="repeat(6, 1fr)" gap={1}>
            {['😀', '😂', '❤️', '👍', '😊', '🎉', '✨', '💯', '🔥', '💕', '😍', '🤔', '😢', '😮', '👏', '🙏', '😭', '😘'].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                fontSize="lg"
                h={7}
                w={7}
                minW={7}
                p={0}
                onClick={() => handleEmojiSelect(emoji)}
                _hover={{ bg: "gray.100" }}
              >
                {emoji}
              </Button>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* 메인 입력 영역 */}
      <Box px={3} py={2}>
        <Flex align="center" gap={2}>
          {/* 좌측 버튼들 */}
          <HStack gap={1}>
            <IconButton
              aria-label="첨부파일"
              size="sm"
              variant="ghost"
              colorScheme={showAttachments ? "blue" : "gray"}
              onClick={() => setShowAttachments(!showAttachments)}
              title="첨부파일"
              _hover={{ bg: showAttachments ? "blue.50" : "gray.100" }}
            >
              <Paperclip size={18} />
            </IconButton>
          </HStack>
          
          {/* 텍스트 입력 영역 */}
          <Box flex={1} position="relative">
            <Textarea
              ref={textareaRef}
              placeholder={`#${selectedChannel.name}에 메시지 보내기...`}
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              resize="none"
              minH="1rem"
              h="100%"
              maxH="120px"
              py={1.5}
              px={3}
              pr={10}
              fontSize="sm"
              lineHeight="1.4"
              border="1px solid"
              borderColor="gray.300"
              transition="all 0.2s"
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #3182ce",
                outline: "none"
              }}
              _hover={{
                borderColor: "gray.400"
              }}
              style={{
                overflow: 'hidden',
                overflowY: 'auto'
              }}
            />
            <IconButton
              aria-label="이모지"
              size="xs"
              variant="ghost"
              position="absolute"
              right={1}
              top="50%"
              transform="translateY(-50%)"
              colorScheme={showEmojiPicker ? "blue" : "gray"}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              title="이모지"
              _hover={{ bg: showEmojiPicker ? "blue.50" : "gray.100" }}
            >
              <Smile size={16} />
            </IconButton>
          </Box>
          
          {/* 전송 버튼 */}
          <Button
            colorScheme="blue"
            size="sm"
            borderRadius="full"
            px={4}
            h="36px"
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || isSendingMessage}
            loading={isSendingMessage}
            loadingText="전송 중"
            transition="all 0.2s"
            _hover={{
              transform: 'translateY(-1px)',
              shadow: 'md'
            }}
          >
            <Send size={16} style={{ marginRight: '6px' }} />
            전송
          </Button>
        </Flex>
        
        {/* 멘션된 사용자 표시 */}
        {mentionedUsers.length > 0 && (
          <Box mt={2} p={1.5} bg="blue.50" borderRadius="md" maxW="fit-content">
            <Text fontSize="xs" color="blue.600" px={2}>
              @{mentionedUsers.join(', @')}
            </Text>
          </Box>
        )}
      </Box>
      
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </Box>
  );
};

export default MessageInput;