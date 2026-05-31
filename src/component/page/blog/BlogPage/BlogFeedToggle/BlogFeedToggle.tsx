import React from "react";
import styled from "styled-components";
import {useMyBadges} from "../../../../../hooks/useUserQueries";

export type FeedMode = "all" | "following";

interface BlogFeedToggleProps {
  mode: FeedMode;
  onChange: (mode: FeedMode) => void;
  isLoggedIn: boolean;
  followingSince?: string | null;
}

function BlogFeedToggle({mode, onChange, isLoggedIn, followingSince}: BlogFeedToggleProps) {
  const {data: badges} = useMyBadges(followingSince, isLoggedIn);
  const unread = badges?.followingUnread ?? 0;

  return (
    <StyledWrap>
      <SectionLabel>LATEST STORIES</SectionLabel>
      <ToggleGroup role="tablist" aria-label="Feed mode">
        <ToggleButton
          type="button"
          role="tab"
          aria-selected={mode === "all"}
          $active={mode === "all"}
          onClick={() => onChange("all")}
        >
          All
        </ToggleButton>
        {isLoggedIn && (
          <ToggleButton
            type="button"
            role="tab"
            aria-selected={mode === "following"}
            $active={mode === "following"}
            onClick={() => onChange("following")}
          >
            Following
            {unread > 0 && <Badge aria-label={`${unread} new posts`}>{unread > 99 ? "99+" : unread}</Badge>}
          </ToggleButton>
        )}
      </ToggleGroup>
    </StyledWrap>
  );
}

export default BlogFeedToggle;

const StyledWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SectionLabel = styled.h2`
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  margin: 0;
`;

const ToggleGroup = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  padding: 3px;
`;

const ToggleButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  background: ${(p) => (p.$active ? "rgba(255,255,255,0.92)" : "transparent")};
  color: ${(p) => (p.$active ? "#1a1a1a" : "rgba(255,255,255,0.7)")};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    color: ${(p) => (p.$active ? "#1a1a1a" : "white")};
  }
`;

const Badge = styled.span`
  background: rgba(20, 110, 90, 0.85);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
  min-width: 16px;
  text-align: center;
  letter-spacing: 0;
`;
