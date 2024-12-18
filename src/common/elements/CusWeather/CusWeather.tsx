import styled from "styled-components";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import useCusWeather from "./useCusWeather";

export interface CusWeatherProps {

};

function CusWeather(props: CusWeatherProps) {
  const {weatherData} = useCusWeather(props);
  console.log("날씨 값", weatherData)
  return (
    <StyledCusWeather>
      <div className="header">
        <h2 className="city">{weatherData?.location?.name}</h2>
      </div>
      <div className="body">
  
      </div>
      <div className="footer">
  
      </div>
    </StyledCusWeather>
  )
};

export default CusWeather;

const StyledCusWeather = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
