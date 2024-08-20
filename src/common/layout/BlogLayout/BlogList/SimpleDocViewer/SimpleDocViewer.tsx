import styled from "styled-components";
import {Image} from "@chakra-ui/react";
import moment from "moment";
import {useNavigate} from "react-router-dom";

export interface SimpleViewerProps extends DocumentDTO{
};

function SimpleDocViewer(props: SimpleViewerProps) {
  const navigate = useNavigate();
  return (
    <StyledSimpleViewer
      onClick={() => {
        navigate(`/blog/view/${props.id}`)
      }}
    >
      <div className={"header"}>
        {props.thumbnailImgUrl
          ? (
            <div
              className={"thumbnail"}
            >
              <Image
                src={props.thumbnailImgUrl}
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
            {moment(props.updated).format("YYYY-MM-DD")}
          </h6>
          <h6>
            {props.updatedUser}
          </h6>
        </div>
      </div>
    </StyledSimpleViewer>
  )
};

export default SimpleDocViewer;

const StyledSimpleViewer = styled.li`
  width: 100%;
  border-radius: 1rem 1rem;
  display: flex;
  min-height: 500px;
  height: 100%;
  flex-flow: column nowrap;
  .header {
    height: 50%;
    .colorImg {
      width: 100%;
      height: 100%;
      .img {
        height: 100%;
      }
    }
    .thumbnail {
  
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }
  }
  .body {
    flex: 1 1;
    height: 50%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background: snow;
    gap: 1rem;
    .body-top {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      gap : 1rem;
      .title{
        height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;
      }
      .desc {
        height: 100%;
      }
    }
    .body-bottom {
      height: 2rem;
      display: flex;
      justify-content: space-between;
    }
  }
`;
