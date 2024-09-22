import styled from "styled-components";
import {ReactNode} from "react";
import CusButton from "../../../../elements/buttons/CusButton";
import CusInput from "../../../../elements/textField/CusInput";
import useMakeDocLayout from "./useMakeDocLayout";
import {BLOG_SAVE_TYPE} from "../../../../../constants/constants";

export interface MakeDocLayoutProps {
  type : ActType;
  children ?: ReactNode;
  document ?: DocumentDTO;
  setDocument ?: any;
  handleSave : (saveOrDraft : string) => void;
};

function MakingDocumentLayout(props: MakeDocLayoutProps) {
  const {
    // document,
    // setDocument
  } = useMakeDocLayout(props);
  return (
    <StyledMakeDocLayout>
      <div className="blog-header">
        <CusInput
          variant='unstyled'
          placeholder='Unstyled'
          value={props?.document?.title}
          onChange={(event) => {
            const value = event.target.value;
            props.setDocument((prev : DocumentDTO) => ({...prev, title : value}));
          }}
        />
      </div>
      <div className="blog-body">
        {props.children}
      </div>
      <div className="blog-header">
        <div className="buttons">
          <CusButton
            onClick={() => props.handleSave(BLOG_SAVE_TYPE.SAVE)}
          >
            Save
          </CusButton>
          <CusButton
            onClick={() => props.handleSave(BLOG_SAVE_TYPE.DRAFT)}
          >
            Draft
          </CusButton>
          <CusButton
          >
            Cancel
          </CusButton>
        </div>
      </div>
    </StyledMakeDocLayout>
  )
};

export default MakingDocumentLayout;

const StyledMakeDocLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .blog-header {
    padding: 1rem 1rem;
    input {
      font-size: 3rem;
    }
  }
  .buttons {
    display: flex;
    gap : 0.5rem;
  }
`;
