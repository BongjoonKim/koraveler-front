import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { Calendar, Users, MapPin } from "lucide-react";
import { useGetMyTravels } from "../../../../../hooks/useTravelQueries";

export interface TravelProjectHeroProps {}

function TravelProjectHero(props: TravelProjectHeroProps) {
  const navigate = useNavigate();
  const { data } = useGetMyTravels(0, 1);
  const [loaded, setLoaded] = useState(false);

  const featured = data?.travels?.[0];

  useEffect(() => {
    if (featured || data) setLoaded(true);
  }, [featured, data]);

  if (!featured) {
    return (
      <StyledTravelProjectHero className={loaded ? "loaded" : ""}>
        <div
          className="hero-image-wrap hero-empty"
          onClick={() => navigate("/travel/create")}
        >
          <div className="hero-empty-content">
            <MapPin size={36} />
            <h2 className="hero-empty-title">Start Your Journey</h2>
            <p className="hero-empty-sub">Create your first travel project</p>
          </div>
        </div>
      </StyledTravelProjectHero>
    );
  }

  const getDaysCount = () => {
    if (!featured.startDate || !featured.endDate) return null;
    const start = new Date(featured.startDate);
    const end = new Date(featured.endDate);
    return (
      Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const days = getDaysCount();

  return (
    <StyledTravelProjectHero className={loaded ? "loaded" : ""}>
      <div
        className="hero-image-wrap"
        onClick={() => navigate(`/travel/dashboard/${featured.id}`)}
      >
        {featured.coverImageUrl ? (
          <img
            src={featured.coverImageUrl}
            alt={featured.title}
            className="hero-image"
          />
        ) : (
          <div className="hero-placeholder" />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <span className="hero-badge">Latest</span>
          <h2 className="hero-title">{featured.title}</h2>
          {featured.destination && (
            <p className="hero-subtitle">
              <MapPin size={13} />
              {featured.destination}
            </p>
          )}
          <div className="hero-meta">
            {days && (
              <>
                <span className="hero-meta-item">
                  <Calendar size={13} />
                  {days}days
                </span>
                <span className="hero-meta-dot">&middot;</span>
              </>
            )}
            <span className="hero-meta-item">
              <Users size={13} />
              {featured.memberCount ?? featured.members?.length ?? 0} members
            </span>
          </div>
        </div>
      </div>
    </StyledTravelProjectHero>
  );
}

export default TravelProjectHero;

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

const StyledTravelProjectHero = styled.div`

  .hero-image-wrap {
    height: 12rem;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover .hero-image {
      transform: scale(1.05);
    }
  }

  .hero-image {
    width: 100%;
    height: 100%;
    //object-fit: cover;
    //transition: transform 0.6s ease;
  }

  .hero-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 50%, #7c3aed 100%);
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(20, 15, 10, 0.75) 0%,
      rgba(20, 15, 10, 0.1) 50%,
      transparent 100%
    );
  }

  .hero-content {
    position: absolute;
    left: 0;
    padding: 0 36px;
    z-index: 1;
  }

  .hero-badge {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(139, 92, 246, 0.9);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    border-radius: 20px;
    letter-spacing: 0.06em;
    //text-transform: uppercase;
    margin-bottom: 12px;
    font-family: "Playfair Display", serif;
  }

  .hero-title {
    font-family: "Playfair Display", serif;
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 4px;
    letter-spacing: -0.01em;
  }

  .hero-subtitle {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 12px;
    font-weight: 300;
  }

  .hero-meta {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }

  .hero-meta-dot {
    color: rgba(255, 255, 255, 0.4);
  }

  /* Empty state */
  .hero-empty {
    background: linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%);
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: linear-gradient(135deg, #e4e0fc 0%, #b8abf8 100%);
    }
  }

  .hero-empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #6366f1;
  }

  .hero-empty-title {
    font-family: "Playfair Display", serif;
    font-size: 24px;
    font-weight: 700;
    color: #3730a3;
  }

  .hero-empty-sub {
    font-size: 14px;
    color: #6366f1;
    font-weight: 300;
  }

  @media screen and (max-width: 600px) {
    .hero-image-wrap {
      height: 240px;
    }

    .hero-title {
      font-size: 28px;
    }

    .hero-content {
      padding: 24px;
    }

    .hero-empty-title {
      font-size: 20px;
    }
  }
`;
