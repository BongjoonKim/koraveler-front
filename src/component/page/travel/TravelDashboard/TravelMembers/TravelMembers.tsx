import { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import {
  Users,
  Plus,
  Search,
  X,
  Shield,
  ShieldCheck,
  Eye,
  UserMinus,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { TravelMemberResponse, TravelRole } from "../../../../../types/travel/travelTypes";
import {
  useAddTravelMember,
  useRemoveTravelMember,
  useUpdateMemberRole,
} from "../../../../../hooks/useTravelQueries";
import { useSearchUsersNotInTravel } from "../../../../../hooks/useUserQueries";
import { useQueryClient } from "@tanstack/react-query";
import CusModal from "../../../../../common/elements/CusModal";

export interface TravelMembersProps {
  travelId: string;
  members?: TravelMemberResponse[];
  currentUserId?: string;
  isAdmin?: boolean;
}

function TravelMembers({
  travelId,
  members = [],
  currentUserId,
  isAdmin = false,
}: TravelMembersProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [addRole, setAddRole] = useState<"USER" | "VIEWER">("USER");

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const addMember = useAddTravelMember();
  const removeMember = useRemoveTravelMember();
  const updateRole = useUpdateMemberRole();

  // React Query 기반 사용자 검색 (이미 멤버인 사용자 서버에서 제외)
  const {
    data: searchResult,
    isLoading: isSearching,
    isFetching,
  } = useSearchUsersNotInTravel(travelId, debouncedKeyword);

  const searchUsers = searchResult?.users || [];

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // 검색어 debounce (300ms)
  const handleSearchInput = (keyword: string) => {
    setSearchKeyword(keyword);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (!keyword.trim()) {
      setDebouncedKeyword("");
      return;
    }

    searchTimerRef.current = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 300);
  };

  // 멤버 추가
  const handleAddMember = async (user: { userId: string }) => {
    try {
      await addMember.mutateAsync({
        travelId,
        reqBody: { userId: user.userId, role: addRole },
      });
      // 검색 결과 캐시 무효화 (추가된 사용자 제외를 위해)
      queryClient.invalidateQueries({
        queryKey: ["users", "available-for-travel", travelId],
      });
    } catch (err: any) {
      console.error("Failed to add member:", err);
    }
  };

  // 멤버 삭제
  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync({ travelId, userId });
      setConfirmRemove(null);
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("Failed to remove member:", err);
    }
  };

  // 역할 변경
  const handleRoleChange = async (userId: string, newRole: TravelRole) => {
    try {
      await updateRole.mutateAsync({ travelId, userId, role: newRole });
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("Failed to update role:", err);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setSearchKeyword("");
    setDebouncedKeyword("");
    setAddRole("USER");
  };

  return (
    <StyledTravelMembers>
      {/* 섹션 헤더 */}
      <div className="section-header">
        <h3 className="section-title">
          <Users size={16} />
          Members
          <span className="member-count">{members.length}</span>
        </h3>
        {isAdmin && (
          <button
            className="section-action"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* 멤버 목록 */}
      <div className="members-list">
        {members.map((member) => {
          const isSelf = member.userId === currentUserId;
          const isMenuOpen = openMenuId === member.userId;
          const isConfirming = confirmRemove === member.userId;

          return (
            <div key={member.userId} className="member-item">
              <div className="member-avatar">
                {(member.nickname || member.userId).charAt(0).toUpperCase()}
              </div>
              <div className="member-info">
                <span className="member-name">
                  {member.nickname || member.userId}
                  {isSelf && <span className="me-badge">me</span>}
                </span>
                <span
                  className={`member-role ${member.role?.toLowerCase()}`}
                >
                  {member.role === "ADMIN" ? (
                    <ShieldCheck size={10} />
                  ) : member.role === "VIEWER" ? (
                    <Eye size={10} />
                  ) : (
                    <Shield size={10} />
                  )}
                  {member.role}
                </span>
              </div>

              {/* ADMIN만 다른 멤버 관리 가능, 자기 자신은 관리 불가 */}
              {isAdmin && !isSelf && (
                <div className="member-actions" ref={isMenuOpen ? menuRef : null}>
                  <button
                    className="menu-trigger"
                    onClick={() =>
                      setOpenMenuId(isMenuOpen ? null : member.userId)
                    }
                  >
                    <ChevronDown size={14} />
                  </button>

                  {isMenuOpen && (
                    <div className="dropdown-menu">
                      {/* 역할 변경 */}
                      {member.role !== "ADMIN" && (
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleRoleChange(member.userId, "ADMIN")
                          }
                          disabled={updateRole.isPending}
                        >
                          <ShieldCheck size={14} />
                          Promote to Admin
                        </button>
                      )}
                      {member.role !== "USER" && (
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleRoleChange(member.userId, "USER")
                          }
                          disabled={updateRole.isPending}
                        >
                          <Shield size={14} />
                          {member.role === "ADMIN" ? "Demote to User" : "Promote to User"}
                        </button>
                      )}
                      {member.role !== "VIEWER" && (
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleRoleChange(member.userId, "VIEWER")
                          }
                          disabled={updateRole.isPending}
                        >
                          <Eye size={14} />
                          Set as Viewer
                        </button>
                      )}

                      {/* 멤버 삭제 */}
                      {!isConfirming ? (
                        <button
                          className="dropdown-item danger"
                          onClick={() => setConfirmRemove(member.userId)}
                        >
                          <UserMinus size={14} />
                          Remove Member
                        </button>
                      ) : (
                        <button
                          className="dropdown-item danger confirm"
                          onClick={() => handleRemoveMember(member.userId)}
                          disabled={removeMember.isPending}
                        >
                          {removeMember.isPending ? (
                            <Loader2 size={14} className="spin" />
                          ) : (
                            <UserMinus size={14} />
                          )}
                          Confirm Remove?
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {members.length === 0 && (
          <p className="empty-text">No members yet</p>
        )}
      </div>

      {/* 멤버 추가 모달 */}
      <CusModal
        title="Add Member"
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        size="sm"
      >
        <div className="add-member-body">
          {/* 역할 선택 */}
          <div className="role-selector">
            <span className="role-selector-label">Add as:</span>
            <button
              className={`role-option ${addRole === "USER" ? "active" : ""}`}
              onClick={() => setAddRole("USER")}
            >
              <Shield size={12} />
              User
            </button>
            <button
              className={`role-option ${addRole === "VIEWER" ? "active" : ""}`}
              onClick={() => setAddRole("VIEWER")}
            >
              <Eye size={12} />
              Viewer
            </button>
          </div>

          {/* 검색 입력 */}
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email (min 2 chars)..."
              value={searchKeyword}
              onChange={(e) => handleSearchInput(e.target.value)}
              autoFocus
            />
            {searchKeyword && (
              <button
                className="search-clear"
                onClick={() => {
                  setSearchKeyword("");
                  setDebouncedKeyword("");
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* 검색 결과 */}
          <div className="search-results">
            {searchKeyword.length >= 2 && searchKeyword.length < 2 && (
              <div className="search-hint">
                <span>Type at least 2 characters to search</span>
              </div>
            )}

            {(isSearching || isFetching) && debouncedKeyword.length >= 2 && (
              <div className="search-loading">
                <Loader2 size={18} className="spin" />
                <span>Searching...</span>
              </div>
            )}

            {!isSearching && !isFetching && debouncedKeyword.length >= 2 && searchUsers.length === 0 && (
              <div className="search-empty">
                <p>No users found</p>
                <span className="search-empty-hint">Already added members won't appear</span>
              </div>
            )}

            {searchUsers.map((user) => (
              <div key={user.id} className="search-user-item">
                <div className="search-user-avatar">
                  {(user.name || user.userId).charAt(0).toUpperCase()}
                </div>
                <div className="search-user-info">
                  <span className="search-user-name">
                    {user.name || user.userId}
                  </span>
                  {user.email && (
                    <span className="search-user-email">{user.email}</span>
                  )}
                </div>
                <button
                  className="add-btn"
                  onClick={() => handleAddMember(user)}
                  disabled={addMember.isPending}
                >
                  {addMember.isPending ? (
                    <Loader2 size={14} className="spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  Add
                </button>
              </div>
            ))}
          </div>

          {/* 현재 멤버 목록 */}
          <div className="current-members">
            <span className="current-members-label">
              Current Members ({members.length})
            </span>
            <div className="current-members-list">
              {members.map((m) => (
                <div key={m.userId} className="current-member-chip">
                  <span>{m.nickname || m.userId}</span>
                  <span className={`chip-role ${m.role?.toLowerCase()}`}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CusModal>
    </StyledTravelMembers>
  );
}

export default TravelMembers;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const StyledTravelMembers = styled.div`
  /* 섹션 헤더 */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1e1b4b;
  }

  .member-count {
    font-size: 12px;
    font-weight: 500;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
    padding: 1px 8px;
    border-radius: 10px;
  }

  .section-action {
    padding: 6px;
    border: 1.5px dashed rgba(99, 102, 241, 0.35);
    border-radius: 10px;
    background: transparent;
    color: #a5b4fc;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      border-color: rgba(139, 92, 246, 0.5);
      color: #8b5cf6;
      background: rgba(139, 92, 246, 0.05);
    }
  }

  /* 멤버 목록 */
  .members-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .member-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(99, 102, 241, 0.1);
    transition: background 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
    }
  }

  .member-avatar {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .member-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  .member-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e1b4b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .me-badge {
    font-size: 10px;
    font-weight: 600;
    color: #6366f1;
    background: rgba(99, 102, 241, 0.1);
    padding: 1px 6px;
    border-radius: 6px;
  }

  .member-role {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    letter-spacing: 0.04em;
    flex-shrink: 0;

    &.admin {
      background: rgba(139, 92, 246, 0.15);
      color: #7c3aed;
    }
    &.user {
      background: rgba(158, 158, 158, 0.12);
      color: #757575;
    }
    &.viewer {
      background: rgba(33, 150, 243, 0.12);
      color: #1976d2;
    }
  }

  /* 멤버 액션 */
  .member-actions {
    position: relative;
    flex-shrink: 0;
  }

  .menu-trigger {
    padding: 4px;
    border: none;
    background: transparent;
    color: #a5b4fc;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
    }
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 180px;
    background: #fff;
    border: 1px solid rgba(99, 102, 241, 0.15);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    padding: 4px;
    z-index: 20;
    animation: ${slideDown} 0.2s ease;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    color: #3730a3;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.08);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.danger {
      color: #ef4444;

      &:hover {
        background: rgba(239, 68, 68, 0.06);
      }
    }

    &.confirm {
      background: rgba(239, 68, 68, 0.08);
      font-weight: 600;
    }
  }

  .spin {
    animation: ${spin} 0.7s linear infinite;
  }

  .empty-text {
    font-size: 13px;
    color: #a5b4fc;
  }

  /* 역할 선택기 */
  .role-selector {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .role-selector-label {
    font-size: 13px;
    font-weight: 500;
    color: #6366f1;
    margin-right: 4px;
  }

  .role-option {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border: 1.5px solid rgba(99, 102, 241, 0.2);
    border-radius: 10px;
    background: transparent;
    color: #6366f1;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(99, 102, 241, 0.4);
      background: rgba(99, 102, 241, 0.04);
    }

    &.active {
      background: rgba(99, 102, 241, 0.12);
      border-color: #6366f1;
      font-weight: 600;
    }
  }

  /* 멤버 추가 모달 */
  .add-member-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 0;
  }

  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-icon {
    position: absolute;
    left: 12px;
    color: #a5b4fc;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 36px 10px 38px;
    border: 1.5px solid rgba(99, 102, 241, 0.25);
    border-radius: 12px;
    font-size: 14px;
    color: #1e1b4b;
    outline: none;
    transition: border-color 0.2s;

    &::placeholder {
      color: #a5b4fc;
    }

    &:focus {
      border-color: #8b5cf6;
    }
  }

  .search-clear {
    position: absolute;
    right: 10px;
    padding: 4px;
    border: none;
    background: transparent;
    color: #a5b4fc;
    cursor: pointer;
    border-radius: 6px;

    &:hover {
      color: #6366f1;
    }
  }

  /* 검색 결과 */
  .search-results {
    max-height: 240px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .search-loading,
  .search-empty,
  .search-hint {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px;
    color: #a5b4fc;
    font-size: 13px;
  }

  .search-loading {
    flex-direction: row;
    gap: 8px;
  }

  .search-empty-hint {
    font-size: 11px;
    color: #c4b5fd;
  }

  .search-user-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border-radius: 12px;
    transition: background 0.2s;

    &:hover {
      background: rgba(99, 102, 241, 0.06);
    }
  }

  .search-user-avatar {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #a5b4fc, #8b5cf6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .search-user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .search-user-name {
    font-size: 13px;
    font-weight: 500;
    color: #1e1b4b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .search-user-email {
    font-size: 11px;
    color: #6366f1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .add-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 12px;
    border: 1.5px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    background: transparent;
    color: #6366f1;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover:not(:disabled) {
      background: #6366f1;
      color: #fff;
      border-color: #6366f1;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  /* 현재 멤버 목록 (모달 하단) */
  .current-members {
    border-top: 1px solid rgba(99, 102, 241, 0.1);
    padding-top: 12px;
  }

  .current-members-label {
    font-size: 12px;
    font-weight: 600;
    color: #6366f1;
    margin-bottom: 8px;
    display: block;
  }

  .current-members-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .current-member-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 10px;
    background: rgba(99, 102, 241, 0.08);
    font-size: 12px;
    color: #3730a3;
    font-weight: 500;
  }

  .chip-role {
    font-size: 10px;
    font-weight: 600;
    padding: 1px 5px;
    border-radius: 4px;

    &.admin {
      background: rgba(139, 92, 246, 0.15);
      color: #7c3aed;
    }
    &.user {
      background: rgba(158, 158, 158, 0.1);
      color: #9e9e9e;
    }
    &.viewer {
      background: rgba(33, 150, 243, 0.1);
      color: #1976d2;
    }
  }

  @media screen and (max-width: 600px) {
    .dropdown-menu {
      min-width: 160px;
    }
  }
`;
