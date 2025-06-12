import styled from "styled-components";
import FolderTree from "../FolderTree";
import useBlogPostSetting from "./useBlogPostSetting";
import {FormControl, FormLabel} from "@chakra-ui/react";
import CusRadio from "../../elements/CusRadio/CusRadio";

export interface BlogPostSettingProps{

}

export default function BlogPostSetting(props : BlogPostSettingProps) {
  const {
    folders,
    handleFolderSelect,
    selectedFolder,
    showHideRadioOptions,
  } = useBlogPostSetting();
  return (
    <StyledBlogPostSetting>
      <FormControl>
        <FormLabel>
          Select Folder
        </FormLabel>
        <FolderTree
          folders={folders}
          handleFolderSelect={handleFolderSelect}
          selectedFolderId={selectedFolder?.id}
        />
      </FormControl>
      <FormControl>
        <FormLabel>
          Show Setting
        </FormLabel>
        <CusRadio
          options={showHideRadioOptions}
          direction="horizontal"
        />
      </FormControl>

    </StyledBlogPostSetting>
  )
}

const StyledBlogPostSetting = styled.div`
`;