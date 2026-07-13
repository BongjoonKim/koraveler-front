import styled from "styled-components";
import moment from "moment";
import {homeTokens} from "../../../../MainPage/MainBody/homeTokens";

const t = homeTokens;

export interface FolderInfoProps {
    selectedFolder : FoldersDTO;
};

function FolderInfo(props: FolderInfoProps) {
  const {selectedFolder} = props;
  return (
    <StyledFolderInfo>
        <div className="folder-details">
            <div className="folder-header">
                <div className="folder-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M4 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9L8.77 3.9A2 2 0 0 0 7.11 3H4z"
                          fill="currentColor"/>
                    </svg>
                </div>
                <div className="folder-title">
                    <h2>{selectedFolder.name}</h2>
                    <span className="folder-path">{selectedFolder?.path}</span>
                </div>
                <div className="folder-status">
      <span className={`status-badge ${selectedFolder.isPublic ? 'public' : 'private'}`}>
        {selectedFolder.isPublic ? 'Public' : 'Private'}
      </span>
                </div>
            </div>

            <div className="folder-info-grid">
                <div className="info-card">
                    <div className="info-label">Created</div>
                    <div className="info-value">{moment(selectedFolder?.created).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                <div className="info-card">
                    <div className="info-label">Updated</div>
                    <div className="info-value">{moment(selectedFolder?.updated).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                {selectedFolder.description && (
                  <div className="info-card description">
                      <div className="info-label">Description</div>
                      <div className="info-value">{selectedFolder.description}</div>
                  </div>
                )}
            </div>

            {/* 블로그 글 목록 섹션 */}
            <div className="folder-content">
                <div className="content-header">
                    <h3>Folder contents</h3>
                    <button className="refresh-btn" onClick={() => {/* 새로고침 로직 */
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
                                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="blog-posts-list">
                    {/* 임시 데이터 - 나중에 실제 데이터로 교체 */}
                    {[].length > 0 ? (
                      <div className="posts-grid">
                          {/* 실제 블로그 글 목록이 들어갈 곳 */}
                      </div>
                    ) : (
                      <div className="empty-state">
                          <div className="empty-icon">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                        stroke="currentColor" strokeWidth="1.5" fill="none"/>
                                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="1.5"/>
                                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5"/>
                                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/>
                                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="1.5"/>
                              </svg>
                          </div>
                          <p className="empty-title">No posts yet</p>
                          <p className="empty-description">Write a new blog post and keep it in this folder.</p>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </StyledFolderInfo>
  )
};

export default FolderInfo;

// 다크 세이지-그린 에디토리얼 톤 (homeTokens 참조)
const StyledFolderInfo = styled.div`
    /* 폴더 세부 정보 섹션 스타일 */
    height: 100%;
    color: ${t.color.text};
    font-family: ${t.font.sans};

    .folder-details {
        background: ${t.color.surface};
        border-radius: ${t.radius.lg};
        border: 0.5px solid ${t.color.border};
        overflow: hidden;
        height: 100%;
    }

    .folder-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        background: ${t.color.surface3};
        border-bottom: 0.5px solid ${t.color.border};
    }

    .folder-icon {
        width: 48px;
        height: 48px;
        background: ${t.color.badgeBg};
        border: 0.5px solid ${t.color.border2};
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${t.color.accent};
        flex-shrink: 0;
    }

    .folder-title {
        flex: 1;
        min-width: 0;
    }

    .folder-title h2 {
        margin: 0 0 6px 0;
        font-family: ${t.font.serif};
        font-size: 21px;
        font-weight: 500;
        color: ${t.color.text};
        line-height: 1.2;
    }

    .folder-path {
        font-size: 13px;
        color: ${t.color.textMuted};
        font-family: 'Monaco', 'Menlo', monospace;
        background: rgba(255, 255, 255, 0.05);
        padding: 2px 8px;
        border-radius: 4px;
        word-break: break-all;
    }

    .folder-status {
        flex-shrink: 0;
    }

    .status-badge {
        padding: 5px 11px;
        border-radius: ${t.radius.pill};
        font-size: 11px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }

    .status-badge.public {
        background: ${t.color.badgeBg};
        color: ${t.color.badgeText};
        border: 0.5px solid rgba(143, 191, 148, 0.25);
    }

    .status-badge.private {
        background: rgba(255, 255, 255, 0.05);
        color: ${t.color.textMuted};
        border: 0.5px solid ${t.color.border2};
    }

    .folder-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        padding: 24px;
        border-bottom: 0.5px solid ${t.color.border};
    }

    .info-card {
        background: ${t.color.surface2};
        border-radius: ${t.radius.md};
        padding: 16px;
        border: 0.5px solid ${t.color.border};
    }

    .info-card.description {
        grid-column: 1 / -1;
    }

    .info-label {
        font-size: 11px;
        font-weight: 500;
        color: ${t.color.textFaint};
        text-transform: uppercase;
        letter-spacing: 0.12em;
        margin-bottom: 8px;
    }

    .info-value {
        font-size: 14px;
        color: ${t.color.textSoft};
        font-weight: 400;
    }

    .folder-content {
        padding: 24px;
        height: 100%;
    }

    .content-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .content-header h3 {
        margin: 0;
        font-family: ${t.font.serif};
        font-size: 18px;
        font-weight: 500;
        color: ${t.color.text};
    }

    .refresh-btn {
        background: none;
        border: 0.5px solid ${t.color.border2};
        border-radius: 6px;
        padding: 8px;
        cursor: pointer;
        color: ${t.color.textMuted};
        transition: all 0.2s ease;
    }

    .refresh-btn:hover {
        background: rgba(255, 255, 255, 0.06);
        color: ${t.color.textSoft};
    }

    .blog-posts-list {
        min-height: 200px;
    }

    .posts-grid {
        display: grid;
        gap: 16px;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15% 10%;
        text-align: center;
    }

    .empty-icon {
        width: 72px;
        height: 72px;
        background: ${t.color.surface3};
        border: 0.5px solid ${t.color.border};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
        color: ${t.color.textFaint};
    }

    .empty-title {
        font-family: ${t.font.serif};
        font-size: 18px;
        font-weight: 500;
        color: ${t.color.textSoft};
        margin: 0 0 8px 0;
    }

    .empty-description {
        font-size: 14px;
        color: ${t.color.textMuted};
        margin: 0;
        max-width: 300px;
    }

    /* 모바일 반응형 */
    @media (max-width: 768px) {
        .folder-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
        }

        .folder-info-grid {
            grid-template-columns: 1fr;
            gap: 12px;
            padding: 16px;
        }

        .folder-content {
            padding: 16px;
        }
    }
`;
