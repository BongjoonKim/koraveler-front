import styled from "styled-components";
import {ReactNode} from "react";
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
  handleCancel?: () => void;
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
          <FooterButton type="button" $primary onClick={props.handleSaveModalOpen}>
            Save
          </FooterButton>
          <FooterButton type="button" onClick={() => props.handleSave(BLOG_SAVE_TYPE.DRAFT)}>
            Draft
          </FooterButton>
          <FooterButton type="button" onClick={props.handleCancel}>
            Cancel
          </FooterButton>
        </div>
      </div>
    </StyledMakeDocLayout>
  )
};

export default MakingDocumentLayout;

const StyledMakeDocLayout = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;           /* height: 100% 대신 */
    min-height: 0;     /* 추가 */
    width: 100%;
    overflow: hidden;  /* 추가 */
    background: #0a0c0c;
    color: #e8eaeb;

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
            color: #ffffff;
            line-height: 1.3;

            &::placeholder {
                color: rgba(255, 255, 255, 0.3);
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
        min-height: 0;
        overflow: hidden;  /* hidden으로 변경 */
        display: flex;     /* 추가 */
        flex-direction: column;  /* 추가 */
        /* TinyMCE 에디터 테두리 제거 (레거시 — 현재는 TipTap 사용) */
        .tox-tinymce {
            border: none !important;
            box-shadow: none !important;
        }

        .tox-editor-header {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            background: transparent !important;
        }

        .tox-editor-container {
            border: none !important;
        }

        .tox-statusbar {
            border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
            background: #14191a !important;
        }
    }

    .blog-footer {
        padding: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        background: #0f1414;
        .buttons {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
        }
    }
`;

const FooterButton = styled.button<{ $primary?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 20px;
    border-radius: 8px;
    border: 1px solid ${({ $primary }) => ($primary ? "rgba(80, 107, 92, 0.55)" : "rgba(255, 255, 255, 0.12)")};
    background: ${({ $primary }) => ($primary ? "#2f5743" : "transparent")};
    color: ${({ $primary }) => ($primary ? "#ffffff" : "#c7d2cc")};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;

    &:hover {
        background: ${({ $primary }) => ($primary ? "#386851" : "rgba(255, 255, 255, 0.04)")};
        border-color: ${({ $primary }) => ($primary ? "rgba(80, 107, 92, 0.7)" : "rgba(255, 255, 255, 0.18)")};
        color: #ffffff;
    }

    &:focus-visible {
        outline: 2px solid rgba(127, 184, 154, 0.55);
        outline-offset: 2px;
    }
`;
