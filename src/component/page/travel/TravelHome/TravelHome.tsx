import styled from "styled-components";
import {Image} from "@chakra-ui/react";

export interface TravelHomeProps {

};

function TravelHome(props: TravelHomeProps) {
  
  return (
    <StyledTravelHome>
      <Image
        src={"https://haries-img.s3.ap-northeast-2.amazonaws.com/travel/home/seonwoonsa.JPG"}
      />
      {/*<div className="message">*/}
      {/*  고창 선운사*/}
      {/*</div>*/}
    </StyledTravelHome>
  )
};

export default TravelHome;

const StyledTravelHome = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;
    min-width: 600px;
    min-height: 600px;
    object-fit: cover;
  }

  .message {
    position: absolute;
    top: calc(100% - 6.5rem);
    right: 4rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #e6e1e1;
    font-style: italic;
  }
`;
