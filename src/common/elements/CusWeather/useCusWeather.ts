import {CusWeatherProps} from "./CusWeather";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {useRecoilState} from "recoil";
import recoil from "../../../stores/recoil";

export default function useCusWeather(props : CusWeatherProps) {
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useRecoilState(recoil.errMsg);
  
  const getWeatherData = useCallback(async () => {
    const apiKey = process.env["REACT_APP_WEATHERSTACK_KEY"];
    console.log("apiKey", apiKey);
    const weatherUrl = process.env["REACT_APP_WEATHERSTACK_URL"];
    const url = `http://api.weatherstack.com?access_key=${apiKey}&query=Seoul`;
    try {
      const res = await axios.get(url);
      console.log("날짜 결과 값", res);
    } catch (e) {
      setErrorMsg({
        status: "error",
        msg: e?.toString(),
      })
    }
    
  }, [weatherData]);
  
  useEffect(() => {
    getWeatherData();
  }, []);
  
  return {
    weatherData
  }
}