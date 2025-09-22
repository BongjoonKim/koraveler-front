import styled from "styled-components";
import useBlogTitle from "./useBlogTitle";
import {BLOG_LIST_SORTS, BlogListSortsOptionsType} from "../../../../../constants/constants";

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
        <StyledSelect
          value={selectedOption || BLOG_LIST_SORTS.LATEST}
          onChange={(e) => changeSort(e.target.value)}
        >
          {sortOptions.map((option: BlogListSortsOptionsType) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </StyledSelect>
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
  align-items: center;
  
  .title {
    font-size: 32px;
    font-weight: 500;
  }
  
  user-select: none;
  
  @media screen and (min-width: 1800px) {
    max-width: 1800px;
  }
`;

const StyledSelect = styled.select`
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: white;
    font-size: 14px;
    min-width: 150px;
    cursor: pointer;
    outline: none;

    &:hover {
        border-color: #cbd5e0;
    }

    &:focus {
        border-color: #3182ce;
        box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    }
`;