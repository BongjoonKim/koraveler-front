// src/component/page/messenger/channel/InviteUserModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Badge,
  Spinner,
  createToaster, Portal, Dialog,
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
  Search,
  UserPlus,
  Users,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useSearchUsersNotInChannel } from '../../../../hooks/useUserQueries';
import { useAddMember } from '../../../../hooks/useMessengerQueries';
import CusAvatar from '../../../../common/elements/CusAvatar';

const toaster = createToaster({
  placement: 'top',
});

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
}

interface User {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  src?: string; // profileImage
  status?: string;
}

export default function InviteUserModal({
                                          isOpen,
                                          onClose,
                                          channelId,
                                          channelName
                                        }: InviteUserModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isInviting, setIsInviting] = useState(false);
  
  // 디바운스된 검색어
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // 사용자 검색 쿼리
  const {
    data: searchResult,
    isLoading: isSearching,
    isFetching
  } = useSearchUsersNotInChannel(channelId, debouncedSearchQuery);
  
  // 멤버 추가 뮤테이션
  const addMemberMutation = useAddMember();
  
  // 모달 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedUsers(new Set());
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
    if (!searchResult?.users) return;
    
    const allUserIds = searchResult.users.map((u: User) => u.userId);
    const allSelected = allUserIds.every((id: string) => selectedUsers.has(id));
    
    if (allSelected) {
      // 전체 해제
      setSelectedUsers(new Set());
    } else {
      // 전체 선택
      setSelectedUsers(new Set(allUserIds));
    }
  };
  
  // 선택한 사용자들 초대
  const handleInviteUsers = async () => {
    if (selectedUsers.size === 0) {
      toaster.create({
        title: '초대할 사용자를 선택해주세요',
        status: 'warning',
        duration: 2000
      });
      return;
    }
    
    setIsInviting(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      // 선택한 각 사용자를 채널에 추가
      const invitePromises = Array.from(selectedUsers).map(async (userId) => {
        try {
          await addMemberMutation.mutateAsync({ channelId, userId });
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
          duration: 3000
        });
      }
      
      if (failCount > 0) {
        toaster.create({
          title: `${failCount}명의 사용자 초대에 실패했습니다`,
          status: 'error',
          duration: 3000
        });
      }
      
      // 성공한 경우 모달 닫기
      if (successCount > 0) {
        onClose();
      }
    } catch (error) {
      console.error('사용자 초대 실패:', error);
      toaster.create({
        title: '사용자 초대에 실패했습니다',
        description: '다시 시도해주세요',
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsInviting(false);
    }
  };
  
  // 검색 결과 없을 때 메시지
  const getEmptyMessage = () => {
    if (!searchQuery) {
      return '사용자 이름이나 ID로 검색해보세요';
    }
    if (debouncedSearchQuery !== searchQuery) {
      return '검색 중...';
    }
    return `"${searchQuery}"에 대한 검색 결과가 없습니다`;
  };
  
  const users = searchResult?.users || [];
  const hasResults = users.length > 0;
  const isSearchActive = searchQuery.length >= 2;
  
  return (
    <Dialog.Root open={isOpen} onOpenChange={(details: { open: boolean }) => details.open || onClose()}>
      <Portal>
        <Dialog.Positioner>
      <DialogContent maxWidth="500px">
        <DialogHeader>
          <DialogTitle>
            <HStack>
              <UserPlus size={20} />
              <Text>#{channelName} 채널에 사용자 초대</Text>
            </HStack>
          </DialogTitle>
        </DialogHeader>
        <DialogCloseTrigger />
        
        <DialogBody>
          <VStack gap={4} align="stretch">
            {/* 검색 입력 */}
            <Box>
              <HStack>
                <Search size={18} color="gray" />
                <Input
                  placeholder="사용자 이름 또는 ID로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </HStack>
              {searchQuery.length > 0 && searchQuery.length < 2 && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  최소 2글자 이상 입력해주세요
                </Text>
              )}
            </Box>
            
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
            
            {/* 검색 결과 */}
            <Box
              maxH="400px"
              overflowY="auto"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              bg="gray.50"
            >
              {/* 로딩 상태 */}
              {(isSearching || isFetching) && isSearchActive ? (
                <Flex justify="center" align="center" py={8}>
                  <VStack>
                    <Spinner size="lg" color="blue.500" />
                    <Text fontSize="sm" color="gray.600">검색 중...</Text>
                  </VStack>
                </Flex>
              ) : hasResults ? (
                <VStack align="stretch" gap={0} p={2}>
                  {/* 전체 선택 체크박스 */}
                  {users.length > 1 && (
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
                        checked={users.every((u: User) => selectedUsers.has(u.userId))}
                        indeterminate={
                          users.some((u: User) => selectedUsers.has(u.userId)) &&
                          !users.every((u: User) => selectedUsers.has(u.userId))
                        }
                        onCheckedChange={handleToggleAll}
                      >
                        <Checkbox.Control />
                        <Checkbox.Label>
                          <Text fontSize="sm" fontWeight="medium">
                            전체 선택 ({users.length}명)
                          </Text>
                        </Checkbox.Label>
                      </Checkbox.Root>
                    </HStack>
                  )}
                  
                  {/* 사용자 목록 */}
                  {users.map((user: User) => (
                    <HStack
                      key={user.id}
                      px={3}
                      py={2}
                      bg="white"
                      borderRadius="md"
                      _hover={{ bg: 'gray.50' }}
                      cursor="pointer"
                      onClick={() => handleToggleUser(user.userId)}
                      gap={3}
                    >
                      <Checkbox.Root
                        checked={selectedUsers.has(user.userId)}
                        onCheckedChange={() => {}}
                        pointerEvents="none"
                      >
                        <Checkbox.Control />
                      </Checkbox.Root>
                      
                      <CusAvatar
                        name={user.name || user.userId}
                        src={user.src}
                        size="sm"
                      />
                      
                      <VStack align="start" gap={0} flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          {user.name || user.userId}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          @{user.userId}
                        </Text>
                        {user.email && (
                          <Text fontSize="xs" color="gray.400">
                            {user.email}
                          </Text>
                        )}
                      </VStack>
                      
                      {user.status === 'ACTIVE' ? (
                        <Badge size="xs" colorPalette="green" variant="subtle">
                          활성
                        </Badge>
                      ) : (
                        <Badge size="xs" colorPalette="gray" variant="subtle">
                          비활성
                        </Badge>
                      )}
                    </HStack>
                  ))}
                </VStack>
              ) : (
                /* 검색 결과 없음 */
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  py={8}
                  gap={3}
                >
                  <Users size={48} className="text-gray-400" />
                  <Text fontSize="md" fontWeight="medium" color="gray.700">
                    {getEmptyMessage()}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {!searchQuery
                      ? "초대할 사용자를 검색하여 선택하세요"
                      : "다른 검색어를 시도해보세요"
                    }
                  </Text>
                </Flex>
              )}
            </Box>
            
            {/* 안내 메시지 */}
            <HStack px={2} gap={2}>
              <AlertCircle size={14} className="text-blue-500" />
              <Text fontSize="xs" color="gray.600">
                이미 채널에 있는 사용자는 검색 결과에 표시되지 않습니다
              </Text>
            </HStack>
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
                : '초대하기'
              }
            </Button>
          </HStack>
        </DialogFooter>
      </DialogContent>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}