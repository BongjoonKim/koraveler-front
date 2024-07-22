import styled from "styled-components";
import CreateDocument from "../../../../common/layout/BlogLayout/Documents/CreateDocument";

interface CreateBlogPostProps {

};

function CreateBlogPost(props: CreateBlogPostProps) {
  
  return (
    <StyledCreateBlogPost>
      <CreateDocument/>
    </StyledCreateBlogPost>
  )
};

export default CreateBlogPost;

const StyledCreateBlogPost = styled.div`

`;
