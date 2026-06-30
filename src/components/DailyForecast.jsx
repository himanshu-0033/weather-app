function DailyForecast({ data, unit, timezone }) {
  if (!data || data.length === 0) return null;

  // Group forecast entries by calendar day
  const dayMap = {};
  data.forEach((item) => {
    const d = new Date((item.dt + timezone) * 1000);
    const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    if (!dayMap[key]) {
      dayMap[key] = { items: [], dateObj: d };
    }
    dayMap[key].items.push(item);
  });

  const dayEntries = Object.values(dayMap).slice(0, 5);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="daily-section">
      {dayEntries.map(({ items, dateObj }, i) => {
        const temps = items.map((it) => it.main.temp);
        const low = Math.round(Math.min(...temps));
        const high = Math.round(Math.max(...temps));

        // Pick the midday icon for best representation
        const midItem = items[Math.floor(items.length / 2)];
        const iconCode = midItem.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        const maxPop = Math.round(
          Math.max(...items.map((it) => it.pop || 0)) * 100
        );

        const label =
          i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[dateObj.getUTCDay()];

        const dateStr = `${String(dateObj.getUTCMonth() + 1).padStart(2, '0')}/${String(dateObj.getUTCDate()).padStart(2, '0')}`;

        return (
          <div key={i} className="daily-item">
            <div className="daily-left">
              <span className="daily-date">{dateStr}</span>
              <span className="daily-day">{label}</span>
            </div>
            <div className="daily-mid">
              <img className="daily-icon" src={iconUrl} alt="" />
              {maxPop > 0 && <span className="daily-pop">💧{maxPop}%</span>}
            </div>
            <div className="daily-temps">
              <span className="daily-low">{low}°</span>
              <span className="daily-high">{high}°</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DailyForecast;
