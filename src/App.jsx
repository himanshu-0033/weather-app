import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import './index.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');

  const fetchWeather = async (city) => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY_HERE';
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${unit}`;

    try {
      setError('');
      setIsLoading(true);
      const response = await axios.get(URL);
      setWeatherData(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError(`No results for "${city}". Check the spelling and try again.`);
      } else if (err.response && err.response.status === 401) {
        setError('API key not working yet. New keys take up to 2 hours to activate.');
      } else {
        setError('Could not fetch weather data. Try again later.');
      }
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (weatherData) {
      fetchWeather(weatherData.name);
    }
  }, [unit]);

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">Weather Explorer</span>
        </div>
        <div className="nav-right">
          <div className="unit-switch">
            <button
              className={unit === 'metric' ? 'active' : ''}
              onClick={() => setUnit('metric')}
            >
              °C
            </button>
            <button
              className={unit === 'imperial' ? 'active' : ''}
              onClick={() => setUnit('imperial')}
            >
              °F
            </button>
          </div>
        </div>
      </nav>

      <main className="main">
        <SearchBar onSearch={fetchWeather} isLoading={isLoading} />

        {error && (
          <div className="error-box">
            <p>{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="loader">
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        )}

        {!isLoading && weatherData && (
          <WeatherCard data={weatherData} unit={unit} />
        )}

        {!isLoading && !weatherData && !error && (
          <div className="empty-state">
            <p>Type a city name to get started.</p>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Data from <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></span>
      </footer>
    </div>
  );
}

export default App;
