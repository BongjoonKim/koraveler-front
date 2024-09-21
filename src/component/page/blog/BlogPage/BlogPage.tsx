import styled from "styled-components";
import BlogList from "./BlogList";
import BlogTitle from "./BlogTitle";

export interface BlogPageProps {

};

function BlogPage(props: BlogPageProps) {

  return (
    <StyledBlogPage>
      <div className="blog-title">
        <BlogTitle />
      </div>
      <div className="blog-layout" >
        <BlogList />
      </div>
    </StyledBlogPage>
  )
};

export default BlogPage;

const StyledBlogPage = styled.div`
  min-height: calc(100vh - 7rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: white;
  height: 100%;
  width: 100%;
  padding: 2rem;
  gap : 0.5rem;
  .blog-title {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .blog-layout {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
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
