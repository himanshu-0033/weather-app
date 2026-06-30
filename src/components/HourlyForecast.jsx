function HourlyForecast({ data, unit, timezone }) {
  if (!data || data.length === 0) return null;

  const hours = data.slice(0, 8);

  const formatHour = (dt, tz, isFirst) => {
    if (isFirst) return 'Now';
    const d = new Date((dt + tz) * 1000);
    const h = d.getUTCHours();
    return `${h.toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="hourly-section">
      <div className="hourly-scroll">
        {hours.map((h, i) => {
          const icon = `https://openweathermap.org/img/wn/${h.weather[0].icon}@2x.png`;
          const pop = Math.round((h.pop || 0) * 100);

          return (
            <div key={h.dt} className="hourly-item">
              <span className="hourly-time">
                {formatHour(h.dt, timezone, i === 0)}
              </span>
              <img className="hourly-icon" src={icon} alt={h.weather[0].main} />
              {pop > 0 && <span className="hourly-pop">💧 {pop}%</span>}
              <span className="hourly-temp">
                {Math.round(h.main.temp)}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;
