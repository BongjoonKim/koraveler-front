import React from "react";
import styled from "styled-components";
import { Select } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CusSelectProps {
  children?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function CusSelect(props: CusSelectProps) {
  return (
    <StyledCusSelect>
      <Select.Root
        value={props.value ? [props.value] : []}
        onValueChange={(details: any) => {
          if (props.onChange && details.value && details.value[0]) {
            props.onChange(details.value[0]);
          }
        }}
      >
        <Select.Trigger>
          <Select.ValueText placeholder={props.placeholder} />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Content>
          <Select.ItemGroup>
            {props.children}
          </Select.ItemGroup>
        </Select.Content>
      </Select.Root>
    </StyledCusSelect>
  );
}

const StyledCusSelect = styled.div`
    width: 200px;

    [data-part="trigger"] {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:hover {
            border-color: #cbd5e0;
        }

        &:focus {
            outline: 2px solid #3182ce;
            outline-offset: 2px;
        }
    }

    [data-part="content"] {
        margin-top: 4px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-height: 300px;
        overflow-y: auto;
    }

    [data-part="item"] {
        padding: 8px 12px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
            background: #f7fafc;
        }

        &[data-selected] {
            background: #edf2f7;
        }

        &[data-highlighted] {
            background: #e6f3ff;
        }
    }

    [data-part="indicator"] {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
    }
`;