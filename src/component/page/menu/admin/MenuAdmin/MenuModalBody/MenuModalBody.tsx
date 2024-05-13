import styled from "styled-components";
import React, {Dispatch, MutableRefObject, SetStateAction} from "react";
import Paragraphs from "../../../../../../common/layout/Paras";
import Paras from "../../../../../../common/layout/Paras";
import useMenuModalBody from "./useMenuModalBody";

export interface MenuModalBodyProps {
  data ?: any;
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
              partTitle="Title"
              type="textField"
              onChange={handleChange}
              field={"textField"}
            />
            <Paras.Part
              partTitle="Value"
              type="textField"
              onChange={handleChange}
              field={"textField"}
            />
            <Paras.Part
              partTitle="Sequence"
              type="textField"
              onChange={handleChange}
              field={"textField"}
            />
            <Paras.Part
              partTitle="URL"
              type="textField"
              onChange={handleChange}
              field={"textField"}
            />
            <Paras.Part
              partTitle="Types"
              type="textField"
              onChange={handleChange}
              field={"textField"}
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