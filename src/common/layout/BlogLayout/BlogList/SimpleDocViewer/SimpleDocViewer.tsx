import styled from "styled-components";
import {Image} from "@chakra-ui/react";
import moment from "moment";

export interface SimpleViewerProps extends DocumentDTO{
};

function SimpleDocViewer(props: SimpleViewerProps) {
  
  return (
    <StyledSimpleViewer>
      <div className={"header-img"}>
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
      <div className="info">
        <div className="info-top">
          <h4>
            {props.title}
          </h4>
          <span>
            {props.contents}
          </span>
        </div>
        <div className="info-bottom">
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

`;
