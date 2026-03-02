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
      className={isComingSoon ? "coming-soon" : ""}
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
      onClick={() => !isComingSoon && onSelect?.(plugin)}
    >
      <div
        className="plugin-icon-wrap"
        style={{
          background: `linear-gradient(135deg, ${plugin.color}18, ${plugin.color}0a)`,
        }}
      >
        <Icon size={22} color={plugin.color} />
      </div>

      <h4 className="plugin-name">{plugin.name}</h4>
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
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(99, 102, 241, 0.12);
  border-radius: 16px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;

  opacity: 0;
  animation: ${scaleIn} 0.4s ease forwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.12);
    border-color: rgba(139, 92, 246, 0.25);
  }

  &.coming-soon {
    opacity: 0;
    animation: ${scaleIn} 0.4s ease forwards;
    cursor: default;

    .plugin-icon-wrap,
    .plugin-name,
    .plugin-desc {
      opacity: 0.45;
    }

    &:hover {
      transform: none;
      box-shadow: none;
      border-color: rgba(99, 102, 241, 0.12);
    }
  }

  .plugin-icon-wrap {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plugin-name {
    font-family: "Playfair Display", serif;
    font-size: 16px;
    font-weight: 700;
    color: #1e1b4b;
    margin: 0;
  }

  .plugin-desc {
    font-size: 13px;
    color: #64748b;
    font-weight: 300;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
    flex: 1;
  }

  .plugin-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .plugin-badge {
    display: inline-block;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 20px;
    letter-spacing: 0.02em;
  }

  .available-badge {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  }

  .coming-soon-badge {
    background: rgba(148, 163, 184, 0.15);
    color: #94a3b8;
  }

  @media screen and (max-width: 600px) {
    padding: 20px 16px;

    .plugin-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 12px;
    }
  }
`;
