import styled from "styled-components";
import useEditBlogPost from "./useEditBlogPost";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";
import UpdateEditor from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/UpdateEditor";

export interface EditBlogPostProps {

};

function EditBlogPost(props: EditBlogPostProps) {
  const {
    editorRef,
    document,
    setDocument,
    handleEdit
  } = useEditBlogPost(props);
  return (
    <StyledEditBlogPost>
      <MakeDocLayout
        type={"UPDATE"}
        document={document}
        setDocument={setDocument}
        handleSave={handleEdit}
      >
        <UpdateEditor
          ref={editorRef}
          {...document}
        />
      </MakeDocLayout>
    </StyledEditBlogPost>
  )
};

export default EditBlogPost;

const StyledEditBlogPost = styled.div`
  height: 100%;
  width: 100%;
`;
