import styled from "styled-components";
import {ReactNode} from "react";
import PartType, {PartTypeProps} from "./PartType/PartType";

interface ParasProps  {
  children: ReactNode
}

interface ParagraphProps {
  children : ReactNode;
}

interface ChapterProps {
  children : ReactNode;
}

interface SectionProps {
  children : ReactNode;
  sectionTitle ?: string
}

interface PartProps extends PartTypeProps{
  partTitle : string;
  type : string;
}


function Paras(props : ParasProps) {
  return (
    <StyledParagraphs>
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
      <PartType type={props.type} />
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
`;

const StyledParagraph = styled.div`
`;

const StyledChapter = styled.div`
`;

const StyledSection = styled.div`
`;

const StyledPart = styled.div`
  display: flex;
`;