import styled, { keyframes } from "styled-components";
import { TravelPluginDefinition } from "../../../../../../types/travel/travelPluginTypes";

export interface TravelPluginCardProps {
  plugin: TravelPluginDefinition;
  index: number;
  onSelect?: (plugin: TravelPluginDefinition) => void;
}

function TravelPluginCard({ plugin, index, onSelect }: TravelPluginCardProps) {
  const Icon = plugin.icon;
  const isComingSoon = plugin.status === "coming_soon";

  return (
    <StyledTravelPluginCard
      className={isComingSoon ? "coming-soon" : "live"}
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
      onClick={() => !isComingSoon && onSelect?.(plugin)}
    >
      <div className="plugin-icon-wrap">
        <Icon size={22} strokeWidth={1.5} />
      </div>

      <h3 className="plugin-name">{plugin.name}</h3>
      <p className="plugin-desc">{plugin.description}</p>

      <div className="plugin-footer">
        {isComingSoon ? (
          <span className="plugin-badge coming-soon-badge">Coming Soon</span>
        ) : (
          <span className="plugin-badge available-badge">Available</span>
        )}
      </div>
    </StyledTravelPluginCard>
  );
}

export default TravelPluginCard;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const StyledTravelPluginCard = styled.div`
  background: #14191a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 26px 26px 22px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  min-height: 208px;

  opacity: 0;
  animation: ${scaleIn} 0.4s ease forwards;

  &.live:hover {
    transform: translateY(-2px);
    background: #1a2021;
    border-color: rgba(255, 255, 255, 0.18);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  }

  &.coming-soon {
    opacity: 0;
    animation: ${scaleIn} 0.4s ease forwards;
    cursor: default;

    .plugin-icon-wrap {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.32);
    }
    .plugin-name,
    .plugin-desc {
      opacity: 0.62;
    }

    &:hover {
      transform: none;
      box-shadow: none;
      background: #14191a;
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  .plugin-icon-wrap {
    width: 46px;
    height: 46px;
    border-radius: 12px;
    background: rgba(46, 87, 62, 0.18);
    color: #a9c19f;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  .plugin-name {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 20px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.92);
    margin: 0 0 10px;
    letter-spacing: -0.005em;
  }

  .plugin-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0;
    flex: 1;
  }

  .plugin-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
  }

  .plugin-badge {
    display: inline-block;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 7px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .available-badge {
    background: rgba(46, 87, 62, 0.28);
    color: #a9c19f;
  }

  .coming-soon-badge {
    background: transparent;
    color: rgba(255, 255, 255, 0.45);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  @media screen and (max-width: 600px) {
    padding: 22px 20px 20px;
    min-height: 188px;

    .plugin-icon-wrap {
      width: 42px;
      height: 42px;
    }

    .plugin-name {
      font-size: 18px;
    }
  }
`;
