import styled from "styled-components";
import {Image} from "@chakra-ui/react";
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {S3URLInDocument} from "../../../../../constants/RegexConstants";
import {useBlogLocale} from "../../../../../hooks/useBlogLocale";

export interface SimpleViewerProps extends DocumentDTO{
  trashMode?: boolean;
  onRestore?: (id: string) => void;
};

// 휴지통 보관 기간(일). 백엔드 BlogCleanupScheduler.RETENTION_DAYS와 동일해야 함.
const TRASH_RETENTION_DAYS = 90;

function SimpleDocViewer(props: SimpleViewerProps) {
  const navigate = useNavigate();
  const { blogViewUrl } = useBlogLocale();

  const daysLeft = props.deletedAt
    ? Math.max(
        0,
        TRASH_RETENTION_DAYS -
          moment().diff(moment(props.deletedAt), 'days')
      )
    : null;

  return (
    <StyledSimpleViewer
      onClick={() => {
        if (props.trashMode) return;
        navigate(blogViewUrl(props.id!))
      }}
      $trashMode={props.trashMode}
    >
      {props.trashMode && daysLeft !== null && (
        <div className="trash-overlay">
          <span className="countdown">
            {daysLeft > 0 ? `${daysLeft}일 후 영구삭제` : "오늘 영구삭제 예정"}
          </span>
          <button
            type="button"
            className="restore-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (props.id) props.onRestore?.(props.id);
            }}
          >
            복구
          </button>
        </div>
      )}
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
            {props.trashMode && props.deletedAt
              ? `삭제일: ${moment(props.deletedAt).format("YYYY-MM-DD")}`
              : moment(props.updated).format("YYYY-MM-DD")}
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

const StyledSimpleViewer = styled.li<{ $trashMode?: boolean }>`
  cursor: ${({ $trashMode }) => ($trashMode ? "default" : "pointer")};
  width: 100%;
  border-radius: 1rem 1rem;
  box-shadow: 2px 2px #f0f0f0;
  display: flex;
  min-height: 480px;
  height: 20rem;
  flex-flow: column nowrap;
  position: relative;
  opacity: ${({ $trashMode }) => ($trashMode ? 0.85 : 1)};
  &:hover {
  }

  .trash-overlay {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    z-index: 2;

    .countdown {
      background: rgba(220, 38, 38, 0.92);
      color: white;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .restore-btn {
      background: white;
      color: #2563eb;
      border: 1px solid #2563eb;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: #eff6ff;
      }
    }
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
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .desc {
        //height: 100%;
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
