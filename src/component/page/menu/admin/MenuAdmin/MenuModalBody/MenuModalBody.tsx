import styled from "styled-components";
import React, {Dispatch, MutableRefObject, SetStateAction} from "react";
import Paragraphs from "../../../../../../common/layout/Paras";
import Paras from "../../../../../../common/layout/Paras";
import useMenuModalBody from "./useMenuModalBody";

export interface MenuModalBodyProps {
  data ?: MenusDTO;
  setData ?: Dispatch<SetStateAction<any>>
}

function MenuModalBody(props : MenuModalBodyProps) {
  const {
    handleChange
  } = useMenuModalBody(props);
  return (
    <StyledMenuModalBody>
      <Paras
      >
        <Paras.Pharagraph>
          <Paras.Section
          >
            <Paras.Part
              partTitle="Label"
              type="textField"
              onChange={(event : any) => handleChange(event, "label")}
              field={"textField"}
              value={props.data?.label}
            />
            <Paras.Part
              partTitle="Value"
              type="textField"
              onChange={(event: any) => handleChange(event, "value")}
              field={"textField"}
              value={props.data?.value}
            />
            <Paras.Part
              partTitle="Sequence"
              type="textField"
              onChange={(event : any) => handleChange(event, "sequence")}
              field={"textField"}
              value={props.data?.sequence}
            />
            <Paras.Part
              partTitle="URL"
              type="textField"
              onChange={(event : any) => handleChange(event, "url")}
              field={"textField"}
              value={props.data?.url}
            />
            <Paras.Part
              partTitle="Types"
              type="textField"
              onChange={(event : any) => handleChange(event, "types")}
              field={"textField"}
              value={props.data?.types}
            />
          </Paras.Section>
        </Paras.Pharagraph>
      </Paras>
    </StyledMenuModalBody>
  )
}

export default MenuModalBody;

const StyledMenuModalBody = styled.div`
`;