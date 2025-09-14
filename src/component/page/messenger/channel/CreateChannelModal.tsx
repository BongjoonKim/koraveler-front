// src/component/page/messenger/channel/CreateChannelModal.tsx
import React from 'react';
import {
  Box,
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  Dialog,
  Portal,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogCloseTrigger,
  DialogBody,
  DialogFooter,
} from '@chakra-ui/react';
import type { Channel } from '../../../../types/messenger/messengerTypes';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  channelData: {
    name: string;
    description: string;
    channelType: Channel['channelType'];
  };
  onUpdateField: (field: string, value: string) => void;
  isLoading?: boolean;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 onSubmit,
                                                                 channelData,
                                                                 onUpdateField,
                                                                 isLoading = false
                                                               }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={() => onClose()}>
      <Portal>
        <Dialog.Positioner>
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
                    value={channelData.name}
                    onChange={(e) => onUpdateField('name', e.target.value)}
                  />
                </Box>
                
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    채널 타입
                  </Text>
                  <select
                    value={channelData.channelType}
                    onChange={(e) => onUpdateField('channelType', e.target.value)}
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
                    <option value="DIRECT_MESSAGE">다이렉트 메시지</option>
                    <option value="ANNOUNCEMENT">공지 채널</option>
                  </select>
                </Box>
                
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    설명 (선택사항)
                  </Text>
                  <Textarea
                    placeholder="채널에 대한 간단한 설명을 입력하세요"
                    value={channelData.description}
                    onChange={(e) => onUpdateField('description', e.target.value)}
                    rows={3}
                  />
                </Box>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <Button mr={3} onClick={onClose} variant="outline">
                취소
              </Button>
              <Button
                colorScheme="blue"
                onClick={onSubmit}
                loading={isLoading}
                disabled={!channelData.name.trim()}
              >
                만들기
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateChannelModal;