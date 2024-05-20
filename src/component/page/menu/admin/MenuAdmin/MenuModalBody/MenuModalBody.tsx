import styled from "styled-components";
import React, {Dispatch, MutableRefObject, SetStateAction} from "react";
import Paragraphs from "../../../../../../common/layout/Paras";
import Paras from "../../../../../../common/layout/Paras";
import useMenuModalBody from "./useMenuModalBody";

export interface MenuModalBodyProps {
  data ?: MenusDTO;
  setData ?: Dispatch<SetStateAction<any>>
}
type menuType = keyof MenusDTO;

type ArrayOfKeys<T> = (keyof T)[];
function MenuModalBody(props : MenuModalBodyProps) {
  const {
    handleChange
  } = useMenuModalBody(props);
  
  return (
    <StyledMenuModalBody>
      <Paras
      >
        <Paras.Pharagraph>
          <Paras.Section>
            <Paras.Part
              key={"label"}
              partTitle={"label"}
              inputType={"textField"}
              fieldType={typeof props.data?.label}
              field={"label"}
              value={props.data?.label}
              onChange={(event : any, field?: any, value?: any) => handleChange(event, field, value)}
            />
            <Paras.Part
              key={"value"}
              partTitle={"value"}
              inputType={"textField"}
              fieldType={typeof props.data?.value}
              field={"value"}
              value={props.data?.value}
              onChange={(event : any, field?: any, value?: any) => handleChange(event, field, value)}
            />
            <Paras.Part
              key={"sequence"}
              partTitle={"sequence"}
              inputType={"textField"}
              fieldType={typeof props.data?.sequence}
              field={"sequence"}
              value={props.data?.sequence}
              onChange={(event : any, field?: any, value?: any) => handleChange(event, field, value)}
            />
            <Paras.Part
              key={"url"}
              partTitle={"url"}
              inputType={"textField"}
              fieldType={typeof props.data?.url}
              field={"url"}
              value={props.data?.url}
              onChange={(event : any, field?: any, value?: any) => handleChange(event, field, value)}
            />
            {/*<Paras.Part*/}
            {/*  key={"types"}*/}
            {/*  partTitle={"types"}*/}
            {/*  inputType={"selectBoxSingle"}*/}
            {/*  fieldType={typeof props.data?.types}*/}
            {/*  field={"types"}*/}
            {/*  value={props.data?.types}*/}
            {/*  onChange={(event : any, field?: any, value?: any) => handleChange(event, field, value)}*/}
            {/*/>*/}
          </Paras.Section>
        </Paras.Pharagraph>
      </Paras>
    </StyledMenuModalBody>
  )
}

export default MenuModalBody;

const StyledMenuModalBody = styled.div`
`;