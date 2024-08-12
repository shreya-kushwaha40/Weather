import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function WeatherApp() {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [favorites, setFavorites] = useState([]);

    const getWeatherData = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=59db6b80c4735a40614797e878fde556&units=metric`
            );
            setWeatherData(response.data);
            getForecastData(city);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const getForecastData = async (cityName) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=59db6b80c4735a40614797e878fde556&units=metric`
            );
            setForecastData(response.data);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleCitySearch = () => {
        if (city) {
            getWeatherData();
        }
    };

    const addToFavorites = () => {
        if (!favorites.includes(city)) {
            setFavorites([...favorites, city]);
        }
    };

    const removeFromFavorites = (cityToRemove) => {
        setFavorites(favorites.filter(favCity => favCity !== cityToRemove));
    };

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favoriteCities'));
        if (storedFavorites) {
            setFavorites(storedFavorites);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favoriteCities', JSON.stringify(favorites));
    }, [favorites]);

    
    const getWeatherIcon = (weather) => {
        switch (weather) {
            case 'Clear':
                return 'wi wi-day-sunny';
            case 'Clouds':
                return 'wi wi-cloudy';
            case 'Rain':
                return 'wi wi-rain';
            default:
                return 'wi wi-day-sunny'; 
        }
    };

    return (
        <div className='weather-app' style={{width:"auto"}}>
            <div className='search-container'>
                <input
                    type='text'
                    placeholder='Search '
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button onClick={handleCitySearch}>Search</button>
                <button onClick={addToFavorites}>Add to Favorites</button>
            </div>
            {weatherData && (
                <div className='weather-details'>
                    <div className='city-info'>
                        <p className='city-name'>{weatherData.name}</p>
                        <p className='city-temp'>
                            <span className='temp-value'>{weatherData.main.temp}</span>°C
                        </p>
                        <i className={`weather-icon ${getWeatherIcon(weatherData.weather[0].main)}`}></i>
                    </div>
                    <div className='humidity-details'>
                        <p>{weatherData.main.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
            )}
            {forecastData && (
                <div className='forecast-details'>
                    <h2>5-Day Forecast</h2>
                    <div className='forecast-container'>
                        {forecastData.list
                            .filter((item, index) => index % 8 === 0) 
                            .map((forecast, index) => (
                                <div key={index} className='forecast-item'>
                                    <p>{new Date(forecast.dt_txt).toLocaleDateString()}</p>
                                    <p>{forecast.main.temp}°C</p>
                                    <i className={`weather-icon ${getWeatherIcon(forecast.weather[0].main)}`}></i>
                                    <p>{forecast.weather[0].description}</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            {favorites.length > 0 && (
                <div className='favorites'>
                    <h3>Favorite Cities</h3>
                    <ul>
                        {favorites.map((favCity, index) => (
                            <li key={index}>
                                {favCity}
                                <button onClick={() => removeFromFavorites(favCity)} className='remo'>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
