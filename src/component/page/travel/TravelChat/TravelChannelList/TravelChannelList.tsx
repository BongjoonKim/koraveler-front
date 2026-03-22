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
  border-right: 1px solid #e8e8f0;
  background: white;
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
  border-bottom: 1px solid #f0f0f5;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b6b80;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;

  &:hover {
    background: #f5f5fa;
  }
`;

const HeaderTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CreateButton = styled.button`
  background: #4f46e5;
  border: none;
  cursor: pointer;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #4338ca;
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
  color: #a0a0b0;
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
    color: #6b6b80;
    margin-top: 12px;
  }
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f0ff;
  color: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EmptySubtext = styled.span`
  font-size: 12px;
  color: #a0a0b0;
  margin-top: 4px;
`;

const CreateFirstButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 8px 16px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #4338ca;
  }
`;
