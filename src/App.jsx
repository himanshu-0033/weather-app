import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSunrise,
  WiSunset,
} from 'react-icons/wi';
import { MdVisibility } from 'react-icons/md';
import SearchBar from './components/SearchBar';
import WeatherBackground from './components/WeatherBackground';
import TempGraph from './components/TempGraph';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import './index.css';

function toTime(ts, tz) {
  const d = new Date((ts + tz) * 1000);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
}

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('metric');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'YOUR_API_KEY_HERE';

  const fetchWeather = async (city) => {
    const base = 'https://api.openweathermap.org/data/2.5';
    const geoBase = 'https://api.openweathermap.org/geo/1.0';

    try {
      setError('');
      setIsLoading(true);

      // Step 1: Use Geocoding API to find the city (handles smaller cities better)
      const geoRes = await axios.get(
        `${geoBase}/direct?q=${encodeURIComponent(city)}&limit=5&appid=${API_KEY}`
      );

      if (!geoRes.data || geoRes.data.length === 0) {
        setError(
          `No results for "${city}". Check the spelling and try again.`
        );
        setWeatherData(null);
        setForecastData(null);
        return;
      }

      const { lat, lon } = geoRes.data[0];

      // Step 2: Fetch weather & forecast by coordinates (more accurate)
      const params = `lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${base}/weather?${params}`),
        axios.get(`${base}/forecast?${params}`),
      ]);
      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError(
          'API key not working yet. New keys take up to 2 hours to activate.'
        );
      } else {
        setError('Could not fetch weather data. Try again later.');
      }
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weather directly by coordinates (for GPS / Use My Location)
  const lastCoords = useRef(null);

  const fetchByCoords = async (lat, lon) => {
    const base = 'https://api.openweathermap.org/data/2.5';
    try {
      setError('');
      setIsLoading(true);
      lastCoords.current = { lat, lon };
      const params = `lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`;
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`${base}/weather?${params}`),
        axios.get(`${base}/forecast?${params}`),
      ]);
      setWeatherData(currentRes.data);
      setForecastData(forecastRes.data);
    } catch (err) {
      setError('Could not fetch weather data. Try again later.');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Use browser GPS
  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setError('');
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchByCoords(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        setError('Location access denied. Please allow location or search by city name.');
        setIsLoading(false);
      }
    );
  };

  // Re-fetch when unit changes
  useEffect(() => {
    if (lastCoords.current) {
      fetchByCoords(lastCoords.current.lat, lastCoords.current.lon);
    } else if (weatherData) {
      fetchWeather(weatherData.name);
    }
  }, [unit]);

  const condition = weatherData?.weather?.[0]?.main || '';
  const deg = unit === 'metric' ? '°C' : '°F';
  const ws = unit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className="app">
      {/* Animated full-screen background */}
      <WeatherBackground condition={condition} />

      {/* Content overlay */}
      <div className="app-content">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-left">
            <span className="logo">☁️ Weather Explorer</span>
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

        {/* Main content */}
        <main className="main">
          <SearchBar onSearch={(city) => { lastCoords.current = null; fetchWeather(city); }} onLocate={handleLocate} isLoading={isLoading} />

          {/* Error */}
          {error && (
            <div className="error-box">
              <p>{error}</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="loader">
              <div className="loader-dot" />
              <div className="loader-dot" />
              <div className="loader-dot" />
            </div>
          )}

          {/* Weather Dashboard */}
          {!isLoading && weatherData && (
            <>
              {/* ---- Hero Section ---- */}
              <div className="hero">
                <h1 className="hero-city">
                  {weatherData.name}, {weatherData.sys.country}
                </h1>
                <p className="hero-desc">
                  {weatherData.weather[0].description}
                </p>
                <p className="hero-range">
                  {Math.round(weatherData.main.temp_min)}~
                  {Math.round(weatherData.main.temp_max)}
                  {deg} &nbsp; Feels like{' '}
                  {Math.round(weatherData.main.feels_like)}
                  {deg}
                </p>
                <div className="hero-temp">
                  <span className="hero-temp-value">
                    {Math.round(weatherData.main.temp)}
                  </span>
                  <span className="hero-temp-unit">{deg}</span>
                </div>
              </div>

              {/* ---- Temperature Graph ---- */}
              {forecastData && (
                <TempGraph hourlyData={forecastData.list} unit={unit} />
              )}

              {/* ---- Hourly Forecast ---- */}
              {forecastData && (
                <HourlyForecast
                  data={forecastData.list}
                  unit={unit}
                  timezone={weatherData.timezone}
                />
              )}

              {/* ---- Stats Card ---- */}
              <div className="stats-card">
                <div className="stats-grid">
                  <div className="stat-item">
                    <WiHumidity className="stat-icon" />
                    <div>
                      <p className="stat-val">{weatherData.main.humidity}%</p>
                      <p className="stat-label">Humidity</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <WiStrongWind className="stat-icon" />
                    <div>
                      <p className="stat-val">
                        {weatherData.wind.speed} {ws}
                      </p>
                      <p className="stat-label">Wind</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <WiBarometer className="stat-icon" />
                    <div>
                      <p className="stat-val">
                        {weatherData.main.pressure} hPa
                      </p>
                      <p className="stat-label">Pressure</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <MdVisibility className="stat-icon" />
                    <div>
                      <p className="stat-val">
                        {(weatherData.visibility / 1000).toFixed(1)} km
                      </p>
                      <p className="stat-label">Visibility</p>
                    </div>
                  </div>
                </div>

                <div className="sun-row">
                  <div className="sun-block">
                    <WiSunrise className="sun-ic" />
                    <div>
                      <p className="sun-label">Sunrise</p>
                      <p className="sun-val">
                        {toTime(
                          weatherData.sys.sunrise,
                          weatherData.timezone
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="sun-block">
                    <WiSunset className="sun-ic" />
                    <div>
                      <p className="sun-label">Sunset</p>
                      <p className="sun-val">
                        {toTime(
                          weatherData.sys.sunset,
                          weatherData.timezone
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---- Daily Forecast ---- */}
              {forecastData && (
                <DailyForecast
                  data={forecastData.list}
                  unit={unit}
                  timezone={weatherData.timezone}
                />
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && !weatherData && !error && (
            <div className="empty-state">
              <div className="empty-icon">🌤️</div>
              <p>Search for a city to explore the weather</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="footer">
          <span>
            Data from{' '}
            <a
              href="https://openweathermap.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              OpenWeatherMap
            </a>
          </span>
        </footer>
      </div>
    </div>
  );
}

export default App;
