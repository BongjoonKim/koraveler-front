import styled from "styled-components";
import {Image} from "@chakra-ui/react";
import moment from "moment";

export interface SimpleViewerProps extends DocumentDTO{
};

function SimpleDocViewer(props: SimpleViewerProps) {
  console.log("블로그 하나", props)
  return (
    <StyledSimpleViewer>
      <div className={"header"}>
        {props.thumbnailImgUrl
          ? (
            <div
              className={"thumbnail"}
            >
              <Image
                className={"img"}
              />
            </div>
          ) : (
            <div
              className={"colorImg"}
            >
              <div
                className={"img"}
              />
            </div>
          )
        }
      </div>
      <div className="body">
        <div className="body-top">
          <span className={"title"}>
            {props.title}
          </span>
          <span className={"desc"}>
            {props.contents}
          </span>
        </div>
        <div className="body-bottom">
          <h6>
            {moment(props.created).format("YYYY-MM-DD")}
          </h6>
        </div>
      </div>
    </StyledSimpleViewer>
  )
};

export default SimpleDocViewer;

const StyledSimpleViewer = styled.div`
  width: 20rem;
  height: 20rem;
  display: flex;
  flex-direction: column;
  border-radius: 1rem 1rem;
  
  .header {
    height: 100%;
  }
  .body {
    height: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background: snow;
    .body-top {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      .title{
        font-size: 1.5rem;
        font-weight: 600;
      }
      .desc {
        height: 100%;
      }
    }
    .body-bottom {
      height: 2rem;
    }
  }
`;
