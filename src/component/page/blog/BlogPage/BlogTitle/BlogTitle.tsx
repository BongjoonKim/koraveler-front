import styled from "styled-components";
import useBlogTitle from "./useBlogTitle";

export interface BlogTitleProps {

};

function BlogTitle(props: BlogTitleProps) {
  const {
    curPageTitle
  } = useBlogTitle(props);
  return (
    <StyledBlogTitle>
      <div className="left">
        <span className="title">
          {curPageTitle}
        </span>
      </div>
      <div className="right">
      </div>
    </StyledBlogTitle>
  )
};

export default BlogTitle;

const StyledBlogTitle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  .title {
    font-size: 32px;
    font-weight: 500;
  }
  user-select: none;
  @media screen and (min-width: 1800px) {
    max-width: 1800px;
  }

`;
