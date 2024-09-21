import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apikeys";
import { WiDaySunny, WiRain, WiSnow, WiThunderstorm, WiCloudy } from "weather-icons-react";
import { CiSearch } from "react-icons/ci";
function Forecast({ weatherType }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  // Mapping weather conditions to icons
  const iconMap = {
    "Clear": <WiDaySunny size={112} color="white" />,
    "Rain": <WiRain size={112} color="white" />,
    "Snow": <WiSnow size={112} color="white" />,
    "Thunderstorm": <WiThunderstorm size={112} color="white" />,
    "Cloudy": <WiCloudy size={112} color="white" />,
    "Patchy rain nearby": <WiRain size={112} color="white" />, // Example mapping from your API
    // Add more mappings as needed
  };

  const search = async (city) => {
    try {
      const response = await axios.get(
       `${apiKeys.base}/forecast.json?key=${apiKeys.key}&q=${city}`

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
    search("Pune"); // Default city on component mount
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      search(query);
    }
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        {/* Display the relevant icon based on weather condition */}
        {weather ? iconMap[weather.current.condition.text] || iconMap["Clear"] : null}
      </div>
      <div className="today-weather">
        <h3>{weather ? weather.current.condition.text : weatherType}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="img-box" onClick={handleSearch}>
          <CiSearch />  
          </div>
        </div>

        {error ? (
          <p className="error">{error}</p>
        ) : weather ? (
          <ul>
            <li className="cityHead">
              <p>
                {weather.location.name}, {weather.location.country}
              </p>
              <img
                className="temp"
                src={`https:${weather.current.condition.icon}`}
                alt="Weather Icon"
              />
            </li>
            <li>
              Temperature{" "}
              <span className="temp">
                {Math.round(weather.current.temp_c)}°C 
              </span>
            </li>
            <li>
              Humidity <span className="temp">{weather.current.humidity}%</span>
            </li>
            <li>
              Visibility <span className="temp">{weather.current.vis_km} km</span>
            </li>
            <li>
              Wind Speed{" "}
              <span className="temp">{Math.round(weather.current.wind_kph)} Km/h</span>
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
