import React, { useEffect, useState } from "react";
import apiKeys from "./apikeys"; // Ensure this exports your API key

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

            <ul>
                {forecastData.map((day) => (
                    <li key={day.date}>
                        <h3>{day.date}</h3>
                        <p>Condition: {day.day.condition.text}</p>
                        <p>Max Temp: {day.day.maxtemp_c}°C</p>
                        <p>Min Temp: {day.day.mintemp_c}°C</p>
                        <p>Humidity: {day.day.avghumidity}%</p>
                        <img src={day.day.condition.icon} alt={day.day.condition.text} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeeklyForecast;
