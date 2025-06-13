import styled from "styled-components";
import CreateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/CreateEditor";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import useCreateBlogPost from "./useCreateBlogPost";
import useSaveBlogPost from "../SaveBlogPost/useSaveBlogPost";
import CusModal from "../../../../common/elements/CusModal";
import BlogPostSetting from "../../../../common/widget/BlogPostSetting/BlogPostSetting";
import CusModalFooter from "../../../../common/elements/CusModal/CusModalFooter";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";

export interface CreateBlogPostProps {

};

function CreateBlogPost(props: CreateBlogPostProps) {
  // const {
  //   editorRef,
  //   document,
  //   setDocument,
  //   handleCreate
  // } = useCreateBlogPost(props);
  const {
    editorRef,
    document,
    setDocument,
    handleEdit,
    modalClose,
    openBlogPostingModal,
    handleSaveModalOpen,
    folders,
    setFolders,
    selectedFolder,
    setSelectedFolder,
    disclose,
    setDisclose,
  } = useSaveBlogPost(props)
  
  return (
    <StyledCreateBlogPost>
      <MakeDocLayout
        type={"CREATE"}
        document={document}
        setDocument={setDocument}
        handleSave={(saveOrDraft : string) => handleEdit(saveOrDraft)}
        handleSaveModalOpen={handleSaveModalOpen}
      >
        <CreateEditor
          ref={editorRef}
          {...document}
        />
      </MakeDocLayout>
      <CusModal
        isOpen={openBlogPostingModal}
        onClose={modalClose}
        title={"Saving Blog Post"}
        footer={
          <CusModalFooter
            types={["create", "cancel"]}
            createText={"save"}
            cancelText={"cancel"}
            doCreate={() => handleEdit(BLOG_SAVE_TYPE.SAVE)}
            doCancel={modalClose}
          />
        }
      >
        <BlogPostSetting
          folders={folders}
          setFolders={setFolders}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          disclose={disclose}
          setDisclose={setDisclose}
          openBlogPostingModal={openBlogPostingModal}
        />
      </CusModal>
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`
  height: 100%;
  width: 100%;
`;
