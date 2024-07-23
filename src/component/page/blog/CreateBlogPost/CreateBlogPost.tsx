import styled from "styled-components";
import CreateDocument from "../../../../common/layout/BlogLayout/Documents/CreateDocument";
import MakeDocLayout from "../../../../common/layout/BlogLayout/Documents/MakingDocLayout/MakeDocLayout";

interface CreateBlogPostProps {

};

function CreateBlogPost(props: CreateBlogPostProps) {
  
  return (
    <StyledCreateBlogPost>
      <MakeDocLayout type={"CREATE"}>
        <CreateDocument/>
      </MakeDocLayout>
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`

`;
