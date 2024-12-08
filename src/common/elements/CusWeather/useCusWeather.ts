import {CusWeatherProps} from "./CusWeather";
import {useState} from "react";

export default function useCusWeather(props : CusWeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(undefined);
  
  return {
    weatherData
  }
}