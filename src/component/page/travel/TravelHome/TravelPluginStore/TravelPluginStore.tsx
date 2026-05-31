import styled from "styled-components";
import { Puzzle } from "lucide-react";
import TravelPluginCard from "./TravelPluginCard";
import TravelProjectSelectModal from "./TravelProjectSelectModal";
import { useTravelPluginStore } from "./useTravelPluginStore";

export interface TravelPluginStoreProps {}

function TravelPluginStore(props: TravelPluginStoreProps) {
  const { plugins, handlePluginSelect, projectSelectModal } = useTravelPluginStore();

  return (
    <StyledTravelPluginStore>
      <div className="plugin-section-header">
        <div className="plugin-section-title-wrap">
          <Puzzle size={22} strokeWidth={1.5} className="plugin-section-icon" />
          <h2 className="plugin-section-title">Travel Plugins</h2>
        </div>
        <p className="plugin-section-subtitle">
          Enhance your travel planning with powerful tools
        </p>
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

      {/* 프로젝트 선택 모달 */}
      <TravelProjectSelectModal
        isOpen={projectSelectModal.isOpen}
        isLoading={projectSelectModal.isLoading}
        searchQuery={projectSelectModal.searchQuery}
        selectedProject={projectSelectModal.selectedProject}
        targetPlugin={projectSelectModal.targetPlugin}
        filteredTravels={projectSelectModal.filteredTravels}
        onSearchChange={projectSelectModal.setSearchQuery}
        onSelectProject={projectSelectModal.setSelectedProject}
        onApply={projectSelectModal.handleApply}
        onClose={projectSelectModal.closeModal}
      />
    </StyledTravelPluginStore>
  );
}

export default TravelPluginStore;

const StyledTravelPluginStore = styled.div`
  margin-top: 3rem;

  .plugin-section-header {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .plugin-section-title-wrap {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .plugin-section-icon {
    color: #7d9786;
  }

  .plugin-section-title {
    font-family: Georgia, "Times New Roman", serif;
    font-size: 26px;
    font-weight: 700;
    color: white;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .plugin-section-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.55);
    margin: 0;
  }

  .plugin-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 22px;
  }

  @media screen and (max-width: 900px) {
    .plugin-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 600px) {
    margin-top: 2rem;

    .plugin-section-title {
      font-size: 22px;
    }

    .plugin-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
`;
