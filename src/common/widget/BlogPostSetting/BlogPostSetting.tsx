import styled from "styled-components";
import FolderTree from "../FolderTree";
import useBlogPostSetting from "./useBlogPostSetting";
import {FormControl, FormLabel} from "@chakra-ui/react";
import CusRadio from "../../elements/CusRadio/CusRadio";
import {Dispatch, SetStateAction} from "react";

export interface BlogPostSettingProps{
  folders: any;
  setFolders : any;
  selectedFolder ?: string;
  setSelectedFolder : Dispatch<SetStateAction<string | undefined>>;
  disclose : boolean;
  setDisclose : Dispatch<SetStateAction<boolean>>;
  openBlogPostingModal : boolean;
}

export default function BlogPostSetting(props : BlogPostSettingProps) {
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
      <FormControl>
        <FormLabel>
          Select Folder
        </FormLabel>
        <FolderTree
          folders={folders}
          handleFolderSelect={handleFolderSelect}
          selectedFolderId={selectedFolder}
        />
      </FormControl>
      <FormControl>
        <FormLabel>
          Show Setting
        </FormLabel>
        <CusRadio
          options={showHideRadioOptions}
          direction="horizontal"
          value={disclose.toString()}
          onChange={handleDiscloseSelect}
        />
      </FormControl>

    </StyledBlogPostSetting>
  )
}

const StyledBlogPostSetting = styled.div`
`;