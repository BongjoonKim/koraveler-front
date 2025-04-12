import styled from "styled-components";
import CreateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/CreateEditor";
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
        handleSave={(saveOrDraft : string) => handleCreate(saveOrDraft)}
      >
        <CreateEditor
          ref={editorRef}
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
