import styled from "styled-components";
import CreateDocument from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/CreateEditor";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import useCreateBlogPost from "./useCreateBlogPost";

export interface CreateBlogPostProps {

};

function CreateBlogPost(props: CreateBlogPostProps) {
  const {
    editorRef,
    document,
    setDocument,
    handleCreate
  } = useCreateBlogPost(props);
  return (
    <StyledCreateBlogPost>
      <MakeDocLayout
        type={"CREATE"}
        document={document}
        setDocument={setDocument}
        handleSave={handleCreate}
      >
        <CreateDocument
          ref={editorRef}
        />
      </MakeDocLayout>
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`

`;
