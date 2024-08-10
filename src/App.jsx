import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

export default function WeatherDashboard() {
    const [location, setLocation] = useState('');
    const [weatherInfo, setWeatherInfo] = useState(null);

    const fetchWeatherInfo = async () => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=0960784da9af7f9808cb25e64b4ec2b3&units=metric`);
            setWeatherInfo(response.data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const handleLocationSearch = () => {
        if (location) {
            fetchWeatherInfo();
        }
    };

    return (
        <div className='sh-dashboard'>
            <div className='sh-search-box'>
                <input
                    type="text"
                    placeholder='Enter city name'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button onClick={handleLocationSearch}>Search</button>
            </div>
            {weatherInfo && (
                <div className='shr-details'>
                    <div className='shr-location-info'>
                        <p className='shr-location-name'>{weatherInfo.name}</p>
                        <p className='shr-temp'><span className='shr-temp-value'>{weatherInfo.main.temp}</span>°C</p>
                    </div>
                    <div className='shr-humidity'>
                        <p>{weatherInfo.main.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
            )}
        </div>
    );
}
