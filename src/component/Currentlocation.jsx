import React, { useEffect, useState } from "react";
import apikeys from "./apikeys"; // Ensure apikeys has { key: "your_api_key", base: "https://api.weatherapi.com/v1/current" }
import Forecast from "./Forecast";
import loader from "/images/WeatherIcons.gif"; // Adjust the path if necessary

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
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [errorMessage, setErrorMessage] = useState(null);
    const [weatherData, setWeatherData] = useState({
        temperatureC: null,
        city: null,
        country: null,
        main: null,
    });

    // Get the user's current position using the browser's geolocation
    const getPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000, // Increased timeout to 10 seconds
                maximumAge: 0,
            });
        });
    };

    // Fetch weather data from WeatherAPI based on latitude and longitude
    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `${apikeys.base}/current.json?key=${apikeys.key}&q=${latitude},${longitude}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            setWeatherData({
                temperatureC: Math.round(data.current.temp_c),
                city: data.location.name,
                country: data.location.country,
                main: data.current.condition.text,
            });
            setLocation({ lat: latitude, lon: longitude });
        } catch (error) {
            setErrorMessage("Failed to fetch weather data.");
            console.error("Error fetching weather data:", error);
        }
    };

    useEffect(() => {
        const getLocationAndFetchWeather = async () => {
            if (navigator.geolocation) {
                try {
                    const position = await getPosition();
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                } catch (error) {
                    console.error("Error getting location:", error);
                    // Fallback to a default location
                    setErrorMessage("Location services are disabled. Using fallback location.");
                    fetchWeather(44.24, 18.22); // Fallback to Bosnia and Herzegovina
                }
            } else {
                setErrorMessage("Geolocation not available.");
            }
        };

        getLocationAndFetchWeather();

        // Refresh weather data every 10 minutes
        const timerID = setInterval(() => {
            if (location.lat && location.lon) {
                fetchWeather(location.lat, location.lon);
            }
        }, 600000); // 600,000 ms = 10 minutes

        return () => clearInterval(timerID); // Cleanup interval on component unmount
    }, [location.lat, location.lon]);

    // Update the current time every second
    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 1000); // 1000 ms = 1 second

        return () => clearInterval(timeInterval); // Cleanup interval on component unmount
    }, []);

    // Display error message if any
    if (errorMessage) {
        return <h3 style={{ color: "red" }}>{errorMessage}</h3>;
    }

    // Display weather data if available
    if (weatherData.temperatureC !== null) {
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
    }

    // Display loader while fetching weather data
    return (
        <>
            <img src={loader} style={{ width: "50%", WebkitUserDrag: "none" }} alt="Loading" />
            <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
                Detecting your location...
            </h3>
            <h3 style={{ color: "white", marginTop: "10px" }}>
                Your current location will be displayed on the App <br />
                & used for calculating real-time weather.
            </h3>
        </>
    );
};

export default Weather;
