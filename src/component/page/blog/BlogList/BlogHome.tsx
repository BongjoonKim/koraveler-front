import styled from "styled-components";
import ViewDocLayout from "../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout";

export interface BlogListProps {

};

function BlogList(props: BlogListProps) {
  
  return (
    <StyledBlogList>
        <ViewDocLayout/>
    </StyledBlogList>
  )
};

export default BlogList;

const StyledBlogList = styled.div`

`;
