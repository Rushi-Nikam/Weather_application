import React, { useEffect, useState } from "react";
import apiKeys from "./apikeys"; // Ensure this exports your API key
import { CiSearch } from "react-icons/ci";

const WeeklyForecast = () => {
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("Pune"); // Default city
    const [currentTempC, setCurrentTempC] = useState(null);
    const [currentTempF, setCurrentTempF] = useState(null);
    const [weatherData, setWeatherData] = useState({
        temperatureC: undefined,
        cities: undefined,
        country: undefined,
        main: undefined,
    });

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
            setCurrentTempC(data.current.temp_c); // Extract the exact temp in Celsius
            setCurrentTempF(data.current.temp_f); // Extract the exact temp in Fahrenheit
            setWeatherData({
                temperatureC: Math.round(data.current.temp_c),
                cities: data.location.name,
                country: data.location.country,
                main: data.current.condition.text,  // e.g., "Sunny", "Cloudy", etc.
            });
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
        return <h3 className="text-red-500">{error}</h3>;
    }

    if (!forecastData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="grid gap-4 mx-4 md:mx-10">
            <h2 className="font-bold text-3xl md:text-5xl mt-10">Weekly Forecast for {weatherData.cities},{weatherData.country}</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex justify-center items-center mb-6">
    <input
        className="text-white border-b-2 border-solid border-white bg-transparent text-[18px] focus:outline-none focus:border-gray-500 placeholder:text-gray-400 w-full md:w-64"
        type="text"
        name="city"
        placeholder="Enter city"
        required
    />
    <button type="submit" className="ml-2 w-10 h-10 bg-[rgba(255,255,255,0.2)] rounded-full flex items-center justify-center">
        <CiSearch className="text-white text-2xl" />
    </button>
</form>
            {/* Display exact temperature */}
            <div className="grid text-lg md:text-xl grid-cols-2 text-white bg-black bg-opacity-73 p-4 rounded-lg w-full md:w-96 m-auto">
                <p>Current Temp (°C): {currentTempC}</p>
                <p>Current Temp (°F): {currentTempF}</p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {forecastData.map((day) => (
                    <li key={day.date} className="p-4 bg-black bg-opacity-73 shadow-lg rounded-xl text-xl">
                        <img
                            src={day.day.condition.icon}
                            alt={day.day.condition.text}
                            className="mx-auto"
                        />
                        <h3 className="font-semibold mb-2">{day.date}</h3>
                        <p className="mb-2">Condition: {day.day.condition.text}</p>
                        <p className="mb-2">Sunrise: {day.astro.sunrise}</p>
                        <p className="mb-2">Sunset: {day.astro.sunset}</p>
                        
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeeklyForecast;
