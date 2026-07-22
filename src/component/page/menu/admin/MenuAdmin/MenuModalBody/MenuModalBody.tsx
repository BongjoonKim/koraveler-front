import styled from "styled-components";
import React, {Dispatch, SetStateAction} from "react";
import useMenuModalBody from "./useMenuModalBody";
import {Field, Label, TextInput} from "../../../../admin/adminUi";

export interface MenuModalBodyProps {
  data ?: MenusDTO;
  setData ?: Dispatch<SetStateAction<any>>
}

// 메뉴 편집 폼 필드 정의 (라벨 / MenusDTO 필드 / placeholder)
const FIELDS: { label: string; field: keyof MenusDTO; placeholder: string }[] = [
  { label: "Label", field: "label", placeholder: "메뉴에 표시될 이름" },
  { label: "Value", field: "value", placeholder: "내부 식별 값" },
  { label: "Sequence", field: "sequence", placeholder: "노출 순서 (숫자)" },
  { label: "URL", field: "url", placeholder: "/blog, /travel …" },
];

function MenuModalBody(props : MenuModalBodyProps) {
  const {
    handleChange
  } = useMenuModalBody(props);

  return (
    <StyledMenuModalBody>
      {FIELDS.map(({ label, field, placeholder }) => (
        <Field key={field as string}>
          <Label htmlFor={`menu-${field as string}`}>{label}</Label>
          <TextInput
            id={`menu-${field as string}`}
            value={(props.data?.[field] as string | number | undefined) ?? ""}
            placeholder={placeholder}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event, field, event.target.value)
            }
          />
        </Field>
      ))}
    </StyledMenuModalBody>
  )
}

export default MenuModalBody;

const StyledMenuModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
`;
