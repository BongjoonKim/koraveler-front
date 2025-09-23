// src/component/page/messenger/message/ModernMessageInput.tsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Button,
  IconButton,
  Grid,
  Text,
  createToaster,
  Badge
} from '@chakra-ui/react';
import {
  Plus,
  Paperclip,
  Image,
  File,
  Sparkles,
  Send,
  X,
  ChevronDown,
  Bot,
  Users,
  Zap,
  Settings
} from 'lucide-react';
import styled from 'styled-components';

// Store imports
import {
  selectedChannelAtom,
  messageInputAtom,
  mentionedUsersAtom,
  showAttachmentsAtom,
} from '../../../../stores/messengerStore/messengerStore';

// Hook imports
import { useChatManager } from '../../../../hooks/useChatManager';
import { useWebSocket } from '../../../../hooks/useWebSocket';
import { useFileUpload } from '../../../../hooks/useMessengerQueries';

const toaster = createToaster({
  placement: "top",
});

// AI 모델 타입
type AIModel = {
  id: string;
  name: string;
  description: string;
  badge?: string;
};

const AI_MODELS: AIModel[] = [
  { id: 'gpt-4', name: 'GPT-4', description: '가장 강력한 AI 모델', badge: 'Pro' },
  { id: 'gpt-3.5', name: 'GPT-3.5', description: '빠르고 효율적인 모델' },
  { id: 'claude', name: 'Claude', description: 'Anthropic의 AI 어시스턴트' },
];

const ModernMessageInput: React.FC = () => {
  const textareaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Atoms
  const [selectedChannel] = useAtom(selectedChannelAtom);
  const [messageInput, setMessageInput] = useAtom(messageInputAtom);
  const [mentionedUsers, setMentionedUsers] = useAtom(mentionedUsersAtom);
  const [showAttachments, setShowAttachments] = useAtom(showAttachmentsAtom);
  
  // Local state
  const [isAIMode, setIsAIMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [localMessageInput, setLocalMessageInput] = useState('');
  
  // Hooks
  const { handleSendMessage, isSendingMessage } = useChatManager();
  const { startTyping, stopTyping } = useWebSocket();
  const fileUploadMutation = useFileUpload();
  
  // 타이핑 타이머 관리
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 로컬 입력 변경 핸들러
  const handleLocalInputChange = useCallback((text: string) => {
    setLocalMessageInput(text);
    setMessageInput(text);
    
    // 타이핑 이벤트 처리
    if (selectedChannel && !isAIMode) {
      startTyping(selectedChannel.id);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedChannel.id);
      }, 2000);
    }
  }, [selectedChannel, setMessageInput, startTyping, stopTyping, isAIMode]);
  
  // contenteditable 입력 핸들러
  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const text = e.currentTarget.textContent || '';
    handleLocalInputChange(text);
  }, [handleLocalInputChange]);

// Enter 키 핸들러
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      
      const currentText = textareaRef.current?.textContent?.trim() || '';
      
      if (currentText) {
        handleSendMessage();
        // 입력창 초기화
        if (textareaRef.current) {
          textareaRef.current.textContent = '';
        }
        setLocalMessageInput('');
        setMessageInput('');
        
        if (selectedChannel && !isAIMode) {
          stopTyping(selectedChannel.id);
        }
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }
    }
  }, [handleSendMessage, selectedChannel, stopTyping, isAIMode, setMessageInput]);
  
  // 파일 선택 핸들러
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || !selectedChannel) return;
    
    Array.from(files).forEach(file => {
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
  
  // AI 모드 토글
  const toggleAIMode = useCallback(() => {
    setIsAIMode(prev => !prev);
    toaster.create({
      title: !isAIMode ? 'AI 어시스턴트 모드' : '일반 채팅 모드',
      description: !isAIMode ? 'AI와 대화할 수 있습니다' : '일반 사용자와 대화합니다',
      status: 'info',
      duration: 2000
    });
  }, [isAIMode]);
  
  if (!selectedChannel) {
    return (
      <StyledEmptyState>
        <Text color="gray.500">채널을 선택해주세요</Text>
      </StyledEmptyState>
    );
  }
  
  return (
    <StyledInputContainer isAIMode={isAIMode}>
      {/* 첨부파일 메뉴 */}
      {showAttachments && (
        <StyledAttachmentMenu>
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontSize="sm" fontWeight="600">파일 첨부</Text>
            <IconButton
              aria-label="닫기"
              size="xs"
              variant="ghost"
              onClick={() => setShowAttachments(false)}
            >
              <X size={14} />
            </IconButton>
          </Flex>
          <Grid templateColumns="repeat(3, 1fr)" gap={2}>
            <StyledMenuButton onClick={() => fileInputRef.current?.click()}>
              <File size={20} />
              <span>파일</span>
            </StyledMenuButton>
            <StyledMenuButton
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = 'image/*';
                  fileInputRef.current.click();
                }
              }}
            >
              <Image size={20} />
              <span>이미지</span>
            </StyledMenuButton>
            <StyledMenuButton onClick={toggleAIMode}>
              <Sparkles size={20} color={isAIMode ? '#8B5CF6' : 'currentColor'} />
              <span>AI 모드</span>
            </StyledMenuButton>
          </Grid>
        </StyledAttachmentMenu>
      )}
      
      {/* 도구 메뉴 */}
      {showToolsMenu && (
        <StyledToolsMenu>
          <Flex justify="space-between" align="center" mb={3}>
            <Text fontSize="sm" fontWeight="600">도구</Text>
            <IconButton
              aria-label="닫기"
              size="xs"
              variant="ghost"
              onClick={() => setShowToolsMenu(false)}
            >
              <X size={14} />
            </IconButton>
          </Flex>
          <VStack align="stretch" gap={1}>
            <StyledToolOption>
              <Zap size={16} />
              <Text fontSize="sm">빠른 답변</Text>
              <Badge size="xs" colorScheme="purple" ml="auto">Beta</Badge>
            </StyledToolOption>
            <StyledToolOption>
              <Settings size={16} />
              <Text fontSize="sm">설정</Text>
            </StyledToolOption>
          </VStack>
        </StyledToolsMenu>
      )}
      
      {/* 모델 선택기 */}
      {showModelSelector && isAIMode && (
        <StyledModelSelector>
          <Text fontSize="xs" fontWeight="600" color="gray.600" mb={2}>AI 모델 선택</Text>
          {AI_MODELS.map(model => (
            <StyledModelOption
              key={model.id}
              onClick={() => {
                setSelectedModel(model);
                setShowModelSelector(false);
              }}
              isSelected={selectedModel.id === model.id}
            >
              <Box>
                <Flex align="center" gap={2}>
                  <Text fontSize="sm" fontWeight="500">{model.name}</Text>
                  {model.badge && (
                    <Badge size="xs" colorScheme="purple">{model.badge}</Badge>
                  )}
                </Flex>
                <Text fontSize="xs" color="gray.500">{model.description}</Text>
              </Box>
            </StyledModelOption>
          ))}
        </StyledModelSelector>
      )}
      
      {/* 메인 입력 영역 */}
      <StyledMainInput>
        <StyledInputWrapper isAIMode={isAIMode}>
          {/* 입력 필드 */}
          <StyledContentEditable
            ref={textareaRef}
            contentEditable
            role="textbox"
            aria-label={isAIMode ? 'AI에게 질문하기' : `#${selectedChannel.name}에 메시지 보내기`}
            aria-multiline="true"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            data-placeholder={
              isAIMode
                ? 'AI에게 무엇이든 물어보세요...'
                : `#${selectedChannel.name}에 메시지 보내기...`
            }
            suppressContentEditableWarning
          />
          
          {/* 하단 컨트롤 */}
          <StyledBottomControls>
            <HStack gap={1}>
              {/* 왼쪽 버튼들 */}
              <StyledIconButton
                onClick={() => setShowAttachments(!showAttachments)}
                isActive={showAttachments}
                title="첨부파일"
              >
                <Plus size={16} />
              </StyledIconButton>
              
              <StyledIconButton
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                isActive={showToolsMenu}
                title="도구"
              >
                <Settings size={16} />
              </StyledIconButton>
              
              {/* AI 모드 토글 */}
              <StyledAIToggle
                onClick={toggleAIMode}
                isActive={isAIMode}
                title={isAIMode ? 'AI 모드 끄기' : 'AI 모드 켜기'}
              >
                {isAIMode ? <Bot size={16} /> : <Users size={16} />}
              </StyledAIToggle>
            </HStack>
            
            {/* 오른쪽 영역 */}
            <HStack gap={2}>
              {/* AI 모델 선택 (AI 모드일 때만) */}
              {isAIMode && (
                <StyledModelButton
                  onClick={() => setShowModelSelector(!showModelSelector)}
                >
                  <span>{selectedModel.name}</span>
                  <ChevronDown size={14} />
                </StyledModelButton>
              )}
              
              {/* 전송 버튼 */}
              <StyledSendButton
                disabled={!localMessageInput.trim() || isSendingMessage}
                onClick={() => {
                  if (localMessageInput.trim()) {
                    handleSendMessage();
                    if (textareaRef.current) {
                      textareaRef.current.textContent = '';
                    }
                    setLocalMessageInput('');
                    setMessageInput('');
                  }
                }}
                isAIMode={isAIMode}
                title="메시지 보내기"
              >
                <Send size={16} />
              </StyledSendButton>
            </HStack>
          </StyledBottomControls>
        </StyledInputWrapper>
      </StyledMainInput>
      
      {/* 숨겨진 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </StyledInputContainer>
  );
};

export default ModernMessageInput;

// Styled Components
const StyledInputContainer = styled(Box)<{ isAIMode: boolean }>`
  position: relative;
  background: ${props => props.isAIMode ?
  'linear-gradient(to bottom, #faf9fb, #ffffff)' :
  '#ffffff'};
  border-top: 1px solid #e5e7eb;
  transition: all 0.3s ease;
`;

const StyledEmptyState = styled(Box)`
  padding: 1.5rem;
  text-align: center;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const StyledAttachmentMenu = styled(Box)`
  position: absolute;
  bottom: 100%;
  left: 1rem;
  right: 1rem;
  margin-bottom: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 10;
  animation: slideUp 0.2s ease;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const StyledToolsMenu = styled(StyledAttachmentMenu)`
  left: auto;
  right: 1rem;
  width: 250px;
`;

const StyledMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
    transform: translateY(-1px);
  }
  
  span {
    font-size: 0.75rem;
    color: #4b5563;
  }
`;

const StyledToolOption = styled(Flex)`
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const StyledModelSelector = styled(Box)`
  position: absolute;
  bottom: 100%;
  right: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 20;
  min-width: 200px;
`;

const StyledModelOption = styled(Box)<{ isSelected: boolean }>`
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  background: ${props => props.isSelected ? '#f3f4f6' : 'transparent'};
  transition: background 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const StyledMainInput = styled(Box)`
  padding: 0.75rem 1rem 1rem;
`;

const StyledInputWrapper = styled(Box)<{ isAIMode: boolean }>`
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid ${props => props.isAIMode ? '#a78bfa' : '#d1d5db'};
  border-radius: 16px;
  transition: all 0.2s;
  
  &:focus-within {
    border-color: ${props => props.isAIMode ? '#8b5cf6' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.isAIMode ?
  'rgba(139, 92, 246, 0.1)' :
  'rgba(59, 130, 246, 0.1)'};
  }
`;

const StyledContentEditable = styled.div`
  min-height: 3rem;
  max-height: 10rem;
  overflow-y: auto;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #111827;
  outline: none;
  
  &:empty::before {
    content: attr(data-placeholder);
    color: #9ca3af;
    pointer-events: none;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f3f4f6;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
    
    &:hover {
      background: #9ca3af;
    }
  }
`;

const StyledBottomControls = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f3f4f6;
`;

const StyledIconButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.isActive ? '#e5e7eb' : 'transparent'};
  color: ${props => props.isActive ? '#4b5563' : '#9ca3af'};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const StyledAIToggle = styled(StyledIconButton)`
  background: ${props => props.isActive ?
  'linear-gradient(135deg, #667eea, #764ba2)' :
  'transparent'};
  color: ${props => props.isActive ? 'white' : '#9ca3af'};
  
  &:hover {
    background: ${props => props.isActive ?
  'linear-gradient(135deg, #667eea, #764ba2)' :
  '#f3f4f6'};
    color: ${props => props.isActive ? 'white' : '#4b5563'};
  }
`;

const StyledModelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const StyledSendButton = styled.button<{ isAIMode: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.isAIMode ?
  'linear-gradient(135deg, #667eea, #764ba2)' :
  '#3b82f6'};
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
`;