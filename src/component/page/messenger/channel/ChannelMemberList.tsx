// src/component/page/messenger/channel/ChannelMemberList.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Text,
  IconButton,
  Input,
  Button,
  Badge,
  Heading,
  Separator,
  createToaster
} from '@chakra-ui/react';
import {
  X,
  Search,
  UserPlus,
  Circle,
  Bell,
  BellOff
} from 'lucide-react';
import { useAtom } from 'jotai';
import { currentUserAtom, selectedChannelAtom } from '../../../../stores/messengerStore/messengerStore';
import {
  useChannelMembers,
  useOnlineMembers,
  useRemoveMember,
  useUpdateMyNickname,
  useUpdateNotificationSettings
} from '../../../../hooks/useMessengerQueries';
import MemberItem from "./MemberItems";
import InviteUserModal from "./InviteUserModal";

const toaster = createToaster({
  placement: 'top-right',
});

interface ChannelMemberListProps {
  channelId: string;
  isVisible: boolean;
  onClose: () => void;
  currentUserId: string;
}

export default function ChannelMemberList({
                                            channelId,
                                            isVisible,
                                            onClose,
                                            currentUserId
                                          }: ChannelMemberListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentUser] = useAtom(currentUserAtom);
  const [selectedChannel] = useAtom(selectedChannelAtom);
  
  // 실제 데이터 가져오기
  const { data: members = [], isLoading, refetch: refetchMembers } = useChannelMembers(channelId);
  const { data: onlineMembers = [] } = useOnlineMembers(channelId);
  
  // Mutations
  const removeMemberMutation = useRemoveMember();
  const updateNicknameMutation = useUpdateMyNickname();
  const updateNotificationMutation = useUpdateNotificationSettings();
  
  // 초대 모달이 닫힐 때 멤버 목록 새로고침
  const handleInviteModalClose = () => {
    setShowInviteModal(false);
    refetchMembers(); // 멤버 목록 새로고침
  };
  
  // 온라인 상태 맵 생성
  const onlineMemberIds = new Set(onlineMembers.map(m => m.userId));
  
  // 멤버 필터링 및 정렬
  const filteredMembers = members.filter(member =>
    (member.nickname || member.userId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 상태별로 그룹화
  const activeMembersOnline = filteredMembers.filter(m =>
    m.status === 'ACTIVE' && onlineMemberIds.has(m.userId)
  );
  
  const activeMembersOffline = filteredMembers.filter(m =>
    m.status === 'ACTIVE' && !onlineMemberIds.has(m.userId)
  );
  
  const inactiveMembers = filteredMembers.filter(m =>
    m.status === 'INACTIVE' || m.status === 'LEFT'
  );
  
  const bannedMembers = filteredMembers.filter(m => m.status === 'BANNED');
  
  const handleMemberClick = (memberId: string) => {
    setSelectedMember(selectedMember === memberId ? null : memberId);
  };
  
  const handleInviteMember = () => {
    setShowInviteModal(true);
  };
  
  const handleRemoveMember = async (userId: string) => {
    if (window.confirm('정말 이 멤버를 채널에서 제거하시겠습니까?')) {
      try {
        await removeMemberMutation.mutateAsync({ channelId, userId });
        toaster.create({
          title: '멤버를 제거했습니다',
          status: 'success',
          duration: 2000
        });
        refetchMembers();
      } catch (error) {
        toaster.create({
          title: '멤버 제거 실패',
          status: 'error',
          duration: 2000
        });
      }
    }
  };
  
  const handleUpdateNickname = async () => {
    if (!newNickname.trim()) return;
    
    try {
      await updateNicknameMutation.mutateAsync({
        channelId,
        nickname: newNickname
      });
      setEditingNickname(false);
      setNewNickname('');
      toaster.create({
        title: '닉네임이 변경되었습니다',
        status: 'success',
        duration: 2000
      });
      refetchMembers();
    } catch (error) {
      toaster.create({
        title: '닉네임 변경 실패',
        status: 'error',
        duration: 2000
      });
    }
  };
  
  const handleToggleNotifications = async (member: any) => {
    try {
      const newLevel = member.notificationLevel === 'NONE' ? 'ALL' :
        member.notificationLevel === 'ALL' ? 'MENTIONS_ONLY' : 'NONE';
      
      await updateNotificationMutation.mutateAsync({
        channelId,
        level: newLevel,
        enabled: newLevel !== 'NONE'
      });
      
      toaster.create({
        title: '알림 설정이 변경되었습니다',
        status: 'success',
        duration: 2000
      });
      refetchMembers();
    } catch (error) {
      toaster.create({
        title: '알림 설정 변경 실패',
        status: 'error',
        duration: 2000
      });
    }
  };
  
  const getMemberStatusBadge = (status: string) => {
    switch(status) {
      case 'BANNED':
        return (
          <Badge size="xs" colorPalette="red" variant="subtle">
            차단됨
          </Badge>
        );
      case 'LEFT':
        return (
          <Badge size="xs" colorPalette="gray" variant="subtle">
            나감
          </Badge>
        );
      case 'INACTIVE':
        return (
          <Badge size="xs" colorPalette="yellow" variant="subtle">
            비활성
          </Badge>
        );
      case 'PENDING_APPROVAL':
        return (
          <Badge size="xs" colorPalette="blue" variant="subtle">
            승인 대기
          </Badge>
        );
      default:
        return null;
    }
  };
  
  const getNotificationIcon = (level: string) => {
    switch(level) {
      case 'ALL':
        return <Bell size={14} className="text-green-500" />;
      case 'MENTIONS_ONLY':
        return <Bell size={14} className="text-yellow-500" />;
      case 'NONE':
        return <BellOff size={14} className="text-gray-400" />;
      default:
        return <Bell size={14} />;
    }
  };
  
  const formatLastSeen = (dateString: string) => {
    if (!dateString) return '알 수 없음';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      <Box
        position="absolute"
        right={0}
        top={0}
        h="100%"
        w="320px"
        bg="white"
        borderLeft="1px solid"
        borderColor="gray.200"
        shadow="lg"
        zIndex={1000}
      >
        <Flex direction="column" h="full">
          {/* 헤더 */}
          <Flex
            align="center"
            justify="space-between"
            p={4}
            borderBottom="1px solid"
            borderColor="gray.200"
            bg="gray.50"
            height="4rem"
          >
            <Heading size="md">채널 멤버</Heading>
            <HStack gap={2}>
              <Button
                size="sm"
                variant="ghost"
                colorPalette="blue"
                onClick={handleInviteMember}
              >
                <UserPlus size={16} />
                초대
              </Button>
              <IconButton
                size="sm"
                variant="ghost"
                onClick={onClose}
                aria-label="닫기"
              >
                <X size={20} />
              </IconButton>
            </HStack>
          </Flex>
          
          {/* 검색 */}
          <Box p={4}>
            <HStack>
              <Search size={16} color="gray" />
              <Input
                placeholder="멤버 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
              />
            </HStack>
          </Box>
          
          {/* 멤버 통계 */}
          <HStack px={4} pb={2} gap={4}>
            <Text fontSize="sm" color="gray.600">
              전체 {members.length}명
            </Text>
            <HStack gap={1}>
              <Circle size={8} className="text-green-500 fill-green-500" />
              <Text fontSize="sm" color="gray.600">
                온라인 {activeMembersOnline.length}명
              </Text>
            </HStack>
          </HStack>
          
          <Separator />
          
          {/* 멤버 목록 */}
          <Box flex={1} overflowY="auto" px={2}>
            {isLoading ? (
              <Flex justify="center" align="center" py={8}>
                <Text color="gray.500">멤버 목록을 불러오는 중...</Text>
              </Flex>
            ) : (
              <VStack align="stretch" gap={1} py={2}>
                {/* 온라인 멤버 */}
                {activeMembersOnline.length > 0 && (
                  <>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={2} pt={2}>
                      온라인 — {activeMembersOnline.length}
                    </Text>
                    {activeMembersOnline.map((member) => (
                      <MemberItem
                        key={member.id}
                        member={member}
                        isOnline={true}
                        isSelected={selectedMember === member.id}
                        isCurrentUser={member.userId === currentUser?.id}
                        onClick={() => handleMemberClick(member.id)}
                        onRemove={() => handleRemoveMember(member.userId)}
                        onToggleNotifications={() => handleToggleNotifications(member)}
                        getMemberStatusBadge={getMemberStatusBadge}
                        getNotificationIcon={getNotificationIcon}
                        formatLastSeen={formatLastSeen}
                      />
                    ))}
                  </>
                )}
                
                {/* 오프라인 멤버 */}
                {activeMembersOffline.length > 0 && (
                  <>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={2} pt={4}>
                      오프라인 — {activeMembersOffline.length}
                    </Text>
                    {activeMembersOffline.map((member) => (
                      <MemberItem
                        key={member.id}
                        member={member}
                        isOnline={false}
                        isSelected={selectedMember === member.id}
                        isCurrentUser={member.userId === currentUser?.id}
                        onClick={() => handleMemberClick(member.id)}
                        onRemove={() => handleRemoveMember(member.userId)}
                        onToggleNotifications={() => handleToggleNotifications(member)}
                        getMemberStatusBadge={getMemberStatusBadge}
                        getNotificationIcon={getNotificationIcon}
                        formatLastSeen={formatLastSeen}
                      />
                    ))}
                  </>
                )}
                
                {/* 차단된 멤버 */}
                {bannedMembers.length > 0 && (
                  <>
                    <Text fontSize="xs" fontWeight="semibold" color="gray.500" px={2} pt={4}>
                      차단됨 — {bannedMembers.length}
                    </Text>
                    {bannedMembers.map((member) => (
                      <MemberItem
                        key={member.id}
                        member={member}
                        isOnline={false}
                        isSelected={selectedMember === member.id}
                        isCurrentUser={member.userId === currentUser?.id}
                        onClick={() => handleMemberClick(member.id)}
                        onRemove={() => handleRemoveMember(member.userId)}
                        onToggleNotifications={() => handleToggleNotifications(member)}
                        getMemberStatusBadge={getMemberStatusBadge}
                        getNotificationIcon={getNotificationIcon}
                        formatLastSeen={formatLastSeen}
                      />
                    ))}
                  </>
                )}
                
                {/* 멤버가 없을 때 */}
                {filteredMembers.length === 0 && (
                  <Flex justify="center" align="center" py={8}>
                    <VStack>
                      <Text color="gray.500" fontSize="sm">
                        {searchQuery ? '검색 결과가 없습니다' : '채널에 멤버가 없습니다'}
                      </Text>
                      {!searchQuery && (
                        <Button
                          size="sm"
                          colorPalette="blue"
                          variant="outline"
                          onClick={handleInviteMember}
                        >
                          첫 멤버 초대하기
                        </Button>
                      )}
                    </VStack>
                  </Flex>
                )}
              </VStack>
            )}
          </Box>
        </Flex>
      </Box>
      
      {/* 사용자 초대 모달 */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={handleInviteModalClose}
        channelId={channelId}
        channelName={selectedChannel?.name || ''}
      />
    </>
  );
}