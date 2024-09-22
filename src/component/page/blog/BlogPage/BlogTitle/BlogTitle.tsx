import styled from "styled-components";
import useBlogTitle from "./useBlogTitle";
import CusSelect from "../../../../../common/elements/CusSelect";
import {BlogListSortsOptionsType} from "../../../../../constants/constants";

export interface BlogTitleProps {

};

function BlogTitle(props: BlogTitleProps) {
  const {
    curPageTitle,
    sortOptions,
    changeSort,
    selectedOption
  } = useBlogTitle(props);
  
  return (
    <StyledBlogTitle>
      <div className="left">
        <span className="title">
          {curPageTitle}
        </span>
      </div>
      <div className="right">
        <CusSelect onChange={changeSort} value={selectedOption}>
          {sortOptions.map((option : BlogListSortsOptionsType) => {
            return (
              <option>{option.label}</option>
            )
          })}
        </CusSelect>
      </div>
    </StyledBlogTitle>
  )
};

export default BlogTitle;

const StyledBlogTitle = styled.div`
  display: flex;
  flex-direction: row;
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
