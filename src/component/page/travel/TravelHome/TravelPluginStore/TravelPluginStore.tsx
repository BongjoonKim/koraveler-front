import styled from "styled-components";
import { Puzzle } from "lucide-react";
import TravelPluginCard from "./TravelPluginCard";
import { useTravelPluginStore } from "./useTravelPluginStore";

export interface TravelPluginStoreProps {}

function TravelPluginStore(props: TravelPluginStoreProps) {
  const { plugins, handlePluginSelect } = useTravelPluginStore();

  return (
    <StyledTravelPluginStore>
      <div className="plugin-section-header">
        <div className="plugin-section-title-wrap">
          <Puzzle size={18} className="plugin-section-icon" />
          <h3 className="plugin-section-title">Travel Plugins</h3>
        </div>
        <span className="plugin-section-subtitle">
          Enhance your travel planning with powerful tools
        </span>
      </div>

      <div className="plugin-grid">
        {plugins.map((plugin, i) => (
          <TravelPluginCard
            key={plugin.id}
            plugin={plugin}
            index={i}
            onSelect={handlePluginSelect}
          />
        ))}
      </div>
    </StyledTravelPluginStore>
  );
}

export default TravelPluginStore;

const StyledTravelPluginStore = styled.div`
  margin-top: 32px;

  .plugin-section-header {
    margin-bottom: 20px;
  }

  .plugin-section-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }

  .plugin-section-icon {
    color: #8b5cf6;
  }

  .plugin-section-title {
    font-family: "Playfair Display", serif;
    font-size: 22px;
    font-weight: 700;
    color: #1e1b4b;
    margin: 0;
  }

  .plugin-section-subtitle {
    font-size: 14px;
    color: #6366f1;
    font-weight: 300;
  }

  .plugin-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  @media screen and (max-width: 900px) {
    .plugin-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 600px) {
    margin-top: 24px;

    .plugin-section-title {
      font-size: 20px;
    }

    .plugin-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
`;
