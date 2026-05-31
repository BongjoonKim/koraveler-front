import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {ArrowRight, Calendar, MapPin, Users} from "lucide-react";
import {useGetMyTravels} from "../../../../../hooks/useTravelQueries";
import MountainBackdrop from "../../../blog/BlogPage/BlogHero/MountainBackdrop";

export interface TravelProjectHeroProps {}

function TravelProjectHero(_props: TravelProjectHeroProps) {
  const navigate = useNavigate();
  const {data} = useGetMyTravels(0, 1);

  const featured = data?.travels?.[0];

  const getDaysCount = () => {
    if (!featured?.startDate || !featured?.endDate) return null;
    const start = new Date(featured.startDate);
    const end = new Date(featured.endDate);
    return (
      Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1
    );
  };

  const days = getDaysCount();
  const memberCount =
    featured?.memberCount ?? featured?.members?.length ?? 0;

  const handleOpen = () => {
    if (featured?.id) navigate(`/travel/dashboard/${featured.id}`);
    else navigate("/travel/create");
  };

  const heroTitle = featured?.title || "Start Your Journey";
  const heroSubtitle = featured
    ? "Pick up where you left off"
    : "Create your first travel project";
  const ctaText = featured ? "Open project" : "Create travel project";

  return (
    <StyledHero>
      <MountainBackdrop />

      <HeroInner>
        <PinRing aria-hidden>
          <MapPin size={22} strokeWidth={1.6} />
        </PinRing>

        <HeroTitle>{heroTitle}</HeroTitle>
        <HeroSubtitle>{heroSubtitle}</HeroSubtitle>

        {featured && (
          <MetaRow>
            {featured.destination && (
              <BadgePill variant="outline">{featured.destination}</BadgePill>
            )}
            {days && (
              <MetaItem>
                <Calendar size={12} />
                <span>{days} days</span>
              </MetaItem>
            )}
            {memberCount > 0 && (
              <MetaItem>
                <Users size={12} />
                <span>{memberCount} members</span>
              </MetaItem>
            )}
          </MetaRow>
        )}

        <HeroCta
          type="button"
          onClick={handleOpen}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleOpen();
          }}
        >
          <span>{ctaText}</span>
          <ArrowRight size={16} strokeWidth={1.7} />
        </HeroCta>
      </HeroInner>
    </StyledHero>
  );
}

export default TravelProjectHero;

const StyledHero = styled.div`
  position: relative;
  width: 100%;
  min-height: 360px;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 720px) {
    min-height: 300px;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PinRing = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  border: 1px solid rgba(169, 193, 159, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a9c19f;
  margin-bottom: 22px;
`;

const HeroTitle = styled.h1`
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: white;
  line-height: 1.15;
`;

const HeroSubtitle = styled.p`
  margin-top: 12px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 16px;
`;

const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

const BadgePill = styled.span<{variant?: "outline"}>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${(p) => (p.variant === "outline" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.92)")};
  background: ${(p) => (p.variant === "outline" ? "transparent" : "rgba(255,255,255,0.08)")};
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
`;

const HeroCta = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 26px;
  padding: 13px 22px;
  background: #2f5743;
  border: 1px solid #4a7a5d;
  border-radius: 11px;
  color: #e3eedb;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.18s ease;

  &:hover {
    background: #386851;
    transform: translateY(-1px);
  }
  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
  }
`;
