import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useGetMyTravels } from "../../../../../hooks/useTravelQueries";
import { TravelResponse } from "../../../../../types/travel/travelTypes";

export interface TravelRecentProjectsProps {}

function TravelRecentProjects(props: TravelRecentProjectsProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useGetMyTravels(0, 10);
  const [loaded, setLoaded] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const travels: TravelResponse[] = data?.travels ?? [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
  };

  return (
    <StyledTravelRecentProjects>
      <div className="recent-row">
        {isLoading &&
          [1, 2, 3].map((i) => (
            <div key={i} className="project-circle-wrap loaded">
              <div className="project-circle skeleton" />
              <span className="project-circle-title skeleton-text" />
            </div>
          ))}

        {!isLoading &&
          travels.map((project, i) => (
            <div
              key={project.id}
              className={`project-circle-wrap ${loaded ? "loaded" : ""}`}
              style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/travel/dashboard/${project.id}`)}
            >
              <div
                className={`project-circle ${hoveredId === project.id ? "hovered" : ""}`}
              >
                {project.coverImageUrl ? (
                  <img
                    src={project.coverImageUrl}
                    alt={project.title}
                    className="project-circle-img"
                  />
                ) : (
                  <div className="project-circle-placeholder">
                    {project.title.charAt(0)}
                  </div>
                )}
              </div>
              <span className="project-circle-title">
                {project.destination || project.title}
              </span>
              <span className="project-circle-date">
                {formatDate(project.startDate || project.created)}
              </span>
            </div>
          ))}

        <div
          className={`project-circle-wrap ${loaded ? "loaded" : ""}`}
          style={{ animationDelay: `${0.3 + travels.length * 0.1}s` }}
          onClick={() => navigate("/travel/create")}
        >
          <div className="add-circle">
            <span className="add-circle-icon">+</span>
          </div>
          <span className="project-circle-title">New Trip</span>
        </div>
      </div>
    </StyledTravelRecentProjects>
  );
}

export default TravelRecentProjects;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const StyledTravelRecentProjects = styled.div`
  .recent-row {
    display: flex;
    gap: 28px;
    padding: 28px 0 8px;
    align-items: flex-start;
    overflow-x: auto;

    &::-webkit-scrollbar {
      height: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(99, 102, 241, 0.3);
      border-radius: 2px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .project-circle-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    flex-shrink: 0;
    opacity: 0;

    &.loaded {
      animation: ${scaleIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  }

  .project-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid rgba(139, 92, 246, 0.3);
    transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);

    &.hovered {
      transform: scale(1.08);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
    }

    &.skeleton {
      background: linear-gradient(90deg, #ede9fe 25%, #f5f3ff 50%, #ede9fe 75%);
      background-size: 200px 100%;
      animation: ${shimmer} 1.5s infinite;
      border-color: transparent;
    }
  }

  .project-circle-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .project-circle-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #c4b5fd, #8b5cf6);
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    font-family: "Playfair Display", serif;
  }

  .project-circle-title {
    font-size: 13px;
    font-weight: 500;
    color: #1e1b4b;

    &.skeleton-text {
      width: 48px;
      height: 13px;
      border-radius: 4px;
      background: linear-gradient(90deg, #ede9fe 25%, #f5f3ff 50%, #ede9fe 75%);
      background-size: 200px 100%;
      animation: ${shimmer} 1.5s infinite;
    }
  }

  .project-circle-date {
    font-size: 11px;
    color: #6366f1;
    font-weight: 300;
  }

  .add-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px dashed rgba(99, 102, 241, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(255, 255, 255, 0.5);

    &:hover {
      border-color: rgba(139, 92, 246, 0.6);
      background: rgba(255, 255, 255, 0.8);
    }
  }

  .add-circle-icon {
    font-size: 28px;
    color: #a5b4fc;
    font-weight: 300;
  }

  @media screen and (max-width: 600px) {
    .recent-row {
      gap: 20px;
    }

    .project-circle {
      width: 64px;
      height: 64px;
    }

    .add-circle {
      width: 64px;
      height: 64px;
    }
  }
`;
