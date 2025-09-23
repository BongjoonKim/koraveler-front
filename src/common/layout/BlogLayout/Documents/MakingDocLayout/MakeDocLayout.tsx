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
  handleSaveModalOpen : () => void;
  
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
          className="blog-title-input"
          placeholder='제목을 입력하세요'
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
      <div className="blog-footer">
        <div className="buttons">
          <CusButton
            onClick={props.handleSaveModalOpen}
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
        padding: 2rem 1rem 1rem 1rem;

        .blog-title-input {
            /* Chakra UI Input 오버라이드 */
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background: transparent !important;

            font-size: 2.5rem;
            font-weight: 700;
            color: #222;
            line-height: 1.3;

            &::placeholder {
                color: #aaa;
                font-weight: 400;
            }

            &:focus {
                border: none !important;
                outline: none !important;
                box-shadow: none !important;
            }

            &:hover {
                border: none !important;
            }

            /* 반응형 폰트 크기 */
            @media (max-width: 768px) {
                font-size: 2rem;
            }

            @media (max-width: 480px) {
                font-size: 1.75rem;
            }
        }

        /* InputGroup 스타일 오버라이드 */
        .chakra-input-group {
            border: none !important;

            .chakra-input__group {
                border: none !important;
            }
        }
    }

    .blog-body {
        flex: 1;
        width: 100%;
        overflow-y: auto;
        /* TinyMCE 에디터 테두리 제거 */
        .tox-tinymce {
            border: none !important;
            box-shadow: none !important;
        }

        .tox-editor-header {
            border-bottom: 1px solid #e0e0e0 !important;
            background: transparent !important;
        }

        .tox-editor-container {
            border: none !important;
        }

        .tox-statusbar {
            border-top: 1px solid #e0e0e0 !important;
            background: #fafafa !important;
        }
    }

    .blog-footer {
        padding: 1rem;
        border-top: 1px solid #f0f0f0;
        background: #fafafa;
        .buttons {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
        }
    }
`;
