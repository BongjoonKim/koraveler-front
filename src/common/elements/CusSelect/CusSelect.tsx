import React from "react";
import styled from "styled-components";
import { Select } from "@chakra-ui/react";
import { ReactNode } from "react";

interface CusSelectProps {
  children?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;  // value를 직접 받음
  placeholder?: string;
}

export default function CusSelect(props: CusSelectProps) {
  return (
    <StyledCusSelect>
      <Select.Root
        value={props.value}
        onValueChange={props.onChange}  // value를 직접 전달
      >
        <Select.Trigger>
          <Select.ValueText placeholder={props.placeholder} />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Content>
          {props.children}
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

        &:hover {
            border-color: #cbd5e0;
        }
    }

    [data-part="content"] {
        margin-top: 4px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    [data-part="item"] {
        padding: 8px 12px;
        cursor: pointer;

        &:hover {
            background: #f7fafc;
        }

        &[data-selected] {
            background: #edf2f7;
        }
    }
`;