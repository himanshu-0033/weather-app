import { useMemo } from 'react';
import './WeatherBackground.css';

function getTheme(condition) {
  if (!condition) return 'default';
  const c = condition.toLowerCase();
  if (c === 'thunderstorm') return 'thunderstorm';
  if (c === 'drizzle') return 'drizzle';
  if (c === 'rain') return 'rain';
  if (c === 'snow') return 'snow';
  if (c === 'clear') return 'clear';
  if (c === 'clouds') return 'clouds';
  if (
    ['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash', 'squall', 'tornado'].includes(c)
  )
    return 'mist';
  return 'default';
}

function WeatherBackground({ condition }) {
  const theme = getTheme(condition);

  const particles = useMemo(() => {
    switch (theme) {
      /* ---- Rain ---- */
      case 'rain':
      case 'drizzle':
        return Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${14 + Math.random() * 16}px`,
              animationDuration: `${0.45 + Math.random() * 0.45}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.2 + Math.random() * 0.4,
            }}
          />
        ));

      /* ---- Snow ---- */
      case 'snow':
        return Array.from({ length: 60 }, (_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              animationDuration: `${4 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 6}s`,
              opacity: 0.3 + Math.random() * 0.6,
            }}
          />
        ));

      /* ---- Thunderstorm ---- */
      case 'thunderstorm':
        return (
          <>
            {Array.from({ length: 50 }, (_, i) => (
              <div
                key={i}
                className="rain-drop"
                style={{
                  left: `${Math.random() * 100}%`,
                  height: `${16 + Math.random() * 18}px`,
                  animationDuration: `${0.35 + Math.random() * 0.35}s`,
                  animationDelay: `${Math.random() * 1.5}s`,
                  opacity: 0.25 + Math.random() * 0.45,
                }}
              />
            ))}
            <div className="lightning-flash" />
          </>
        );

      /* ---- Clear / Sunny ---- */
      case 'clear':
        return (
          <>
            <div className="sun-glow" />
            <div className="sun-rays-container">
              {Array.from({ length: 14 }, (_, i) => (
                <div
                  key={i}
                  className="sun-ray"
                  style={{ transform: `rotate(${i * (360 / 14)}deg)` }}
                />
              ))}
            </div>
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={`p${i}`}
                className="light-particle"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  bottom: `${Math.random() * 30}%`,
                  width: `${3 + Math.random() * 5}px`,
                  height: `${3 + Math.random() * 5}px`,
                  animationDuration: `${4 + Math.random() * 6}s`,
                  animationDelay: `${Math.random() * 6}s`,
                }}
              />
            ))}
          </>
        );

      /* ---- Clouds ---- */
      case 'clouds':
        return (
          <>
            {[
              { w: 280, h: 90, top: '8%', dur: 28, delay: 0, opacity: 0.12 },
              { w: 220, h: 70, top: '22%', dur: 35, delay: -12, opacity: 0.1 },
              { w: 320, h: 100, top: '38%', dur: 40, delay: -22, opacity: 0.08 },
              { w: 180, h: 60, top: '55%', dur: 32, delay: -8, opacity: 0.1 },
            ].map((c, i) => (
              <div
                key={i}
                className="cloud-shape"
                style={{
                  width: `${c.w}px`,
                  height: `${c.h}px`,
                  top: c.top,
                  background: `rgba(255,255,255,${c.opacity})`,
                  filter: 'blur(18px)',
                  animationDuration: `${c.dur}s`,
                  animationDelay: `${c.delay}s`,
                }}
              />
            ))}
          </>
        );

      /* ---- Mist / Fog ---- */
      case 'mist':
        return (
          <>
            {[
              { top: '15%', h: '25%', dur: 22, delay: 0 },
              { top: '40%', h: '20%', dur: 28, delay: -9 },
              { top: '65%', h: '22%', dur: 34, delay: -18 },
            ].map((f, i) => (
              <div
                key={i}
                className="fog-layer"
                style={{
                  top: f.top,
                  height: f.h,
                  animationDuration: `${f.dur}s`,
                  animationDelay: `${f.delay}s`,
                }}
              />
            ))}
          </>
        );

      default:
        return null;
    }
  }, [theme]);

  return (
    <div className={`weather-bg weather-bg--${theme}`}>
      {particles}
    </div>
  );
}

export { getTheme };
export default WeatherBackground;
