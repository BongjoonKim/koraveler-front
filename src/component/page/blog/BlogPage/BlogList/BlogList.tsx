import styled from "styled-components";
import SimpleDocViewer from "../../../../../common/layout/BlogLayout/BlogList/SimpleDocViewer/SimpleDocViewer";
import useBlogList from "./useBlogList";

export interface BlogHomeProps {

};

function BlogList(props: BlogHomeProps) {
  const {
    blogList
  } = useBlogList(props);
  
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

export default BlogList;

const StyledBlogList = styled.ul`
  //padding: 2rem;
  display: grid;
  grid-template-columns: repeat(1, 100%);
  grid-gap: 2rem;
  width: 100%;

  @media screen and (min-width: 720px) {
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 1rem));
    grid-gap: 2rem;
    //width: 100%;
  }

  @media screen and (min-width: 1440px) {
    display: grid;
    grid-template-columns: repeat(3, calc(33.3% - 2rem * 2 / 3));
    grid-gap: 2rem;
    //width: 100%;
  }
  
  @media screen and (min-width: 1920px) {
    display: grid;
    grid-template-columns: repeat(4, 25% - 2rem * 3 / 4);
    grid-gap: 2rem;
`;
