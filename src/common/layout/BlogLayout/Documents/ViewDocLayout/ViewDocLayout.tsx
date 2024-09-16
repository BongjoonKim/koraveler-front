import styled from "styled-components";
import {ReactNode} from "react";
import moment from "moment";
import CusButton from "../../../../elements/buttons/CusButton";
import useViewDocLayout from "./useViewDocLayout";

export interface ViewDocLayoutProps extends DocumentDTO{
  children ?: ReactNode;
};

function ViewDocLayout(props: ViewDocLayoutProps) {
  const {
    handleDelete,
    handleEdit,
    loginUser
  } = useViewDocLayout(props);
  return (
    <StyledViewDocLayout>
      <div className="title">
        {props.title}
      </div>
      <div className={'middle'}>
        <div className={"middle-left"}>
          <span className={"updated-date"}>
            {moment(props.updated).format("YYYY.MM.DD")}
          </span>
          <span> / </span>
          <span className={"updated-user"}>
            {props.updatedUser}
          </span>
        </div>
        <div className="middle-right">
          {loginUser.userId && (
            <>
              <CusButton
                onClick={handleEdit}
              >
                수정
              </CusButton>
              <CusButton
                onClick={handleDelete}
              >
                삭제
              </CusButton>
            </>
          )}
        </div>
      </div>
      <div className="contents">
        {props.children}
      </div>
    </StyledViewDocLayout>
  )
};

export default ViewDocLayout;

const StyledViewDocLayout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  gap : 1rem;
  .title {
    font-size: 40px;
    font-weight: 600;
  }
  .middle {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
    .middle-left {
      display: flex;
      gap : 1rem;
      font-weight: 500;
    }
    .middle-right {
      display: flex;
      gap : 1rem;
    }
  }
  
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    padding: 5rem;
  }
`;
