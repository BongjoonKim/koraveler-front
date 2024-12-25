import styled from 'styled-components';
import useCusWeather from "./useCusWeather";
import {round} from "lodash";
import { useEffect, useState } from 'react';

export interface CusWeatherProps {};

function CusWeather(props: CusWeatherProps) {
  const {weatherData} = useCusWeather(props);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  const isDaytime = () => {
    const hours = currentTime.getHours();
    return hours >= 6 && hours < 18;
  };
  
  return (
    <StyledWeatherCard>
      <div className="top">
        <div className="location">
          <h2>{weatherData?.name}</h2>
        </div>
        <div className="time-container">
          <div className="current-time">
            {formatTime(currentTime)}
          </div>
          <div className="day-night-icon">
            {isDaytime() ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="sun-icon">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="moon-icon">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </div>
      
      <div className="middle">
        <div className="weather-icon">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData?.weather?.[0].icon}@2x.png`}
            alt="weather icon"
          />
          <span className="description">
            {weatherData?.weather?.[0]?.description}
          </span>
        </div>
        <div className="temperature">
          <span className="value">
            {round(weatherData?.main?.temp - 273.15, 1)}°
          </span>
        </div>
      </div>
      
      <div className="bottom">
        <div className="info-item">
          <span className="label">Feels like</span>
          <span className="value">
            {round(weatherData?.main?.feels_like - 273.15, 1)}°
          </span>
        </div>
        <div className="divider" />
        <div className="info-item">
          <span className="label">Humidity</span>
          <span className="value">{weatherData?.main?.humidity}%</span>
        </div>
      </div>
    </StyledWeatherCard>
  );
};

export default CusWeather;

const StyledWeatherCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #00B4DB 0%, #0083B0 100%);
  border-radius: 1.25rem;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .top {
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .location {
      h2 {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0;
      }
    }

    .time-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      backdrop-filter: blur(10px);

      .current-time {
        font-size: 1.25rem;
        font-weight: 500;
      }

      .day-night-icon {
        display: flex;
        align-items: center;

        .sun-icon, .moon-icon {
          width: 1.5rem;
          height: 1.5rem;
          color: #FFD700;
          animation: rotate 20s linear infinite;
        }

        .moon-icon {
          color: #F4F4F4;
        }
      }
    }
  }

  .middle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    .weather-icon {
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 80px;
        height: 80px;
        margin-bottom: 0.5rem;
      }

      .description {
        font-size: 1.1rem;
        font-weight: 500;
        text-transform: capitalize;
      }
    }

    .temperature {
      .value {
        font-size: 3.5rem;
        font-weight: 700;
      }
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 1rem;

    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;

      .label {
        font-size: 0.875rem;
        opacity: 0.8;
        margin-bottom: 0.25rem;
      }

      .value {
        font-size: 1.25rem;
        font-weight: 600;
      }
    }

    .divider {
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 1rem;
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;