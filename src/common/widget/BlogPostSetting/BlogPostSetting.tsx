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
      <VStack gap={6} align="stretch">
        <Field.Root>
          <Field.Label>Select Folder</Field.Label>
          <FolderTree
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

const StyledBlogPostSetting = styled.div`
    padding: 1rem;
`;