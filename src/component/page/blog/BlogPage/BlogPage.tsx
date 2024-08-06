import styled from "styled-components";
import BlogHeader from "./BlogHeader";
import BlogList from "./BlogList";

export interface BlogPageProps {

};

function BlogPage(props: BlogPageProps) {
  
  return (
    <StyledBlogPage>
      <div className="blog-layout" >
        <BlogHeader />
        <BlogList />
      </div>
    </StyledBlogPage>
  )
};

export default BlogPage;

const StyledBlogPage = styled.div`
  width: inherit;
  display: inline-flex;
  justify-content: center;
  //.blog-layout {
    @media (min-width: 1440px) {
      width: 1200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  //}

`;
