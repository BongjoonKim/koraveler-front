import styled from "styled-components";
import CreateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/CreateEditor";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import useCreateBlogPost from "./useCreateBlogPost";
import useSaveBlogPost from "../SaveBlogPost/useSaveBlogPost";
import CusModal from "../../../../common/elements/CusModal";
import BlogPostSetting from "../../../../common/widget/BlogPostSetting/BlogPostSetting";

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
  } = useSaveBlogPost(props)
  
  return (
    <StyledCreateBlogPost>
      <MakeDocLayout
        type={"CREATE"}
        document={document}
        setDocument={setDocument}
        handleSave={(saveOrDraft : string) => handleEdit(saveOrDraft)}
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
      >
        <BlogPostSetting/>
      </CusModal>
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`
  height: 100%;
  width: 100%;
`;
