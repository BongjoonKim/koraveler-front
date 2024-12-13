import styled from "styled-components";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from 'mdb-react-ui-kit';
import useCusWeather from "./useCusWeather";

export interface CusWeatherProps {

};

function CusWeather(props: CusWeatherProps) {
  const {weatherData} = useCusWeather(props);
  console.log("날씨 값", weatherData)
  return (
    <StyledCusWeather>
      <section className="vh-100" style={{ backgroundColor: '#4B515D' }}>
        <MDBContainer className="h-100 py-5">
          <MDBRow className="justify-content-center align-items-center h-100">
            <MDBCol md="8" lg="6" xl="4">
              <MDBCard style={{ color: '#4B515D', borderRadius: '35px' }}>
                <MDBCardBody className="p-4">
                  <div className="d-flex">
                    <MDBTypography tag="h6" className="flex-grow-1">{weatherData?.city}</MDBTypography>
                    <MDBTypography tag="h6">{weatherData?.current?.observation_time}</MDBTypography>
                  </div>
              
                  <div className="d-flex flex-column text-center mt-5 mb-4">
                    <MDBTypography tag="h6" className="display-4 mb-0 font-weight-bold" style={{ color: '#1C2331' }}>
                      {weatherData?.temperature}°C
                    </MDBTypography>
                    <span className="small" style={{ color: '#868B94' }}>{weatherData?.description}</span>
                  </div>
              
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1" style={{ fontSize: '1rem' }}>
                      <div><i className="fas fa-wind fa-fw" style={{ color: '#868B94' }}></i> <span className="ms-1">{weatherData?.windSpeed} km/h</span></div>
                      <div><i className="fas fa-tint fa-fw" style={{ color: '#868B94' }}></i> <span className="ms-1">{weatherData?.humidity}%</span></div>
                      <div><i className="fas fa-sun fa-fw" style={{ color: '#868B94' }}></i> <span className="ms-1">{weatherData?.sunHours}h</span></div>
                    </div>
                    <div>
                      <img src={weatherData?.icon} width="100px" alt="Weather icon" />
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>
    </StyledCusWeather>
  )
};

export default CusWeather;

const StyledCusWeather = styled.div`

`;
