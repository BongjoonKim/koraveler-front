// common/elements/CusSelect/CusSelect.tsx
import React from "react";
import styled from "styled-components";
import {Select} from "@chakra-ui/react";
import {ReactNode} from "react";

interface CusSelectProps {
  children?: ReactNode;
  value?: string;
  onChange?: (event: any) => void;
  // 다른 Select 관련 props들
}

export default function CusSelect(props: CusSelectProps) {
  return (
    <StyledCusSelect>
      <Select.Root value={props.value} onValueChange={props.onChange}>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.Content>
          {props.children}
        </Select.Content>
      </Select.Root>
    </StyledCusSelect>
  );
}

const StyledCusSelect = styled.div`
    /* Select는 namespace이므로 styled에서 직접 사용 불가 */
`;