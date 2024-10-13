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
  display: flex;
  flex-direction: column;
  background: white;
  height: 100%;
  width: 100%;
  padding: 1rem 2rem;
  gap : 0.5rem;
  .blog-title {
    width: 100%;
    height: 3rem;
    display: flex;
    justify-content: center;
  }
  .blog-layout {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  @media (min-width: 1800px) {
    .blog-title {
      display: flex;
      justify-content: center;
    }

  }
`;
