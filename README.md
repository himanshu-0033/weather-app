# Weather Explorer

A weather dashboard I built with React that goes beyond just showing the temperature. It pulls real-time data from OpenWeatherMap and displays current conditions, an hourly forecast, a 5-day outlook, and a temperature trend graph — all wrapped in a dynamic UI where the entire theme changes based on the weather. If it's raining in London, you'll see animated raindrops falling across a dark blue sky. If it's sunny in Dubai, you get golden sun rays on a bright blue gradient.

I built this to practice working with APIs, component architecture, state management, and CSS animations in React.

---

## What it does

- **Search any city** worldwide and get instant weather data
- **GPS location** — click the location button to get weather for your exact position (works even for small villages)
- **Dynamic themes** — the entire background changes based on weather:
  - ☀️ Clear → blue sky with animated sun rays and floating light particles
  - 🌧️ Rain → dark grey with animated falling raindrops
  - ⛈️ Thunderstorm → deep purple with rain + periodic lightning flashes
  - ❄️ Snow → icy blue with drifting snowflakes
  - ☁️ Cloudy → muted grey with drifting cloud shapes
  - 🌫️ Mist/Fog → soft grey with moving fog layers
- **Temperature trend graph** — smooth SVG curve showing temperature changes over the next 24 hours, with a red-to-green gradient
- **Hourly forecast** — scrollable row showing weather for the next 24 hours with icons, rain probability, and temperatures
- **5-day daily forecast** — shows each day's weather icon, rain chance, and high/low temperatures
- **Detailed stats** — humidity, wind speed, pressure, visibility, sunrise, and sunset times
- **Unit toggle** — switch between Celsius and Fahrenheit anytime
- **Glassmorphism design** — frosted glass cards with backdrop blur over the animated backgrounds
- **Fully responsive** — works on desktop and mobile

---

## Built with

| Technology | Used for |
|---|---|
| **React 19** | Component architecture and state management |
| **Vite** | Fast build tool and dev server |
| **Axios** | HTTP requests to weather APIs |
| **React Icons** | Weather and UI icons (Ionicons + Material Design) |
| **CSS** | Glassmorphism, animations, responsive layout — no frameworks |
| **OpenWeatherMap API** | Current weather, 5-day forecast, and geocoding |

---

## How I structured it

The app has 6 components with a clear data flow:

```
App.jsx (parent — holds all state, fetches data)
  ├── SearchBar.jsx        — search input + GPS location button
  ├── WeatherBackground.jsx — full-screen animated background (rain/snow/sun/etc.)
  ├── TempGraph.jsx         — SVG temperature trend curve
  ├── HourlyForecast.jsx    — horizontal scrolling hourly cards
  └── DailyForecast.jsx     — daily forecast list
```

**State lives in the parent.** App.jsx manages weather data, forecast data, loading state, and errors. Child components receive everything through props — following React's one-way data flow.

**Theme detection** works by reading the `weather[0].main` field from the API response (values like "Rain", "Clear", "Snow") and mapping it to a CSS class that sets the background gradient and triggers the right particle animations.

---

## API Strategy

I use three OpenWeatherMap endpoints (all free tier):

| API | Endpoint | What it gives us |
|---|---|---|
| **Geocoding** | `/geo/1.0/direct` | Converts city names to coordinates (finds smaller cities better) |
| **Current Weather** | `/data/2.5/weather` | Temperature, humidity, wind, description, sunrise/sunset |
| **5-Day Forecast** | `/data/2.5/forecast` | 40 data points (every 3 hours × 5 days) for hourly and daily views |

The geocoding step is important — searching by city name directly often fails for smaller towns. By first converting the name to lat/lon coordinates, then fetching weather by coordinates, even villages show up correctly.

For GPS-based search, the browser's Geolocation API provides coordinates directly, skipping the geocoding step entirely.

---

## How to run it

### 1. Clone the repo

```bash
git clone https://github.com/himanshu-0033/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the root:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

Get a free key from [openweathermap.org](https://openweathermap.org/api) — sign up and go to the API Keys tab. New keys can take up to 2 hours to activate.

### 4. Start the dev server

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

---

## Project structure

```
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx            # Search input + GPS location button
│   │   ├── WeatherBackground.jsx    # Full-screen animated weather background
│   │   ├── WeatherBackground.css    # Animation keyframes for rain, snow, sun, etc.
│   │   ├── TempGraph.jsx            # SVG temperature trend curve
│   │   ├── HourlyForecast.jsx       # Horizontal scrolling hourly forecast
│   │   └── DailyForecast.jsx        # 5-day daily forecast list
│   ├── App.jsx                      # Main component — state, API calls, layout
│   ├── index.css                    # Global styles, glassmorphism, responsive
│   └── main.jsx                     # React entry point
├── .env                             # API key (not committed)
├── .gitignore
├── index.html                       # HTML shell
├── package.json
└── vite.config.js
```

---

## State management

Four pieces of state in App.jsx drive the entire app:

```javascript
const [weatherData, setWeatherData] = useState(null);    // Current weather JSON
const [forecastData, setForecastData] = useState(null);   // 5-day forecast JSON
const [isLoading, setIsLoading] = useState(false);        // Loading indicator
const [error, setError] = useState('');                   // Error messages
```

Plus a `unit` state for toggling Celsius/Fahrenheit, and a `lastCoords` ref that remembers GPS coordinates across re-renders so the unit toggle works correctly for location-based searches.

---

## What I learned building this

- **API composition** — chaining geocoding → weather → forecast calls with `Promise.all` for parallel requests
- **CSS animations at scale** — creating 50+ animated particles (raindrops, snowflakes) with randomized positions, speeds, and delays using inline styles
- **SVG data visualization** — building a temperature graph from scratch using Catmull-Rom to Bézier curve conversion
- **Browser Geolocation API** — requesting GPS coordinates with proper error handling for denied permissions
- **Responsive glassmorphism** — using `backdrop-filter: blur()` with semi-transparent backgrounds that work across different gradient themes
