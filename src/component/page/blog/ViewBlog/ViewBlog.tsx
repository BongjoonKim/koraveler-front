import styled from "styled-components";
import ViewDocLayout from "../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout";
import ViewEditor from "../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewEditor";

export interface ViewBlogProps {

};

function ViewBlog(props: ViewBlogProps) {
  
  return (
    <StyledViewBlog>
        <ViewDocLayout>
            <ViewEditor
            />
        </ViewDocLayout>
    </StyledViewBlog>
  )
};

export default ViewBlog;

const StyledViewBlog = styled.div`

`;
