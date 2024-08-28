import styled from "styled-components";
import {Image} from "@chakra-ui/react";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {S3URLInDocument} from "../../../../../constants/RegexConstants";

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
            {props.contents?.replace(S3URLInDocument, '')}
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
  cursor: pointer;
  width: 100%;
  border-radius: 1rem 1rem;
  box-shadow: 2px 2px #f0f0f0;
  display: flex;
  min-height: 500px;
  height: 100%;
  flex-flow: column nowrap;
  &:hover {
  }
  .header {
    height: 50%;

    .colorImg {
      width: 100%;
      height: 100%;
      background: #efefef;
      border-radius: 12px 12px 0 0;

      .img {
        height: 100%;
      }
    }

    .thumbnail {
      height: 100%;
      width: 100%;

      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        border-radius: 12px 12px 0 0;

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
    border-radius: 0 0 12px 12px;

    .body-top {
      flex-grow: 2;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .title {
        height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .desc {
        height: 100%;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        //text-overflow: ellipsis;
        //overflow-wrap: break-word;
        line-height: 1.5;
      }
    }

    .body-bottom {
      height: 2rem;
      display: flex;
      justify-content: space-between;
    }
  }
`;
