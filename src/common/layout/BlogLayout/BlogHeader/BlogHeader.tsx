import styled from "styled-components";
import MenuHeader from "../../MenuHeader";
import LeftHeader from "../../HeaderLayout/LeftHeader";
import RightHeader from "../../HeaderLayout/RightHeader";
import HeaderLayout from "../../HeaderLayout";

export interface BlogHeaderProps {

};

function BlogHeader(props: BlogHeaderProps) {
  
  return (
    <StyledBlogHeader>
      <HeaderLayout notHome={true}/>
    </StyledBlogHeader>
  )
};

export default BlogHeader;

const StyledBlogHeader = styled.div`
`;
