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
  display: flex;
  justify-content: center;
  //justify-content: center;
  //width: 100vw;
  //.blog-layout {
    @media (min-width: 1800px) {
      .blog-layout {
        width: 1600px;
      }
      
    }
  //}

`;
