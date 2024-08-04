import styled from "styled-components";
import BlogHeader from "./BlogHeader";
import BlogList from "./BlogList";

export interface BlogPageProps {

};

function BlogPage(props: BlogPageProps) {
  
  return (
    <StyledBlogPage>
      <BlogHeader />
      <BlogList />
    </StyledBlogPage>
  )
};

export default BlogPage;

const StyledBlogPage = styled.div`

`;
