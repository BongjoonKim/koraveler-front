declare interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  city : string;
  time : string;
  temperature : number;
  description: string;
  icon : string;
  windSpeed : number;
  humidity : number;
  sunHours : number;
  wind : string;
}

declare interface ForecastData {
  list: {
    dt: number;
    main: {
      temp: number;
    };
    weather: {
      icon: string;
    }[];
  }[];
}