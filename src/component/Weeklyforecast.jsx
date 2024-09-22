import React, { useEffect, useState } from "react";
import apiKeys from "./apikeys"; // Ensure this exports your API key
import Weather from "./Currentlocation";

const WeeklyForecast = () => {
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("Pune"); // Default city

    const fetchForecast = async (city) => {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/forecast.json?key=${apiKeys.key}&q=${city}&days=7`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setForecastData(data.forecast.forecastday);
        } catch (err) {
            setError("Failed to fetch forecast data.");
            console.error("Error fetching forecast data:", err);
        }
    };

    useEffect(() => {
        fetchForecast(city);
    }, [city]);

    const handleSearch = (e) => {
        e.preventDefault();
        const newCity = e.target.city.value;
        if (newCity.trim()) {
            setCity(newCity.trim());
            e.target.city.value = ""; // Clear input field
        }
    };

    if (error) {
        return <h3 style={{ color: "red" }}>{error}</h3>;
    }

    if (!forecastData) {
        return <p>Loading...</p>;
    }
    
    return (
        <div className="weekly-forecast">
            <h2>Weekly Forecast for {city}</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    required
                />
                <button type="submit">Search</button>
            </form>

            <ul className="data">
               
                {forecastData.map((days) => ( 
                    
                    <li key={days.date}>
                        <h3>{days.date}</h3> 
                        <p>Condition: {days.day.condition.text}</p>
                        <p>Max Temp: {days.day.maxtemp_c}°C</p>
                        <p>Min Temp: {days.day.mintemp_c}°C</p>
                        <p>Humidity: {days.day.avghumidity}%</p>
                        <img src={days.day.condition.icon} alt={days.day.condition.text} />
                    </li>
                ))}
            </ul>
        </div>
    );
    
};

export default WeeklyForecast;
