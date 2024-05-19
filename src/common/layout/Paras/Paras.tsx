import styled from "styled-components";
import {ReactNode} from "react";
import PartType, {PartTypeProps} from "./PartType/PartType";

interface ParasProps  {
  children: ReactNode
  parasTitle ?: string | ReactNode;
}

interface ParagraphProps {
  children : ReactNode;
  paragraphTitle ?: string | ReactNode;
}

interface ChapterProps {
  children : ReactNode;
  chapterTitle ?: string | ReactNode;
}

interface SectionProps {
  children : ReactNode;
  sectionTitle ?: string | ReactNode;
}

interface PartProps extends PartTypeProps{
  partTitle ?: string | ReactNode;
  inputType ?: string;
  fieldType ?: string;
  field ?: string;
  value ?: string | number | Date | any[];
  onChange ?: (event ?: any, field ?: any, value?: any) => void;
}


function Paras(props : ParasProps) {
  return (
    <StyledParagraphs
    >
      {props.children}
    </StyledParagraphs>
  )
}

function Pharagraphs(props : ParagraphProps) {
  return (
    <StyledParagraph>
      {props.children}
    </StyledParagraph>
  )
}

function Chapter(props : ChapterProps) {
  return (
    <StyledChapter>
      {props.children}
    </StyledChapter>
  )
}

function Section(props : SectionProps) {
  return (
    <StyledSection>
      <div className="section-title">
        {props.sectionTitle}
      </div>
      <div className="section-body">
        {props.children}
      </div>
    </StyledSection>
  )
}

function Part(props : PartProps) {
  return (
    <StyledPart>
      <div className="part-title">
        {props.partTitle}
      </div>
      <PartType
        inputType={props.inputType}
        fieldType={props.fieldType}
        field={props.field}
        value={props.value}
        onChange={(event : any, field: any, value: any) => props.onChange?.(event, field, value)}
      />
    </StyledPart>
  )
}

Paras.Pharagraph = Pharagraphs;
Paras.Chapter = Chapter;
Paras.Section = Section;
Paras.Part = Part;

export default Paras;

const StyledParagraphs = styled.div`
  display: flex;
  gap : 1rem;
  width: 100%;
`;

const StyledParagraph = styled.div`
  width: 100%;
`;

const StyledChapter = styled.div`
`;

const StyledSection = styled.div`
`;

const StyledPart = styled.div`
  width: 100%;
  
  margin: 0.5rem 0.5rem;
  display: flex;
  gap: 1rem;
  .part-title {
    width: 50%;
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;