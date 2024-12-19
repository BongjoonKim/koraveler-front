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
  return (
    <StyledCusWeather>
      <div className="top">
        <div className="location">
          <h2 className="city">{weatherData?.location?.name}, {weatherData?.location?.country}</h2>
        </div>
      </div>
      <div className="middle1">
        <img src={weatherData?.current?.weather_icons[0]} />
        <span className="degree">{weatherData?.current?.temperature}°C</span>
      </div>
      <div className="bottom">
        <span className="desc">{weatherData?.current?.weather_descriptions[0]} | </span>
        <span className="feelslike">Feels like {weatherData?.current?.feelslike}°C</span>
      </div>
    </StyledCusWeather>
  )
};

export default CusWeather;

const StyledCusWeather = styled.div`
  display: flex;
  flex-direction: column;
  background: #f8e1e1;
  padding: 4px;
  align-items: center;
  justify-content: flex-start;
  width: 16em;
  height: max-content;
  border-radius: 10px 10px;

  .location {
    font-size: 1.5rem;
    display: flex;
    font-weight: 600;
  }

  .middle1 {
    display: flex;
    gap: 0.5em;

    img {
      border-radius: 10px 10px;
    }

    .degree {
      font-size: 3rem;
    }
  }

  .bottom {

  }


`;
