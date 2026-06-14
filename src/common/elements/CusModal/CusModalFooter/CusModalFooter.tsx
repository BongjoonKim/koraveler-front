// src/common/elements/CusModal/CusModalFooter/CusModalFooter.tsx

import styled from "styled-components";
import CusButton from "../../buttons/CusButton";
import {InitFooterButtonTypes} from "../../../../types/common/initial/initialCommon";
interface CusModalFooterProps {
  types : FooterButtonTypes[];
  createText ?: string;
  editText ?: string;
  cancelText ?: string;
  deleteText ?: string;
  doCreate ?: (props : any) => void;
  doEdit ?: (props : any) => void;
  doCancel ?: () => void;
  doDelete ?: () => void;
  /** primary(create) 버튼 색상 — 미지정 시 기존 기본(gray) 유지 */
  createColorPalette ?: "gray" | "red" | "orange" | "yellow" | "green" | "teal" | "blue" | "cyan" | "purple" | "pink";
}

export default function CusModalFooter(props : CusModalFooterProps) {
  return (
    <StyledCusModalFooter>
      {props.types.map((type : FooterButtonTypes) => {
        if (type === "create") {
          return (
            <CusButton
              colorPalette={props.createColorPalette}
              onClick={props.doCreate}
            >
              {props.createText}
            </CusButton>
          )
        } else if (type === InitFooterButtonTypes.EDIT) {
          return (
            <CusButton
              onClick={props.doEdit}
            >
              {props.editText}
            </CusButton>
          )
        } else if (type === InitFooterButtonTypes.DELETE) {
          return (
            <CusButton
              onClick={props.doDelete}
            >
              {props.deleteText}
            </CusButton>
          )
        } else if (type === InitFooterButtonTypes.CANCEL) {
          return (
            <CusButton
              onClick={props.doCancel}
            >
              {props.cancelText}
            </CusButton>
          )
        } else {
          return (
            <></>
          )
        }
      })}
    </StyledCusModalFooter>
  )
}

const StyledCusModalFooter = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  gap: 0.5rem;
`;