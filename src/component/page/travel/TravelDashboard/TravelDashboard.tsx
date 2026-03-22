import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Container } from "@chakra-ui/react";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Clock,
  Eye,
  EyeOff,
  Settings,
  Plus,
  ChevronRight,
  Plane,
  CheckCircle2,
  CircleDot,
  Circle,
  XCircle,
  Tag,
} from "lucide-react";
import { useGetTravel } from "../../../../hooks/useTravelQueries";
import { TravelStatus } from "../../../../types/travel/travelTypes";
import { useCurrentUser } from "../../../../hooks/useCurrentUser";
import TravelAlbum from "./TravelAlbum";
import TravelMembers from "./TravelMembers";
import TravelSettings from "./TravelSettings";

export interface TravelDashboardProps {}

const STATUS_CONFIG: Record<
  TravelStatus,
  { label: string; icon: any; color: string; bg: string }
> = {
  PLANNING: {
    label: "Planning",
    icon: Circle,
    color: "#2196f3",
    bg: "rgba(33,150,243,0.08)",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: CircleDot,
    color: "#ff9800",
    bg: "rgba(255,152,0,0.08)",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    color: "#4caf50",
    bg: "rgba(76,175,80,0.08)",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "#9e9e9e",
    bg: "rgba(158,158,158,0.08)",
  },
};

function TravelDashboard(props: TravelDashboardProps) {
  const { travelId } = useParams<{ travelId: string }>();
  const navigate = useNavigate();
  const { data: travel, isLoading, error } = useGetTravel(travelId);
  const { data: currentUser } = useCurrentUser();
  const [loaded, setLoaded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const currentUserId = currentUser?.id;
  const isAdmin = travel?.members?.some(
    (m) => m.userId === currentUserId && m.role === "ADMIN"
  ) ?? false;

  useEffect(() => {
    if (travel) setLoaded(true);
  }, [travel]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysCount = () => {
    if (!travel?.startDate || !travel?.endDate) return null;
    const start = new Date(travel.startDate);
    const end = new Date(travel.endDate);
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff + 1;
  };

  const getDDay = () => {
    if (!travel?.startDate) return null;
    const start = new Date(travel.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    const diff = Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diff > 0) return `D-${diff}`;
    if (diff === 0) return "D-Day";
    return `D+${Math.abs(diff)}`;
  };

  const containerProps = {
    maxW: "7xl" as const,
    px: { base: 0, sm: 0, lg: 0 },
    h: "100%",
    flex: "1",
    flexDirection: "column" as const,
    display: "flex",
    bg: "gray.50",
  };

  if (isLoading) {
    return (
      <Container {...containerProps}>
        <StyledTravelDashboard>
          <div className="loading-state">
            <div className="loading-spinner" />
            <span>Loading project...</span>
          </div>
        </StyledTravelDashboard>
      </Container>
    );
  }

  if (error || !travel) {
    return (
      <Container {...containerProps}>
        <StyledTravelDashboard>
          <div className="error-state">
            <p>Travel project not found</p>
            <button
              className="back-btn"
              onClick={() => navigate("/travel/home")}
            >
              <ArrowLeft size={16} />
              Back to Home
            </button>
          </div>
        </StyledTravelDashboard>
      </Container>
    );
  }

  const statusConfig = STATUS_CONFIG[travel.status];
  const StatusIcon = statusConfig.icon;
  const daysCount = getDaysCount();
  const dDay = getDDay();

  return (
    <Container {...containerProps}>
    <StyledTravelDashboard className={loaded ? "loaded" : ""}>
      {/* Header */}
      <div className="dash-header">
        <button className="back-btn" onClick={() => navigate("/travel/home")}>
          <ArrowLeft size={20} />
        </button>
        <div className="dash-header-right">
          {isAdmin && (
            <button className="settings-btn" onClick={() => setSettingsOpen(true)}>
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner */}
      <div className="dash-hero">
        {travel.coverImageUrl ? (
          <img
            src={travel.coverImageUrl}
            alt={travel.title}
            className="dash-hero-img"
          />
        ) : (
          <div className="dash-hero-placeholder">
            <Plane size={48} />
          </div>
        )}
        <div className="dash-hero-overlay" />
        <div className="dash-hero-content">
          <div className="dash-hero-status">
            <span
              className="status-badge"
              style={{
                color: statusConfig.color,
                background: statusConfig.bg,
              }}
            >
              <StatusIcon size={14} />
              {statusConfig.label}
            </span>
            {travel.visibility === "PRIVATE" ? (
              <span className="visibility-badge private">
                <EyeOff size={12} />
                Private
              </span>
            ) : (
              <span className="visibility-badge public">
                <Eye size={12} />
                Public
              </span>
            )}
          </div>
          <h1 className="dash-hero-title">{travel.title}</h1>
          {travel.destination && (
            <p className="dash-hero-destination">
              <MapPin size={14} />
              {travel.destination}
            </p>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dash-stats">
        {dDay && (
          <div className="stat-card accent" >
            <span className="stat-value">{dDay}</span>
            <span className="stat-label">D-Day</span>
          </div>
        )}
        {daysCount && (
          <div className="stat-card">
            <Calendar size={18} className="stat-icon" />
            <span className="stat-value">
              {daysCount}
              <small>days</small>
            </span>
            <span className="stat-label">Duration</span>
          </div>
        )}
        <div className="stat-card">
          <Users size={18} className="stat-icon" />
          <span className="stat-value">{travel.memberCount ?? travel.members?.length ?? 0}</span>
          <span className="stat-label">Members</span>
        </div>
        <div className="stat-card">
          <Clock size={18} className="stat-icon" />
          <span className="stat-value">{travel.schedules?.length ?? 0}</span>
          <span className="stat-label">Schedules</span>
        </div>
      </div>

      {/* Album */}
      <TravelAlbum travelId={travel.id} />

      {/* Date Info */}
      {(travel.startDate || travel.endDate) && (
        <div className="dash-section date-section">
          <Calendar size={16} className="section-icon" />
          <span className="date-range">
            {formatDate(travel.startDate)} ~ {formatDate(travel.endDate)}
          </span>
        </div>
      )}

      {/* Description */}
      {travel.description && (
        <div className="dash-section">
          <h3 className="section-title">About</h3>
          <p className="section-text">{travel.description}</p>
        </div>
      )}

      {/* Tags */}
      <div className="dash-section">
        <h3 className="section-title">
          <Tag size={16} />
          Tags
        </h3>
        {travel.tags && travel.tags.length > 0 ? (
          <div className="tags-wrap">
            {travel.tags.map((tag) => (
              <span key={tag} className="tag-chip">
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="empty-text">No tags yet</p>
        )}
      </div>

      {/* Members Section */}
      <div className="dash-section">
        <TravelMembers
          travelId={travel.id}
          members={travel.members}
          currentUserId={currentUserId}
          isAdmin={isAdmin}
        />
      </div>

      {/* Schedules Section */}
      <div className="dash-section">
        <div className="section-header">
          <h3 className="section-title">
            <Clock size={16} />
            Schedules
          </h3>
          <button className="section-action">
            <Plus size={16} />
          </button>
        </div>
        <div className="schedules-list">
          {travel.schedules
            ?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map((schedule) => (
              <div key={schedule.id} className="schedule-item">
                <div className="schedule-day">
                  {schedule.dayNumber ? `Day ${schedule.dayNumber}` : ""}
                </div>
                <div className="schedule-content">
                  <span className="schedule-title">{schedule.title}</span>
                  {schedule.date && (
                    <span className="schedule-date">
                      {formatDate(schedule.date)}
                    </span>
                  )}
                  {schedule.description && (
                    <p className="schedule-desc">{schedule.description}</p>
                  )}
                  {schedule.places && schedule.places.length > 0 && (
                    <div className="schedule-places">
                      {schedule.places.map((place, i) => (
                        <span key={i} className="place-chip">
                          <MapPin size={11} />
                          {place.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="schedule-arrow" />
              </div>
            ))}
          {(!travel.schedules || travel.schedules.length === 0) && (
            <div className="empty-schedules">
              <Clock size={32} />
              <p>No schedules yet</p>
              <span>Add your first schedule to start planning</span>
            </div>
          )}
        </div>
      </div>
      {/* Settings Modal */}
      <TravelSettings
        travelId={travel.id}
        currentTitle={travel.title}
        currentDescription={travel.description}
        currentTags={travel.tags}
        currentVisibility={travel.visibility}
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onDeleted={() => navigate("/travel/home")}
      />
    </StyledTravelDashboard>
    </Container>
  );
}

export default TravelDashboard;

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const StyledTravelDashboard = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 1rem 2rem 3rem;
  font-family: "Noto Sans KR", sans-serif;
  opacity: 0;

  &.loaded {
    animation: ${fadeUp} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  /* Loading & Error */
  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 300px;
    color: #6366f1;
    font-size: 15px;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(139, 92, 246, 0.2);
    border-top-color: #8b5cf6;
    border-radius: 50%;
    animation: ${spin} 0.7s linear infinite;
  }

  /* Header */
  .dash-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    border: none;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 12px;
    color: #4f46e5;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.2);
    }
  }

  .settings-btn {
    padding: 8px;
    border: none;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 10px;
    color: #4f46e5;
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(99, 102, 241, 0.2);
    }
  }

  /* Hero */
  .dash-hero {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    height: 220px;
    margin-bottom: 1.5rem;
  }

  .dash-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .dash-hero-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%);
    color: #a5b4fc;
  }

  .dash-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(15, 10, 30, 0.75) 0%,
      rgba(15, 10, 30, 0.1) 50%,
      transparent 100%
    );
  }

  .dash-hero-content {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 24px 28px;
    z-index: 1;
  }

  .dash-hero-status {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .visibility-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;

    &.private {
      background: rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.8);
    }
    &.public {
      background: rgba(76, 175, 80, 0.15);
      color: rgba(76, 175, 80, 0.9);
    }
  }

  .dash-hero-title {
    font-family: "Playfair Display", serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
  }

  .dash-hero-destination {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }

  /* Stats */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
    margin-bottom: 1.5rem;
  }

  .stat-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 16px 12px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(99, 102, 241, 0.15);

    &.accent {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.03));
      border-color: rgba(139, 92, 246, 0.2);
    }
  }

  .stat-icon {
    color: #a5b4fc;
  }

  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #1e1b4b;

    small {
      font-size: 12px;
      font-weight: 400;
      color: #6366f1;
      margin-left: 3px;
    }
  }

  .stat-label {
    font-size: 12px;
    color: #6366f1;
    font-weight: 400;
  }

  /* Date Section */
  .date-section {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-icon {
    color: #a5b4fc;
  }

  .date-range {
    font-size: 14px;
    color: #3730a3;
    font-weight: 500;
  }

  /* Sections */
  .dash-section {
    padding: 1.25rem 0;
    border-bottom: 1px solid rgba(99, 102, 241, 0.12);

    &:last-child {
      border-bottom: none;
    }
  }

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

  .section-text {
    font-size: 14px;
    color: #3730a3;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .empty-text {
    font-size: 13px;
    color: #a5b4fc;
  }

  /* Tags */
  .tags-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag-chip {
    padding: 4px 12px;
    border-radius: 20px;
    background: rgba(139, 92, 246, 0.1);
    color: #4f46e5;
    font-size: 13px;
    font-weight: 500;
  }

  /* Members */
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
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .member-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e1b4b;
  }

  .member-role {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 6px;
    letter-spacing: 0.04em;

    &.admin {
      background: rgba(139, 92, 246, 0.15);
      color: #7c3aed;
    }
    &.user {
      background: rgba(158, 158, 158, 0.12);
      color: #757575;
    }
  }

  /* Schedules */
  .schedules-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .schedule-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 16px;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.6);
    border: 1px solid rgba(99, 102, 241, 0.1);
    cursor: pointer;
    transition: all 0.25s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.9);
      border-color: rgba(139, 92, 246, 0.2);
    }
  }

  .schedule-day {
    min-width: 56px;
    font-size: 12px;
    font-weight: 700;
    color: #8b5cf6;
    padding-top: 2px;
  }

  .schedule-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .schedule-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e1b4b;
  }

  .schedule-date {
    font-size: 12px;
    color: #6366f1;
  }

  .schedule-desc {
    font-size: 13px;
    color: #4f46e5;
    line-height: 1.5;
  }

  .schedule-places {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }

  .place-chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 3px 8px;
    background: rgba(33, 150, 243, 0.06);
    color: #1976d2;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 500;
  }

  .schedule-arrow {
    color: #a5b4fc;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .empty-schedules {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 2.5rem 1rem;
    color: #a5b4fc;
    text-align: center;

    p {
      font-size: 15px;
      font-weight: 500;
      color: #6366f1;
    }

    span {
      font-size: 13px;
      color: #a5b4fc;
    }
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;

    .dash-hero {
      height: 180px;
    }

    .dash-hero-title {
      font-size: 22px;
    }

    .dash-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .schedule-item {
      flex-direction: column;
      gap: 8px;
    }

    .schedule-day {
      min-width: auto;
    }
  }
`;
