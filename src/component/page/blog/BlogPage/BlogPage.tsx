import styled from "styled-components";
import BlogHeader from "../../../../common/layout/BlogLayout/BlogHeader";
import BlogList from "./BlogList";

export interface BlogPageProps {

};

function BlogPage(props: BlogPageProps) {
  
  return (
    <StyledBlogPage>
      <div className="blog-layout" >
        <BlogList />
      </div>
    </StyledBlogPage>
  )
};

export default BlogPage;

const StyledBlogPage = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  background: black;
  .blog-layout {
    height: 100%;
    width: 100%;
    padding: 2rem;
  }
  //justify-content: center;
  //width: 100vw;
  //.blog-layout {
  @media (min-width: 1800px) {
    .blog-layout {
      width: 1600px;
      height: 100%;
      width: 100%;
    }

  }
  //}

`;
