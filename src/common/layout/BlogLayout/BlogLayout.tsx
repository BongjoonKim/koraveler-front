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

`;
