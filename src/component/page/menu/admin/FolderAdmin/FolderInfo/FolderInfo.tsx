import styled from "styled-components";
import moment from "moment";

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
        {selectedFolder.isPublic ? '공개' : '비공개'}
      </span>
                </div>
            </div>
            
            <div className="folder-info-grid">
                <div className="info-card">
                    <div className="info-label">생성일</div>
                    <div className="info-value">{moment(selectedFolder?.created).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                <div className="info-card">
                    <div className="info-label">수정일</div>
                    <div className="info-value">{moment(selectedFolder?.updated).format('YYYY-MM-DD HH:mm')}</div>
                </div>
                {selectedFolder.description && (
                  <div className="info-card description">
                      <div className="info-label">설명</div>
                      <div className="info-value">{selectedFolder.description}</div>
                  </div>
                )}
            </div>
            
            {/* 블로그 글 목록 섹션 */}
            <div className="folder-content">
                <div className="content-header">
                    <h3>폴더 내용</h3>
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
                          {/* 예시 구조:
          {blogPosts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h4>{post.title}</h4>
                <span className="post-date">{moment(post.created).format('MM-DD')}</span>
              </div>
              <p className="post-excerpt">{post.excerpt}</p>
              <div className="post-tags">
                {post.tags?.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
          */}
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
                          <p className="empty-title">아직 글이 없습니다</p>
                          <p className="empty-description">이 폴더에 새로운 블로그 글을 작성해보세요.</p>
                          <button className="create-post-btn">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"
                                        strokeLinecap="round"/>
                              </svg>
                              새 글 작성
                          </button>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </StyledFolderInfo>
  )
};

export default FolderInfo;

// CSS 스타일 - StyledFolderManagement 내부에 추가할 스타일
const StyledFolderInfo = styled.div`
    /* 폴더 세부 정보 섹션 스타일 */
    height: 100%;
    .folder-details {
        background: #ffffff;
        border-radius: 12px;
        border: 1px solid #e1e5e9;
        overflow: hidden;
        height: 100%;
        
    }
    
    .folder-header {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 24px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-bottom: 1px solid #e2e8f0;
    }
    
    .folder-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        flex-shrink: 0;
    }
    
    .folder-title {
        flex: 1;
    }
    
    .folder-title h2 {
        margin: 0 0 4px 0;
        font-size: 20px;
        font-weight: 600;
        color: #1e293b;
        line-height: 1.2;
    }
    
    .folder-path {
        font-size: 14px;
        color: #64748b;
        font-family: 'Monaco', 'Menlo', monospace;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 4px;
    }
    
    .folder-status {
        flex-shrink: 0;
    }
    
    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-badge.public {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
    }
    
    .status-badge.private {
        background: #fef3c7;
        color: #92400e;
        border: 1px solid #fed7aa;
    }
    
    .folder-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        padding: 24px;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .info-card {
        background: #f8fafc;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #e2e8f0;
    }
    
    .info-card.description {
        grid-column: 1 / -1;
    }
    
    .info-label {
        font-size: 12px;
        font-weight: 500;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
    }
    
    .info-value {
        font-size: 14px;
        color: #1e293b;
        font-weight: 500;
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
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
    }
    
    .refresh-btn {
        background: none;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 8px;
        cursor: pointer;
        color: #64748b;
        transition: all 0.2s ease;
    }
    
    .refresh-btn:hover {
        background: #f1f5f9;
        color: #334155;
        border-color: #cbd5e1;
    }
    
    .blog-posts-list {
        min-height: 200px;
    }
    
    .posts-grid {
        display: grid;
        gap: 16px;
    }
    
    .post-card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 20px;
        transition: all 0.2s ease;
        cursor: pointer;
    }
    
    .post-card:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        transform: translateY(-1px);
    }
    
    .post-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 12px;
    }
    
    .post-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        line-height: 1.4;
        flex: 1;
    }
    
    .post-date {
        font-size: 12px;
        color: #64748b;
        white-space: nowrap;
        flex-shrink: 0;
    }
    
    .post-excerpt {
        font-size: 14px;
        color: #64748b;
        line-height: 1.5;
        margin: 0 0 12px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .post-tags {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
    }
    
    .tag {
        background: #f1f5f9;
        color: #475569;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
    }
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
    justify-content: center;
    padding: 20% 10%;
    text-align: center;
}

.empty-icon {
    width: 72px;
    height: 72px;
    background: #f1f5f9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    color: #94a3b8;
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #334155;
    margin: 0 0 8px 0;
}

.empty-description {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 24px 0;
    max-width: 300px;
}

.create-post-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s ease;
}

.create-post-btn:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
    transform: translateY(-1px);
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
    
    .post-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}
`;
