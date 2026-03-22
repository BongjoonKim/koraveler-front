import React from "react";
import styled from "styled-components";
import { MessageCircle, Pin, Users } from "lucide-react";
import type { TravelChannelResponse, ChannelContextType } from "../../../../../types/travel/travelChannelTypes";

interface TravelChannelItemProps {
  channel: TravelChannelResponse;
  isSelected: boolean;
  onSelect: (channel: TravelChannelResponse) => void;
}

const CONTEXT_LABELS: Record<ChannelContextType, string> = {
  GENERAL: "General",
  ITINERARY: "Itinerary",
  PLACE: "Place",
  MEDIA: "Media",
  INFO: "Info",
};

const CONTEXT_COLORS: Record<ChannelContextType, string> = {
  GENERAL: "#6366f1",
  ITINERARY: "#f59e0b",
  PLACE: "#22c55e",
  MEDIA: "#8b5cf6",
  INFO: "#06b6d4",
};

const TravelChannelItem: React.FC<TravelChannelItemProps> = ({
  channel,
  isSelected,
  onSelect,
}) => {
  const timeAgo = channel.lastMessageAt
    ? getTimeAgo(channel.lastMessageAt)
    : "";

  return (
    <ItemWrapper $isSelected={isSelected} onClick={() => onSelect(channel)}>
      <IconWrapper $color={CONTEXT_COLORS[channel.contextType]}>
        <MessageCircle size={16} />
      </IconWrapper>
      <Content>
        <TopRow>
          <ChannelName $isSelected={isSelected}>
            {channel.isPinned && <Pin size={12} />}
            {channel.channelName}
          </ChannelName>
          {timeAgo && <TimeAgo>{timeAgo}</TimeAgo>}
        </TopRow>
        <BottomRow>
          <ContextBadge $color={CONTEXT_COLORS[channel.contextType]}>
            {CONTEXT_LABELS[channel.contextType]}
          </ContextBadge>
          {channel.memberCount != null && channel.memberCount > 0 && (
            <MemberCount>
              <Users size={11} />
              {channel.memberCount}
            </MemberCount>
          )}
        </BottomRow>
        {channel.channelPurpose && (
          <Purpose>{channel.channelPurpose}</Purpose>
        )}
      </Content>
    </ItemWrapper>
  );
};

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
}

export default TravelChannelItem;

const ItemWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  background: ${({ $isSelected }) => ($isSelected ? "#f0f0ff" : "transparent")};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? "#c7d2fe" : "transparent")};

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "#f0f0ff" : "#f8f8fc")};
  }
`;

const IconWrapper = styled.div<{ $color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $color }) => `${$color}15`};
  color: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const ChannelName = styled.span<{ $isSelected: boolean }>`
  font-size: 13.5px;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 500)};
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TimeAgo = styled.span`
  font-size: 11px;
  color: #a0a0b0;
  flex-shrink: 0;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
`;

const ContextBadge = styled.span<{ $color: string }>`
  font-size: 10.5px;
  font-weight: 500;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}12`};
  padding: 1px 6px;
  border-radius: 4px;
`;

const MemberCount = styled.span`
  font-size: 11px;
  color: #a0a0b0;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const Purpose = styled.p`
  font-size: 11.5px;
  color: #8888a0;
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
