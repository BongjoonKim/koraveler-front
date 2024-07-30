import styled from "styled-components";
import SimpleDocViewer from "../../../../common/layout/BlogLayout/BlogList/SimpleDocViewer/SimpleDocViewer";
import useBlogHome from "./useBlogHome";

export interface BlogHomeProps {

};

function BlogHome(props: BlogHomeProps) {
  const {
    blogList
  } = useBlogHome(props);
  
  return (
    <StyledBlogList>
        <SimpleDocViewer/>
    </StyledBlogList>
  )
};

export default BlogHome;

const StyledBlogList = styled.div`

`;
