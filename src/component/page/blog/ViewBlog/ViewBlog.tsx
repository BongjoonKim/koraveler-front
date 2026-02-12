import styled from "styled-components";
import ViewDocLayout from "../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewDocLayout";
import useViewBlog from "./useViewBlog";
import {lazy, Suspense} from "react";
import {Container} from "@chakra-ui/react";

const ViewerDoc = lazy(() => import("../../../../common/layout/BlogLayout/Documents/ViewDocLayout/ViewerDoc"));


export interface ViewBlogProps {

};

function ViewBlog(props: ViewBlogProps) {
  const {document, isBookmarked} = useViewBlog(props);
  return (
    <Container maxW="7xl" px={{ base: 4, sm: 6, lg: 8 }} py={{ base: 4, sm: 6, lg: 8 }}
    >
      <Suspense>
        <ViewDocLayout {...document} isBookmarked={isBookmarked}>
          <ViewerDoc
            contents={document.contents}
          />
        </ViewDocLayout>
      </Suspense>


    </Container>
  )
};

export default ViewBlog;

const StyledViewBlog = styled.div`

`;
