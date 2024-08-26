import styled from "styled-components";
import {ReactNode} from "react";
import BlogHeader from "./BlogHeader";

export interface BlogLayoutProps {
  children : ReactNode;
};

function BlogLayout(props: BlogLayoutProps) {
  
  return (
    <StyledBlogLayout>
      <BlogHeader />
      <div className="blog-body">
        {props.children}
      </div>
    </StyledBlogLayout>
  )
};

export default BlogLayout;

const StyledBlogLayout = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1;
  .blog-body {
    height: 100%;
    width: 100%;
    flex: 1 1;
  }
`;
