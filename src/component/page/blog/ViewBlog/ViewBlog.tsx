import styled from "styled-components";
import ViewDocLayout from "../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout";
import useViewBlog from "./useViewBlog";
import {lazy, Suspense} from "react";

const ViewerDoc = lazy(() => import("../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewerDoc"));


export interface ViewBlogProps {

};

function ViewBlog(props: ViewBlogProps) {
  const {document} = useViewBlog(props);
  return (
    <StyledViewBlog>
      <Suspense>
        <ViewDocLayout {...document}>
          <ViewerDoc
            contents={document.contents}
          />
        </ViewDocLayout>
      </Suspense>


    </StyledViewBlog>
  )
};

export default ViewBlog;

const StyledViewBlog = styled.div`

`;
