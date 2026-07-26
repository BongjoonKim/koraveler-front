import styled, { keyframes } from "styled-components";
import { createPortal } from "react-dom";
import { Youtube, Search, RefreshCw, X, Sparkles, Loader2 } from "lucide-react";
import {
  useTravelDiscovery,
  formatDuration,
  formatViewCount,
  DiscoveryLocale,
} from "./useTravelDiscovery";
import { DiscoveredVideo } from "../../../../types/discovery/discoveryTypes";

const LOCALE_OPTIONS: { value: DiscoveryLocale; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ko", label: "한국어" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

export interface TravelDiscoveryProps {}

function TravelDiscovery(props: TravelDiscoveryProps) {
  const {
    inputValue,
    setInputValue,
    locale,
    setLocale,
    searched,
    handleSearch,
    handleRefresh,
    digest,
    jobStatus,
    errorMessage,
    isCollecting,
    isLoading,
    authFailed,
    isLoggedIn,
    playingVideoId,
    setPlayingVideoId,
  } = useTravelDiscovery();

  const videos = digest?.videos ?? [];

  return (
    <StyledTravelDiscovery>
      <div className="discovery-header">
        <div className="discovery-title-wrap">
          <Youtube size={26} strokeWidth={1.5} className="discovery-icon" />
          <h1 className="discovery-title">Destination Discovery</h1>
        </div>
        <p className="discovery-subtitle">
          Search a destination and get AI-curated YouTube travel videos with a
          summary of what travelers focus on.
        </p>
      </div>

      <div className="discovery-search-row">
        <div className="discovery-search-box">
          <Search size={17} className="discovery-search-icon" />
          <input
            className="discovery-search-input"
            placeholder="Where do you want to go? e.g. Sydney"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <select
          className="discovery-locale-select"
          value={locale}
          onChange={(e) => setLocale(e.target.value as DiscoveryLocale)}
        >
          {LOCALE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button className="discovery-search-btn" onClick={handleSearch}>
          Discover
        </button>
      </div>

      {/* 상태 배너 */}
      {searched && isCollecting && (
        <div className="discovery-banner collecting">
          <Loader2 size={16} className="spin" />
          Collecting travel videos for “{searched.query}”… this usually takes
          under a minute.
        </div>
      )}
      {searched && !isCollecting && jobStatus === "FAILED" && (
        <div className="discovery-banner failed">
          Collection failed{errorMessage ? ` — ${errorMessage}` : ""}. Try
          again later.
        </div>
      )}
      {authFailed && (
        <div className="discovery-banner failed">
          Please sign in to start collecting new destinations.
        </div>
      )}
      {searched && !isLoggedIn && !digest && !isLoading && !isCollecting && (
        <div className="discovery-banner">
          No collected data for “{searched.query}” yet. Sign in to start a
          collection.
        </div>
      )}

      {/* AI 다이제스트 요약 */}
      {digest?.summary && (
        <div className="discovery-summary-card">
          <div className="discovery-summary-label">
            <Sparkles size={15} />
            AI Digest — {digest.displayName}
          </div>
          <p className="discovery-summary-text">{digest.summary}</p>
          <div className="discovery-summary-meta">
            <span>
              {videos.length} videos
              {digest.collectedAt &&
                ` · collected ${new Date(digest.collectedAt).toLocaleDateString()}`}
            </span>
            {isLoggedIn && (
              <button
                className="discovery-refresh-btn"
                onClick={handleRefresh}
                disabled={isCollecting}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            )}
          </div>
        </div>
      )}

      {/* 결과 없음 */}
      {digest && !digest.summary && videos.length === 0 && !isCollecting && (
        <div className="discovery-banner">
          No travel videos found for “{digest.displayName}”. Try a different
          spelling or language.
        </div>
      )}

      {/* 영상 그리드 */}
      {videos.length > 0 && (
        <div className="discovery-video-grid">
          {videos.map((video) => (
            <VideoCard
              key={video.videoId}
              video={video}
              onPlay={() => setPlayingVideoId(video.videoId)}
            />
          ))}
        </div>
      )}

      {/* 임베드 플레이어 모달 — transform 조상 이슈 방지를 위해 portal 사용 */}
      {playingVideoId &&
        createPortal(
          <StyledPlayerOverlay onClick={() => setPlayingVideoId(null)}>
            <div
              className="player-frame-wrap"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="player-close-btn"
                onClick={() => setPlayingVideoId(null)}
                aria-label="Close player"
              >
                <X size={20} />
              </button>
              <iframe
                className="player-iframe"
                src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                title="YouTube player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </StyledPlayerOverlay>,
          document.body
        )}
    </StyledTravelDiscovery>
  );
}

function VideoCard({
  video,
  onPlay,
}: {
  video: DiscoveredVideo;
  onPlay: () => void;
}) {
  const duration = formatDuration(video.duration);
  const views = formatViewCount(video.viewCount);

  return (
    <button className="discovery-video-card" onClick={onPlay}>
      <div className="video-thumb-wrap">
        {video.thumbnailUrl && (
          <img
            className="video-thumb"
            src={video.thumbnailUrl}
            alt={video.title}
            loading="lazy"
          />
        )}
        {duration && <span className="video-duration">{duration}</span>}
      </div>
      <div className="video-body">
        <h3 className="video-title">{video.title}</h3>
        <div className="video-meta">
          {video.channelTitle}
          {views && ` · ${views}`}
        </div>
        {video.aiSummary && <p className="video-summary">{video.aiSummary}</p>}
        {video.tags && video.tags.length > 0 && (
          <div className="video-tags">
            {video.tags.map((tag) => (
              <span key={tag} className="video-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

export default TravelDiscovery;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const StyledTravelDiscovery = styled.div`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 2.5rem 1.25rem 4rem;

  .discovery-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 1.75rem;
  }

  .discovery-title-wrap {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .discovery-icon {
    color: #7d9786;
  }

  .discovery-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .discovery-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
    max-width: 560px;
  }

  .discovery-search-row {
    display: flex;
    gap: 10px;
    margin-bottom: 1.5rem;
  }

  .discovery-search-box {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;

    &:focus-within {
      border-color: #7d9786;
    }
  }

  .discovery-search-icon {
    color: rgba(255, 255, 255, 0.4);
    flex-shrink: 0;
  }

  .discovery-search-input {
    flex: 1;
    height: 46px;
    background: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 15px;

    &::placeholder {
      color: rgba(255, 255, 255, 0.35);
    }
  }

  .discovery-locale-select {
    height: 48px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 10px;
    color: white;
    font-size: 14px;
    cursor: pointer;

    option {
      color: #111;
    }
  }

  .discovery-search-btn {
    height: 48px;
    padding: 0 22px;
    background: #3a9d6e;
    border: none;
    border-radius: 10px;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: #2e7d52;
    }
  }

  .discovery-banner {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 13px 16px;
    margin-bottom: 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.75);
    font-size: 14px;

    &.collecting {
      border-color: rgba(125, 151, 134, 0.5);
      color: #a9c0b2;
    }

    &.failed {
      border-color: rgba(239, 68, 68, 0.4);
      color: #f0a3a3;
    }

    .spin {
      animation: ${spin} 1s linear infinite;
      flex-shrink: 0;
    }
  }

  .discovery-summary-card {
    padding: 20px 22px;
    margin-bottom: 1.75rem;
    background: rgba(125, 151, 134, 0.08);
    border: 1px solid rgba(125, 151, 134, 0.3);
    border-radius: 12px;
  }

  .discovery-summary-label {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #7d9786;
    margin-bottom: 10px;
  }

  .discovery-summary-text {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 16px;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.85);
    margin: 0 0 14px;
  }

  .discovery-summary-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.45);
  }

  .discovery-refresh-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 8px;
    color: rgba(255, 255, 255, 0.65);
    font-size: 13px;
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: #7d9786;
      color: #a9c0b2;
    }

    &:disabled {
      opacity: 0.5;
      cursor: default;
    }
  }

  .discovery-video-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }

  .discovery-video-card {
    display: flex;
    flex-direction: column;
    text-align: left;
    padding: 0;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease;

    &:hover {
      border-color: rgba(125, 151, 134, 0.6);
      transform: translateY(-2px);
    }
  }

  .video-thumb-wrap {
    position: relative;
    aspect-ratio: 16 / 9;
    background: rgba(255, 255, 255, 0.06);
  }

  .video-thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .video-duration {
    position: absolute;
    right: 8px;
    bottom: 8px;
    padding: 2px 7px;
    background: rgba(0, 0, 0, 0.75);
    border-radius: 5px;
    color: white;
    font-size: 12px;
    font-weight: 600;
  }

  .video-body {
    display: flex;
    flex-direction: column;
    gap: 7px;
    padding: 13px 14px 15px;
  }

  .video-title {
    font-size: 14.5px;
    font-weight: 600;
    line-height: 1.4;
    color: white;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-meta {
    font-size: 12.5px;
    color: rgba(255, 255, 255, 0.45);
  }

  .video-summary {
    font-size: 13px;
    line-height: 1.5;
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .video-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 2px;
  }

  .video-tag {
    padding: 2px 9px;
    background: rgba(125, 151, 134, 0.15);
    border-radius: 999px;
    color: #a9c0b2;
    font-size: 11.5px;
  }

  @media screen and (max-width: 900px) {
    .discovery-video-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 600px) {
    padding: 1.75rem 1rem 3rem;

    .discovery-title {
      font-size: 23px;
    }

    .discovery-search-row {
      flex-wrap: wrap;
    }

    .discovery-search-box {
      flex-basis: 100%;
    }

    .discovery-video-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const StyledPlayerOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.85);

  .player-frame-wrap {
    position: relative;
    width: min(920px, 100%);
    aspect-ratio: 16 / 9;
  }

  .player-close-btn {
    position: absolute;
    top: -40px;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .player-iframe {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 10px;
    background: black;
  }
`;
