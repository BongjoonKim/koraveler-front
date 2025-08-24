// src/common/elements/CusTab/CusTab.tsx

import { Tabs } from "@chakra-ui/react";
import styled from "styled-components";
import { ReactNode } from "react";

export interface TabItem {
  label: string;
  value: string;
  content?: ReactNode;
  disabled?: boolean;
}

interface CusTabProps {
  tabs: TabItem[];
  onChange?: (value: string) => void;
  defaultValue?: string;
  value?: string; // controlled mode
  variant?: 'line' | 'subtle' | 'enclosed' | 'outline' | 'plain';
  size?: 'sm' | 'md' | 'lg';
  colorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
  orientation?: 'horizontal' | 'vertical';
  fitted?: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  showIndicator?: boolean;
}

function CusTab(props: CusTabProps) {
  const {
    tabs,
    onChange,
    defaultValue,
    value,
    variant = 'line',
    size = 'md',
    colorPalette = 'blue',
    orientation = 'horizontal',
    fitted = false,
    lazyMount = false,
    unmountOnExit = false,
    showIndicator = false,
    ...rest
  } = props;
  
  const handleValueChange = (details: { value: string | null }) => {
    if (details.value && onChange) {
      onChange(details.value);
    }
  };
  
  return (
    <StyledCusTab>
      <Tabs.Root
        variant={variant}
        size={size}
        colorPalette={colorPalette}
        orientation={orientation}
        fitted={fitted}
        lazyMount={lazyMount}
        unmountOnExit={unmountOnExit}
        defaultValue={defaultValue || tabs[0]?.value}
        value={value}
        onValueChange={handleValueChange}
        {...rest}
      >
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
          {showIndicator && <Tabs.Indicator />}
        </Tabs.List>
        
        <Tabs.ContentGroup>
          {tabs.map((tab) => (
            <Tabs.Content key={tab.value} value={tab.value}>
              {tab.content}
            </Tabs.Content>
          ))}
        </Tabs.ContentGroup>
      </Tabs.Root>
    </StyledCusTab>
  );
}

export default CusTab;

const StyledCusTab = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;