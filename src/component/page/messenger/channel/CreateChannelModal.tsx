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
              <DialogTitle>Create New Channel</DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />
            <DialogBody>
              <VStack gap={4}>
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    Channel Name
                  </Text>
                  <Input
                    placeholder="e.g. Friends room"
                    value={channelData.name}
                    onChange={(e) => onUpdateField('name', e.target.value)}
                  />
                </Box>
                
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    Channel Type
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
                    <option value="PUBLIC">Public Channel</option>
                    <option value="PRIVATE">Private Channel</option>
                    <option value="GROUP">Group Channel</option>
                    <option value="DIRECT_MESSAGE">Direct Message</option>
                    <option value="ANNOUNCEMENT">Announcement Channel</option>
                  </select>
                </Box>
                
                <Box w="full">
                  <Text mb={2} fontSize="sm" fontWeight="medium">
                    Description (Optional)
                  </Text>
                  <Textarea
                    placeholder="Enter a brief description of the channel"
                    value={channelData.description}
                    onChange={(e) => onUpdateField('description', e.target.value)}
                    rows={3}
                  />
                </Box>
              </VStack>
            </DialogBody>
            <DialogFooter>
              <Button mr={3} onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={onSubmit}
                loading={isLoading}
                disabled={!channelData.name.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default CreateChannelModal;