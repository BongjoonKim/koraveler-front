import styled from "styled-components";
import CreateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/CreateEditor";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import useCreateBlogPost from "./useCreateBlogPost";
import useSaveBlogPost from "../SaveBlogPost/useSaveBlogPost";

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
    handleEdit
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
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`
  height: 100%;
  width: 100%;
`;
