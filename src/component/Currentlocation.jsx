import React, { useEffect, useState } from "react";
import apikeys from "./apikeys"; 
import Forecast from "./Forecast";
import loader from '/images/WeatherIcons.gif';

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

    const getPosition = () => {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            });
        });
    };

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
                main: data.current.condition.text,
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
                    fetchWeather(44.24, 18.22); 
                    alert("Location services are disabled.");
                });
        } else {
            alert("Geolocation not available");
        }

        const timerID = setInterval(() => {
            if (location.lat && location.lon) {
                fetchWeather(location.lat, location.lon);
            }
        }, 6000); 

        return () => clearInterval(timerID);
    }, [location.lat, location.lon]);

    useEffect(() => {
        const timeInterval = setInterval(() => {
            setTime(new Date());
        }, 1000); 

        return () => clearInterval(timeInterval);
    }, []);

    if (errorMessage) {
        return <h3 className="text-red-500">{errorMessage}</h3>;
    }

    if (weatherData.temperatureC !== undefined) {
        return (
            <>
                <div className="grid w-full lg:w-[60%] h-full float-left bg-[url('https://cdn.pixabay.com/photo/2020/03/24/11/21/thunder-4963719_1280.jpg')] bg-no-repeat bg-cover min-h-[500px] relative lg:bg-[position:-30px_0]">
                    <div className="absolute top-0 right-0 p-8 text-white font-bold">
                        <h2>{weatherData.city},</h2>
                        <h3>{weatherData.country}</h3>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col items-start lg:items-end">
                        <div className="text-left mb-2">
                            <div className="text-[35px] lg:text-[40px] font-thin mb-2 tracking-wide">
                                {time.toLocaleTimeString()}
                            </div>
                            <div className="text-[18px] font-thin tracking-wide">{dateBuilder(new Date())}</div>
                        </div>
                        <div className="text-[60px] lg:text-[80px] font-thin">
                            {weatherData.temperatureC}°<span className="text-[40px]">C</span>
                        </div>
                    </div>
                </div>
                <Forecast weatherType={weatherData.main} />
            </>
        );
    } else {
        return (
            <>
                <img src={loader} className="w-[50%] mx-auto" alt="Loading" />
                <h3 className="text-white text-lg font-semibold text-center">
                    Detecting your location
                </h3>
                <h3 className="text-white text-center mt-2">
                    Your current location will be displayed on the App <br />
                    & used for calculating real-time weather.
                </h3>
            </>
        );
    }
};

export default Weather;
