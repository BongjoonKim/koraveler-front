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
  Plus,
  ChevronUp,
  Image,
  File,
  Camera,
  MapPin,
  Smile,
  Send,
  Mic
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
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
    
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
      if (messageInput.trim()) {
        handleSendMessage();
        // 타이핑 중지
        if (selectedChannel) {
          stopTyping(selectedChannel.id);
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
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
          
          // WebSocket을 통해 메시지 전송
          // 또는 REST API 사용
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
    <Box bg="white" borderTop="1px" borderColor="gray.200" p={4}>
      {/* 첨부파일 옵션 */}
      {showAttachments && (
        <Box mb={4} p={3} bg="gray.50" borderRadius="lg">
          <Grid templateColumns="repeat(4, 1fr)" gap={2}>
            <Button
              variant="ghost"
              h="auto"
              flexDirection="column"
              p={3}
              onClick={() => fileInputRef.current?.click()}
            >
              <File size={24} />
              <Text fontSize="xs" mt={1}>파일</Text>
            </Button>
            <Button
              variant="ghost"
              h="auto"
              flexDirection="column"
              p={3}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.click();
                }
              }}
            >
              <Image size={24} />
              <Text fontSize="xs" mt={1}>이미지</Text>
            </Button>
            <Button
              variant="ghost"
              h="auto"
              flexDirection="column"
              p={3}
              onClick={startVoiceRecording}
            >
              <Mic size={24} />
              <Text fontSize="xs" mt={1}>음성</Text>
            </Button>
            <Button
              variant="ghost"
              h="auto"
              flexDirection="column"
              p={3}
            >
              <MapPin size={24} />
              <Text fontSize="xs" mt={1}>위치</Text>
            </Button>
          </Grid>
        </Box>
      )}
      
      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <Box
          position="absolute"
          bottom="full"
          right={0}
          mb={2}
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="lg"
          shadow="lg"
          p={4}
          w="64"
          zIndex={20}
        >
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontSize="sm" fontWeight="semibold">이모지 선택</Text>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setShowEmojiPicker(false)}
            >
              ✕
            </Button>
          </Flex>
          <Grid templateColumns="repeat(5, 1fr)" gap={2}>
            {['😀', '😂', '❤️', '👍', '😊', '🎉', '✨', '💯', '🔥', '💕', '😍', '🤔', '😢', '😮', '👏'].map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                fontSize="lg"
                h={8}
                w={8}
                p={0}
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </Grid>
        </Box>
      )}
      
      {/* 메인 입력 영역 */}
      <Flex align="end" gap={3}>
        {/* 좌측 버튼들 */}
        <HStack gap={2}>
          <Box position="relative">
            <IconButton
              aria-label="첨부파일"
              size="sm"
              variant="ghost"
              colorScheme={showAttachments ? "blue" : "gray"}
              onClick={() => setShowAttachments(!showAttachments)}
              title="첨부파일"
            >
              <Paperclip size={16} />
            </IconButton>
          </Box>
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
            minH="44px"
            maxH="120px"
            pr={12}
            borderRadius="xl"
            _focus={{
              borderColor: "blue.300",
              boxShadow: "0 0 0 1px #63b3ed"
            }}
          />
          <IconButton
            aria-label="이모지"
            size="sm"
            variant="ghost"
            position="absolute"
            right={2}
            top="50%"
            transform="translateY(-50%)"
            colorScheme={showEmojiPicker ? "blue" : "gray"}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="이모지"
          >
            <Smile size={20} />
          </IconButton>
        </Box>
        
        {/* 전송 버튼 */}
        <Button
          colorScheme="blue"
          size="lg"
          borderRadius="xl"
          px={6}
          onClick={handleSendMessage}
          disabled={!messageInput.trim() || isSendingMessage}
          loading={isSendingMessage}
        >
          <Send size={18} style={{ marginRight: '8px' }} />
          전송
        </Button>
      </Flex>
      
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
      
      {/* 멘션된 사용자 표시 */}
      {mentionedUsers.length > 0 && (
        <Box mt={2} p={2} bg="blue.50" borderRadius="md">
          <Text fontSize="sm" color="blue.600">
            멘션: {mentionedUsers.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default MessageInput;