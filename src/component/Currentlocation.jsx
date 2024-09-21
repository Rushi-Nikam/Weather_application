import React, { useEffect, useState } from "react";
import apikeys from "./apikeys"; // Make sure apikeys has { key: "your_api_key", base: "https://api.weatherapi.com/v1/current" }
import Forecast from "./Forecast";
import loader from '/images/WeatherIcons.gif';

// Utility function to format the date
const dateBuilder = (d) => {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December",
    ];
    const days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
    ];

    const day = days[d.getDay()];
    const date = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
};

const Weather = () => {
    const [time, setTime] = useState(new Date());
    const [location, setLocation] = useState({ lat: undefined, lon: undefined });
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [weatherData, setWeatherData] = useState({
        temperatureC: undefined,
        city: undefined,
        country: undefined,
        main: undefined,
    });

    // Get the user's current position using the browser's geolocation
    const getPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        });
    };

    // Fetch weather data from WeatherAPI based on latitude and longitude
    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${apikeys.key}&q=${latitude},${longitude}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setWeatherData({
                temperatureC: Math.round(data.current.temp_c),
                city: data.location.name,
                country: data.location.country,
                main: data.current.condition.text,  // e.g., "Sunny", "Cloudy", etc.
            });
            setLocation({ lat: latitude, lon: longitude });
        } catch (error) {
            setErrorMessage("Failed to fetch weather data.");
            console.error("Error fetching weather data:", error);
        }
    };

    useEffect(() => {
        if (navigator.geolocation) {
            getPosition()
                .then((position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                })
                .catch((error) => {
                    console.error("Error getting location:", error);
                    // Fallback to a default location
                    fetchWeather(44.24, 18.22); // Default to Bosnia and Herzegovina
                    alert("Location services are disabled.");
                });
        } else {
            alert("Geolocation not available");
        }

        const timerID = setInterval(() => {
            if (location.lat && location.lon) {
                fetchWeather(location.lat, location.lon);
            }
        }, 600000); // Refresh every 10 minutes

        return () => clearInterval(timerID);
    }, [location.lat, location.lon]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 1000); // Update time every second

        return () => clearInterval(timeInterval);
    }, []);

    if (errorMessage) {
        return <h3 style={{ color: "red" }}>{errorMessage}</h3>;
    }

    if (weatherData.temperatureC !== undefined) {
        return (
            <>
                <div className="city">
                    <div className="title">
                        <h2>{weatherData.city}</h2>
                        <h3>{weatherData.country}</h3>
                    </div>
                    <div className="date-time">
                        <div className="dmy">
                            <div className="current-time">
                                {time.toLocaleTimeString()}
                            </div>
                            <div className="current-date">{dateBuilder(new Date())}</div>
                        </div>
                        <div className="temperature">
                            <p>
                                {weatherData.temperatureC}°<span>C</span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* Pass the weather main type to the Forecast component */}
                <Forecast weatherType={weatherData.main} />
            </>
        );
    } else {
        return (
            <>
                <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="Loading" />
                <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
                    Detecting your location
                </h3>
                <h3 style={{ color: "white", marginTop: "10px" }}>
                    Your current location will be displayed on the App <br />
                    & used for calculating real-time weather.
                </h3>
            </>
        );
    }
};

export default Weather;
