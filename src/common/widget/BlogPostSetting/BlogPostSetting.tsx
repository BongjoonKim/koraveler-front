// BlogPostSetting.tsx
import styled from "styled-components";
import FolderTree from "../FolderTree";
import useBlogPostSetting from "./useBlogPostSetting";
import CusRadio from "../../elements/CusRadio/CusRadio";
import { Dispatch, SetStateAction } from "react";
import { Field, VStack } from "@chakra-ui/react";

export interface BlogPostSettingProps {
  folders: any;
  setFolders: any;
  selectedFolder?: string;
  setSelectedFolder: Dispatch<SetStateAction<string | undefined>>;
  disclose: boolean;
  setDisclose: Dispatch<SetStateAction<boolean>>;
  openBlogPostingModal: boolean;
}

export default function BlogPostSetting(props: BlogPostSettingProps) {
  const {
    folders,
    handleFolderSelect,
    selectedFolder,
    showHideRadioOptions,
    disclose,
    handleDiscloseSelect
  } = useBlogPostSetting(props);
  
  return (
    <StyledBlogPostSetting>
      <VStack gap={7} align="stretch">
        <Field.Root>
          <Field.Label>Select Folder</Field.Label>
          <FolderTree
            dark
            folders={folders}
            handleFolderSelect={handleFolderSelect}
            selectedFolderId={selectedFolder}
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Show Setting</Field.Label>
          <CusRadio
            options={showHideRadioOptions}
            direction="horizontal"
            value={disclose.toString()}
            onChange={handleDiscloseSelect}
          />
        </Field.Root>
      </VStack>
    </StyledBlogPostSetting>
  );
}

/**
 * 저장 모달 본문 다크 테마.
 * 공유 컴포넌트(FolderTree/CusRadio)를 직접 건드리지 않고, 이 래퍼에서만 적용되도록
 * data-part / react-complex-tree CSS 변수를 스코프 오버라이드한다.
 */
const StyledBlogPostSetting = styled.div`
    padding: 0.5rem 0.25rem 0.25rem;
    color: #e8eaeb;

    /* 섹션 라벨 (Select Folder / Show Setting) */
    [data-scope="field"][data-part="label"] {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        margin-bottom: 0.5rem;
    }

    /* ── 라디오 (Show / Hide) ───────────────────────────── */
    [data-scope="radio-group"][data-part*="text"] {
        color: #c7d2cc;
        font-weight: 500;
    }
    [data-scope="radio-group"][data-part="item"]:hover [data-part*="text"] {
        color: #ffffff;
    }
    [data-scope="radio-group"][data-part*="control"] {
        border-color: rgba(255, 255, 255, 0.28);
        background: transparent;
    }
    [data-scope="radio-group"][data-part*="control"][data-state="checked"] {
        border-color: #7fb89a;
        background: #2f5743;
        color: #ffffff;
    }

    /* ── 폴더 트리 (react-complex-tree) 다크/브랜드 톤 ──── */
    --rct-color-tree-bg: transparent;
    --rct-color-focustree-item-selected-bg: rgba(127, 184, 154, 0.16);
    --rct-color-focustree-item-hover-bg: rgba(255, 255, 255, 0.05);
    --rct-color-focustree-item-active-bg: rgba(127, 184, 154, 0.24);
    --rct-color-focustree-item-selected-text: #ffffff;
    --rct-color-focustree-item-hover-text: #ffffff;
    --rct-color-focustree-item-active-text: #ffffff;
    --rct-bar-color: #7fb89a;  /* 선택 항목 좌측 바: 파랑 → 브랜드 그린 */
`;