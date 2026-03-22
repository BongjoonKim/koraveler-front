// src/component/page/messenger/channel/TravelInviteModal.tsx
// Travel 프로젝트 멤버만 채널에 초대할 수 있는 모달
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Spinner,
  createToaster,
  Portal,
  Dialog,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogCloseTrigger,
} from '@chakra-ui/react';
import { Checkbox } from '@chakra-ui/react';
import {
  UserPlus,
  Users,
  UserCheck,
  Shield,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import {
  useAvailableMembersForChannel,
  useAddTravelChannelMember,
} from '../../../../hooks/useTravelChannelQueries';
import CusAvatar from '../../../../common/elements/CusAvatar';
import { TravelChannelMemberResponse } from '../../../../types/travel/travelChannelTypes';

const toaster = createToaster({
  placement: 'top',
});

interface TravelInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelId: string;
  travelChannelId: string;
  channelName: string;
}

export default function TravelInviteModal({
  isOpen,
  onClose,
  travelId,
  travelChannelId,
  channelName,
}: TravelInviteModalProps) {
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isInviting, setIsInviting] = useState(false);

  // Travel 프로젝트 멤버 중 채널에 없는 사용자 조회
  const {
    data: availableMembers = [],
    isLoading,
    refetch,
  } = useAvailableMembersForChannel(
    isOpen ? travelId : undefined,
    isOpen ? travelChannelId : undefined
  );

  // 멤버 추가 mutation
  const addMemberMutation = useAddTravelChannelMember(travelId);

  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedUsers(new Set());
      refetch();
    }
  }, [isOpen]);

  // 사용자 선택/해제
  const handleToggleUser = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  // 전체 선택/해제
  const handleToggleAll = () => {
    const allUserIds = availableMembers.map((u) => u.userId);
    const allSelected = allUserIds.every((id) => selectedUsers.has(id));

    if (allSelected) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(allUserIds));
    }
  };

  // 선택한 사용자들 초대
  const handleInviteUsers = async () => {
    if (selectedUsers.size === 0) {
      toaster.create({
        title: '초대할 사용자를 선택해주세요',
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    setIsInviting(true);
    let successCount = 0;
    let failCount = 0;

    try {
      const invitePromises = Array.from(selectedUsers).map(async (userId) => {
        try {
          await addMemberMutation.mutateAsync({
            travelChannelId,
            targetUserId: userId,
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to invite ${userId}:`, error);
          failCount++;
        }
      });

      await Promise.allSettled(invitePromises);

      if (successCount > 0) {
        toaster.create({
          title: `${successCount}명의 사용자를 초대했습니다`,
          status: 'success',
          duration: 3000,
        });
      }

      if (failCount > 0) {
        toaster.create({
          title: `${failCount}명의 사용자 초대에 실패했습니다`,
          status: 'error',
          duration: 3000,
        });
      }

      if (successCount > 0) {
        onClose();
      }
    } catch (error) {
      console.error('사용자 초대 실패:', error);
      toaster.create({
        title: '사용자 초대에 실패했습니다',
        description: '다시 시도해주세요',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsInviting(false);
    }
  };

  // 역할 아이콘
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <ShieldCheck size={12} />;
      case 'VIEWER':
        return <Eye size={12} />;
      default:
        return <Shield size={12} />;
    }
  };

  // 역할 색상
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'purple';
      case 'VIEWER':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(details: { open: boolean }) => details.open || onClose()}
    >
      <Portal>
        <Dialog.Positioner>
          <DialogContent maxWidth="500px">
            <DialogHeader>
              <DialogTitle>
                <HStack>
                  <UserPlus size={20} />
                  <Text>#{channelName} 채널에 멤버 초대</Text>
                </HStack>
              </DialogTitle>
            </DialogHeader>
            <DialogCloseTrigger />

            <DialogBody>
              <VStack gap={4} align="stretch">
                {/* 안내 메시지 */}
                <HStack
                  px={3}
                  py={2}
                  bg="blue.50"
                  borderRadius="md"
                  gap={2}
                >
                  <Users size={16} className="text-blue-500" />
                  <Text fontSize="xs" color="blue.700">
                    Travel 프로젝트 멤버만 채널에 초대할 수 있습니다
                  </Text>
                </HStack>

                {/* 선택된 사용자 수 표시 */}
                {selectedUsers.size > 0 && (
                  <HStack justify="space-between" px={2}>
                    <Text fontSize="sm" color="blue.600" fontWeight="medium">
                      {selectedUsers.size}명 선택됨
                    </Text>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => setSelectedUsers(new Set())}
                    >
                      선택 해제
                    </Button>
                  </HStack>
                )}

                {/* 멤버 목록 */}
                <Box
                  maxH="400px"
                  overflowY="auto"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  bg="gray.50"
                >
                  {isLoading ? (
                    <Flex justify="center" align="center" py={8}>
                      <VStack>
                        <Spinner size="lg" color="blue.500" />
                        <Text fontSize="sm" color="gray.600">
                          멤버 목록 로딩 중...
                        </Text>
                      </VStack>
                    </Flex>
                  ) : availableMembers.length > 0 ? (
                    <VStack align="stretch" gap={0} p={2}>
                      {/* 전체 선택 */}
                      {availableMembers.length > 1 && (
                        <HStack
                          px={3}
                          py={2}
                          borderBottom="1px solid"
                          borderColor="gray.200"
                          bg="white"
                          borderRadius="md"
                          mb={2}
                        >
                          <Checkbox.Root
                            checked={availableMembers.every((u) =>
                              selectedUsers.has(u.userId)
                            )}
                            indeterminate={
                              availableMembers.some((u) =>
                                selectedUsers.has(u.userId)
                              ) &&
                              !availableMembers.every((u) =>
                                selectedUsers.has(u.userId)
                              )
                            }
                            onCheckedChange={handleToggleAll}
                          >
                            <Checkbox.Control />
                            <Checkbox.Label>
                              <Text fontSize="sm" fontWeight="medium">
                                전체 선택 ({availableMembers.length}명)
                              </Text>
                            </Checkbox.Label>
                          </Checkbox.Root>
                        </HStack>
                      )}

                      {/* 사용자 목록 */}
                      {availableMembers.map(
                        (member: TravelChannelMemberResponse) => (
                          <HStack
                            key={member.userId}
                            px={3}
                            py={2}
                            bg="white"
                            borderRadius="md"
                            _hover={{ bg: 'gray.50' }}
                            cursor="pointer"
                            onClick={() => handleToggleUser(member.userId)}
                            gap={3}
                          >
                            <Checkbox.Root
                              checked={selectedUsers.has(member.userId)}
                              onCheckedChange={() => {}}
                              pointerEvents="none"
                            >
                              <Checkbox.Control />
                            </Checkbox.Root>

                            <CusAvatar
                              name={
                                member.name || member.nickname || member.userId
                              }
                              src={member.src}
                              size="sm"
                            />

                            <VStack align="start" gap={0} flex={1}>
                              <Text fontSize="sm" fontWeight="medium">
                                {member.name ||
                                  member.nickname ||
                                  member.userId}
                              </Text>
                              {member.email && (
                                <Text fontSize="xs" color="gray.400">
                                  {member.email}
                                </Text>
                              )}
                            </VStack>

                            <Badge
                              size="xs"
                              colorPalette={getRoleColor(member.travelRole)}
                              variant="subtle"
                            >
                              <HStack gap={1}>
                                {getRoleIcon(member.travelRole)}
                                <Text>{member.travelRole}</Text>
                              </HStack>
                            </Badge>
                          </HStack>
                        )
                      )}
                    </VStack>
                  ) : (
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      py={8}
                      gap={3}
                    >
                      <UserCheck size={48} className="text-gray-400" />
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        color="gray.700"
                      >
                        모든 프로젝트 멤버가 이미 채널에 있습니다
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        새 멤버를 프로젝트에 먼저 추가해주세요
                      </Text>
                    </Flex>
                  )}
                </Box>
              </VStack>
            </DialogBody>

            <DialogFooter>
              <HStack gap={2}>
                <Button variant="outline" onClick={onClose} disabled={isInviting}>
                  취소
                </Button>
                <Button
                  colorPalette="blue"
                  onClick={handleInviteUsers}
                  disabled={selectedUsers.size === 0}
                  loading={isInviting}
                >
                  <UserCheck size={16} style={{ marginRight: '8px' }} />
                  {selectedUsers.size > 0
                    ? `${selectedUsers.size}명 초대하기`
                    : '초대하기'}
                </Button>
              </HStack>
            </DialogFooter>
          </DialogContent>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
