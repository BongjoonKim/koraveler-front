// Follow 도메인 타입

export interface FollowStatusDTO {
  targetUserId: string;
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
}

export interface FollowUserDTO {
  userId: string;
  name?: string;
  src?: string;
}
