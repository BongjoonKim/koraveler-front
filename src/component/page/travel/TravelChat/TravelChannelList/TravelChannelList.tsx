import React from "react";
import styled from "styled-components";
import { Plus, ArrowLeft, MessageCircle } from "lucide-react";
import TravelChannelItem from "./TravelChannelItem";
import type { TravelChannelResponse } from "../../../../../types/travel/travelChannelTypes";

interface TravelChannelListProps {
  channels: TravelChannelResponse[];
  isLoading: boolean;
  selectedChannelId?: string;
  travelTitle?: string;
  onSelect: (channel: TravelChannelResponse) => void;
  onCreateChannel: () => void;
  onBack: () => void;
}

const TravelChannelList: React.FC<TravelChannelListProps> = ({
  channels,
  isLoading,
  selectedChannelId,
  travelTitle,
  onSelect,
  onCreateChannel,
  onBack,
}) => {
  const pinnedChannels = channels.filter((c) => c.isPinned);
  const unpinnedChannels = channels.filter((c) => !c.isPinned);

  return (
    <Wrapper>
      <Header>
        <BackButton onClick={onBack}>
          <ArrowLeft size={18} />
        </BackButton>
        <HeaderTitle>{travelTitle || "Travel Chat"}</HeaderTitle>
        <CreateButton onClick={onCreateChannel}>
          <Plus size={18} />
        </CreateButton>
      </Header>

      <ChannelListWrapper>
        {isLoading ? (
          <EmptyState>
            <p>Loading channels...</p>
          </EmptyState>
        ) : channels.length === 0 ? (
          <EmptyState>
            <IconCircle>
              <MessageCircle size={24} />
            </IconCircle>
            <p>No channels yet</p>
            <EmptySubtext>Create a channel to start chatting</EmptySubtext>
            <CreateFirstButton onClick={onCreateChannel}>
              <Plus size={14} />
              Create Channel
            </CreateFirstButton>
          </EmptyState>
        ) : (
          <>
            {pinnedChannels.length > 0 && (
              <Section>
                <SectionLabel>Pinned</SectionLabel>
                {pinnedChannels.map((channel) => (
                  <TravelChannelItem
                    key={channel.id}
                    channel={channel}
                    isSelected={channel.channelId === selectedChannelId}
                    onSelect={onSelect}
                  />
                ))}
              </Section>
            )}
            <Section>
              {pinnedChannels.length > 0 && <SectionLabel>Channels</SectionLabel>}
              {unpinnedChannels.map((channel) => (
                <TravelChannelItem
                  key={channel.id}
                  channel={channel}
                  isSelected={channel.channelId === selectedChannelId}
                  onSelect={onSelect}
                />
              ))}
            </Section>
          </>
        )}
      </ChannelListWrapper>
    </Wrapper>
  );
};

export default TravelChannelList;

const Wrapper = styled.div`
  width: 280px;
  min-width: 280px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: #0f1414;
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #c7d2cc;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
  }
`;

const HeaderTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CreateButton = styled.button`
  background: #2f5743;
  border: 1px solid rgba(80, 107, 92, 0.45);
  cursor: pointer;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, transform 0.15s;

  &:hover {
    background: #386851;
    transform: translateY(-1px);
  }
`;

const ChannelListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const Section = styled.div`
  margin-bottom: 8px;
`;

const SectionLabel = styled.div`
  font-size: 10.5px;
  font-weight: 600;
  color: #94a3a0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 14px 4px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;

  p {
    font-size: 14px;
    font-weight: 500;
    color: #c7d2cc;
    margin-top: 12px;
  }
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(46, 87, 62, 0.22);
  border: 1px solid rgba(80, 107, 92, 0.45);
  color: #7fb89a;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptySubtext = styled.span`
  font-size: 12px;
  color: #94a3a0;
  margin-top: 4px;
`;

const CreateFirstButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 8px 16px;
  background: #2f5743;
  color: white;
  border: 1px solid rgba(80, 107, 92, 0.45);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #386851;
  }
`;
