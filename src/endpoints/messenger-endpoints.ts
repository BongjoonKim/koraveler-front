// src/endpoints/messenger-endpoints.ts
import { request } from '../appConfig/request-response';
import { FuncProps } from '../utils/useAuthEP';

// ===== 채널 관련 엔드포인트 =====

// 내 채널 목록 조회
export const getMyChannels = async (props: FuncProps) => {
  return await request.get('/api/v1/channels/my-channels', {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: props.params
  });
};

// 공개 채널 목록 조회
export const getPublicChannels = async (props: FuncProps) => {
  return await request.get('/api/v1/channels/public', {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: props.params
  });
};

// 채널 검색
export const searchChannels = async (props: FuncProps) => {
  return await request.get('/api/v1/channels/search', {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: props.params
  });
};

// 채널 상세 조회
export const getChannel = async (props: FuncProps) => {
  return await request.get(`/api/v1/channels/${props.params.channelId}`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 채널 생성
export const createChannel = async (props: FuncProps) => {
  return await request.post('/api/v1/channels', props.params, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 채널 수정
export const updateChannel = async (props: FuncProps) => {
  return await request.put(`/api/v1/channels/${props.params.channelId}`, props.params.data, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 채널 삭제
export const deleteChannel = async (props: FuncProps) => {
  return await request.delete(`/api/v1/channels/${props.params.channelId}`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 채널 참여
export const joinChannel = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/${props.params.channelId}/join`, props.params.data, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 채널 탈퇴
export const leaveChannel = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/${props.params.channelId}/leave`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 초대 링크 생성
export const generateInviteLink = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/${props.params.channelId}/invite-link`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 초대 링크로 참여
export const joinByInviteLink = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/join-by-invite/${props.params.inviteCode}`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// ===== 메시지 관련 엔드포인트 =====

// 채널 메시지 조회
export const getChannelMessages = async (props: FuncProps) => {
  return await request.get(`/api/v1/messages/channels/${props.params.channelId}`, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: props.params
  });
};

// 메시지 전송
export const sendMessage = async (props: FuncProps) => {
  return await request.post('/api/v1/messages', props.params, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 메시지 수정
export const updateMessage = async (props: FuncProps) => {
  return await request.put(`/api/v1/messages/${props.params.messageId}`, props.params.data, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 메시지 삭제
export const deleteMessage = async (props: FuncProps) => {
  return await request.delete(`/api/v1/messages/${props.params.messageId}`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 메시지 검색
export const searchMessages = async (props: FuncProps) => {
  return await request.post('/api/v1/messages/search', props.params.searchRequest, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: { channelId: props.params.channelId }
  });
};

// 메시지 반응 추가
export const addReaction = async (props: FuncProps) => {
  return await request.post(`/api/v1/messages/${props.params.messageId}/reactions`, props.params.data, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 메시지 고정
export const pinMessage = async (props: FuncProps) => {
  return await request.post(`/api/v1/messages/${props.params.messageId}/pin`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 메시지 고정 해제
export const unpinMessage = async (props: FuncProps) => {
  return await request.delete(`/api/v1/messages/${props.params.messageId}/pin`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 읽음 처리
export const markAsRead = async (props: FuncProps) => {
  return await request.post(`/api/v1/messages/${props.params.messageId}/read`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: { channelId: props.params.channelId }
  });
};

// 채널 전체 읽음 처리
export const markChannelAsRead = async (props: FuncProps) => {
  return await request.post(`/api/v1/messages/channels/${props.params.channelId}/read`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 답글 조회
export const getReplies = async (props: FuncProps) => {
  return await request.get(`/api/v1/messages/${props.params.parentMessageId}/replies`, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: props.params
  });
};

// 멘션된 메시지 조회
export const getMentionedMessages = async (props: FuncProps) => {
  return await request.get('/api/v1/messages/mentions', {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: props.params
  });
};

// 안읽은 메시지 수 조회
export const getUnreadMessageCount = async (props: FuncProps) => {
  return await request.get(`/api/v1/messages/channels/${props.params.channelId}/unread-count`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// ===== 채널 멤버 관련 엔드포인트 =====

// 채널 멤버 목록 조회
export const getChannelMembers = async (props: FuncProps) => {
  return await request.get(`/api/v1/channels/${props.params.channelId}/members`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 온라인 멤버 조회
export const getOnlineMembers = async (props: FuncProps) => {
  return await request.get(`/api/v1/channels/${props.params.channelId}/members/online`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 멤버 추가
export const addMember = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/${props.params.channelId}/members/${props.params.userId}`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 멤버 제거
export const removeMember = async (props: FuncProps) => {
  return await request.delete(`/api/v1/channels/${props.params.channelId}/members/${props.params.userId}`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 내 닉네임 변경
export const updateMyNickname = async (props: FuncProps) => {
  return await request.put(`/api/v1/channels/${props.params.channelId}/members/my-nickname`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: { nickname: props.params.nickname }
  });
};

// 알림 설정 변경
export const updateNotificationSettings = async (props: FuncProps) => {
  return await request.put(`/api/v1/channels/${props.params.channelId}/members/my-notifications`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: { level: props.params.level, enabled: props.params.enabled }
  });
};

// 멤버 음소거
export const muteMember = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/${props.params.channelId}/members/${props.params.userId}/mute`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` },
    params: { muteMinutes: props.params.muteMinutes }
  });
};

// 멤버 음소거 해제
export const unmuteMember = async (props: FuncProps) => {
  return await request.delete(`/api/v1/channels/${props.params.channelId}/members/${props.params.userId}/mute`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 멤버 밴
export const banMember = async (props: FuncProps) => {
  return await request.post(`/api/v1/channels/${props.params.channelId}/members/${props.params.userId}/ban`, {}, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// 멤버 밴 해제
export const unbanMember = async (props: FuncProps) => {
  return await request.delete(`/api/v1/channels/${props.params.channelId}/members/${props.params.userId}/ban`, {
    headers: { Authorization: `Bearer ${props.accessToken}` }
  });
};

// ===== 파일 업로드 엔드포인트 =====

// 단일 파일 업로드
export const uploadFile = async (props: FuncProps) => {
  const formData = new FormData();
  formData.append('file', props.params.file);
  
  return await request.post('/api/v1/files/upload', formData, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 다중 파일 업로드
export const uploadMultipleFiles = async (props: FuncProps) => {
  const formData = new FormData();
  props.params.files.forEach((file: File) => {
    formData.append('files', file);
  });
  
  return await request.post('/api/v1/files/upload-multiple', formData, {
    headers: {
      Authorization: `Bearer ${props.accessToken}`,
      'Content-Type': 'multipart/form-data'
    }
  });
};