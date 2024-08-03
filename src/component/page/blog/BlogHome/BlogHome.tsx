import styled from "styled-components";
import SimpleDocViewer from "../../../../common/layout/BlogLayout/BlogList/SimpleDocViewer/SimpleDocViewer";
import useBlogHome from "./useBlogHome";

export interface BlogHomeProps {

};

function BlogHome(props: BlogHomeProps) {
  const {
    blogList
  } = useBlogHome(props);
  
  console.log("블로그 리스트", blogList)
  
  return (
    <StyledBlogList>
      {blogList?.documentsDTO?.map(blog => {
        return (
          <SimpleDocViewer
            {...blog}
          />
        )
      })}
    </StyledBlogList>
  )
};

export default BlogHome;

const StyledBlogList = styled.ul`
  @media screen and (max-width: 1440px) {
    grid-template-rows:;
  }
  }
  
  @media screen and (max-width: 1919px) {
  
`;
