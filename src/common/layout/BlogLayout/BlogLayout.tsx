import styled from "styled-components";
import { ReactNode } from "react";
import BlogHeader from "./BlogHeader";
import Sidebar from "../Sidebar/Sidebar";

export interface BlogLayoutProps {
  children: ReactNode;
}

function BlogLayout(props: BlogLayoutProps) {
  return (
    <StyledBlogLayout>
      <Sidebar/>
      <MainContent>
        <BlogHeader />
        <BlogBody>
          {props.children}
        </BlogBody>
      </MainContent>
    </StyledBlogLayout>
  );
}

export default BlogLayout;

const StyledBlogLayout = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 72px; /* 사이드바 너비만큼 여백 */
  height: 100vh;
  overflow: hidden;
`;

const BlogBody = styled.div`
  flex: 1;
  //padding: 20px;
  overflow-y: auto;
`;