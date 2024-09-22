import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apikeys";
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiCloudy } from "weather-icons-react";
import { CiSearch } from "react-icons/ci";

function Forecast({ weatherType }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  const iconMap = {
    "Clear": <WiDaySunny size={112} color="white" />,
    "Rain": <WiRain size={112} color="white" />,
    "Snow": <WiSnow size={112} color="white" />,
    "Thunderstorm": <WiThunderstorm size={112} color="white" />,
    "Cloudy": <WiCloudy size={112} color="white" />,
    "Patchy rain nearby": <WiRain size={112} color="white" />,
  };

  const search = async (city) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKeys.key}&q=${city}`
      );
      setWeather(response.data);
      setQuery("");
      setError(null);
    } catch (err) {
      setError("City not found");
      setWeather(null);
    }
  };

  useEffect(() => {
    search("Pune");
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      search(query);
    }
  };

  return (
    <div className="w-full  h-full">
      <div className="py-4 flex justify-center">
        {weather ? iconMap[weather.current.condition.text] || iconMap["Clear"] : null}
      </div>
      <div className="bg-black bg-opacity-25 p-6 text-white">
        <h3 className="text-2xl font-bold my-2">{weather ? weather.current.condition.text : weatherType}</h3>
        <div className="flex items-center justify-center mb-4 relative z-10">
          <input
            type="text"
            className="border-b border-white bg-transparent text-white p-2 focus:outline-none focus:border-gray-500 placeholder-white"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="bg-white bg-opacity-20 rounded-full h-8 w-8 flex items-center justify-center cursor-pointer" onClick={handleSearch}>
            <CiSearch />
          </div>
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : weather ? (
          <ul className="list-none">
            <li className="flex justify-between">
              <p>
                {weather.location.name}, {weather.location.country}
              </p>
              <img
                className="w-14"
                src={`https:${weather.current.condition.icon}`}
                alt="Weather Icon"
              />
            </li>
            <li className="flex justify-between">
              Temperature <span>{Math.round(weather.current.temp_c)}°C</span>
            </li>
            <li className="flex justify-between">
              Humidity <span>{weather.current.humidity}%</span>
            </li>
            <li className="flex justify-between">
              Visibility <span>{weather.current.vis_km} km</span>
            </li>
            <li className="flex justify-between">
              Wind Speed <span>{Math.round(weather.current.wind_kph)} Km/h</span>
            </li>
          </ul>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Forecast;
