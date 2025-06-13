import styled from "styled-components";
import useEditBlogPost from "./useEditBlogPost";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import UpdateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/UpdateEditor";
import useSaveBlogPost from "../SaveBlogPost/useSaveBlogPost";
import CusModal from "../../../../common/elements/CusModal";
import BlogPostSetting from "../../../../common/widget/BlogPostSetting/BlogPostSetting";
import CusModalFooter from "../../../../common/elements/CusModal/CusModalFooter";
import {BLOG_SAVE_TYPE} from "../../../../constants/constants";

export interface EditBlogPostProps {

};

function EditBlogPost(props: EditBlogPostProps) {
  // const {
  //   editorRef,
  //   document,
  //   setDocument,
  //   handleEdit
  // } = useSaveBlogPost(props);
  
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
    <StyledEditBlogPost>
      <MakeDocLayout
        type={"UPDATE"}
        document={document}
        setDocument={setDocument}
        handleSave={(saveOrDraft : string) => handleEdit(saveOrDraft)}
        handleSaveModalOpen={handleSaveModalOpen}
      >
        <UpdateEditor
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
    </StyledEditBlogPost>
  )
};

export default EditBlogPost;

const StyledEditBlogPost = styled.div`
  height: 100%;
  width: 100%;
`;
