import { WiHumidity, WiStrongWind, WiBarometer, WiSunrise, WiSunset } from 'react-icons/wi';
import { MdVisibility } from 'react-icons/md';

function WeatherCard({ data, unit }) {
  const { name, sys, main, weather, wind, visibility } = data;
  const w = weather[0];
  const icon = `https://openweathermap.org/img/wn/${w.icon}@4x.png`;
  const deg = unit === 'metric' ? '°C' : '°F';
  const ws = unit === 'metric' ? 'm/s' : 'mph';

  const toTime = (ts, tz) => {
    const d = new Date((ts + tz) * 1000);
    const h = d.getUTCHours();
    const m = d.getUTCMinutes().toString().padStart(2, '0');
    return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="card">
      <div className="card-top">
        <div>
          <h2 className="card-city">{name}, {sys.country}</h2>
          <p className="card-desc">{w.description}</p>
        </div>
        <img className="card-icon" src={icon} alt={w.description} />
      </div>

      <div className="card-temp-row">
        <span className="card-temp">{Math.round(main.temp)}{deg}</span>
        <div className="card-temp-extra">
          <span>Feels like {Math.round(main.feels_like)}{deg}</span>
          <span>H: {Math.round(main.temp_max)}{deg}  L: {Math.round(main.temp_min)}{deg}</span>
        </div>
      </div>

      <div className="card-grid">
        <div className="card-stat">
          <WiHumidity className="stat-icon" />
          <div>
            <p className="stat-val">{main.humidity}%</p>
            <p className="stat-label">Humidity</p>
          </div>
        </div>
        <div className="card-stat">
          <WiStrongWind className="stat-icon" />
          <div>
            <p className="stat-val">{wind.speed} {ws}</p>
            <p className="stat-label">Wind</p>
          </div>
        </div>
        <div className="card-stat">
          <WiBarometer className="stat-icon" />
          <div>
            <p className="stat-val">{main.pressure} hPa</p>
            <p className="stat-label">Pressure</p>
          </div>
        </div>
        <div className="card-stat">
          <MdVisibility className="stat-icon" />
          <div>
            <p className="stat-val">{(visibility / 1000).toFixed(1)} km</p>
            <p className="stat-label">Visibility</p>
          </div>
        </div>
      </div>

      <div className="card-sun-row">
        <div className="sun-block">
          <WiSunrise className="sun-ic" />
          <div>
            <p className="sun-label">Sunrise</p>
            <p className="sun-val">{toTime(sys.sunrise, data.timezone)}</p>
          </div>
        </div>
        <div className="sun-block">
          <WiSunset className="sun-ic" />
          <div>
            <p className="sun-label">Sunset</p>
            <p className="sun-val">{toTime(sys.sunset, data.timezone)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
