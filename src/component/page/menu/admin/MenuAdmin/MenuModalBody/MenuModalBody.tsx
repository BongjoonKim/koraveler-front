import styled from "styled-components";
import React from "react";
import Paragraphs from "../../../../../../common/layout/Paras";
import Paras from "../../../../../../common/layout/Paras";

interface MenuModalBodyProps {

}

function MenuModalBody(props : MenuModalBodyProps) {
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
            />
            <Paras.Part
              partTitle="Value"
              type="textField"
            />
            <Paras.Part
              partTitle="Sequence"
              type="textField"
            />
            <Paras.Part
              partTitle="URL"
              type="textField"
            />
            <Paras.Part
              partTitle="Types"
              type="textField"
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