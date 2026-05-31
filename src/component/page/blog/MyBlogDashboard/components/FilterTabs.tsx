import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import styled from "styled-components";
import type { DashboardTabKey } from "../useMyBlogDashboard";
import type { DashboardSort } from "../../../../../types/blog/myBlogTypes";

interface TabDef {
  key: DashboardTabKey;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  activeTab: DashboardTabKey;
  onChange: (key: DashboardTabKey) => void;
  counts: {
    posts: number;
    drafts: number;
    bookmarks: number;
  };
  sortKey: DashboardSort;
  onSortChange: (key: DashboardSort) => void;
}

const ACCENT = "#5a8a73";

const SORT_OPTIONS: { value: DashboardSort; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
];

function FilterTabs({ activeTab, onChange, counts, sortKey, onSortChange }: FilterTabsProps) {
  const tabs: TabDef[] = [
    { key: "my-posts", label: "My posts", count: counts.posts },
    { key: "drafts", label: "Drafts", count: counts.drafts },
    { key: "bookmarks", label: "Bookmarks", count: counts.bookmarks },
    { key: "hidden", label: "Hidden" },
    { key: "trash", label: "Trash" },
  ];

  return (
    <Flex
      align={"flex-end"}
      justify={"space-between"}
      borderBottom={"0.5px solid"}
      borderColor={"rgba(255,255,255,0.08)"}
      mb={"1rem"}
    >
      <HStack gap={"1.5rem"}>
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <Box
              key={tab.key}
              as={"button"}
              onClick={() => onChange(tab.key)}
              position={"relative"}
              paddingY={"0.75rem"}
              cursor={"pointer"}
              bg={"transparent"}
              _focus={{ outline: "none" }}
            >
              <HStack gap={"0.4rem"}>
                <Text
                  fontSize={"14px"}
                  fontWeight={isActive ? 500 : 400}
                  color={isActive ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.5)"}
                >
                  {tab.label}
                </Text>
                {typeof tab.count === "number" && (
                  <Text fontSize={"13px"} color={"rgba(255,255,255,0.35)"}>
                    {tab.count}
                  </Text>
                )}
              </HStack>
              {isActive && (
                <Box
                  position={"absolute"}
                  left={0}
                  right={0}
                  bottom={"-0.5px"}
                  height={"2px"}
                  bg={ACCENT}
                />
              )}
            </Box>
          );
        })}
      </HStack>

      <Box mb={"0.5rem"}>
        <StyledSelect
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as DashboardSort)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
      </Box>
    </Flex>
  );
}

export default FilterTabs;

// /blog/home/ko 의 StyledSelect 와 같은 형태(둥근 모서리, chevron, 14px) 를
// 다크 테마에 맞게 변환했다.
const StyledSelect = styled.select`
  padding: 6px 32px 6px 12px;
  border: 0.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  min-width: 110px;
  cursor: pointer;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.6)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px 14px;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.24);
    background-color: rgba(255, 255, 255, 0.06);
  }

  &:focus {
    border-color: ${ACCENT};
    box-shadow: 0 0 0 3px rgba(90, 138, 115, 0.18);
  }

  option {
    background-color: #1a1a1a;
    color: rgba(255, 255, 255, 0.9);
  }
`;
