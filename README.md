# Weather Explorer

A weather app I built using React to practice working with APIs, component architecture, and state management. You can search for any city and it shows the current temperature, humidity, wind speed, and other weather details.

## What it does

- Search any city and get live weather data
- Shows temperature, feels like, high/low, humidity, wind, pressure, visibility
- Sunrise and sunset times for the searched city
- Switch between Celsius and Fahrenheit
- Handles errors like wrong city names or API issues

## Built with

- React (with Vite as the build tool)
- Axios for API requests
- React Icons for the weather/UI icons
- CSS (no framework, just plain CSS)
- OpenWeatherMap API for weather data

## How I structured it

The app has three main components:

- **App.jsx** — this is the parent component. It holds all the state (weather data, loading, errors) and has the function that calls the API. It passes data down to the child components.
- **SearchBar.jsx** — handles the input field and search button. When you submit, it sends the city name back up to App through a callback prop.
- **WeatherCard.jsx** — takes the API response as a prop and displays everything: temperature, description, stats grid, sunrise/sunset.

This follows React's one-way data flow — state lives in the parent, children receive it through props.

## State management

I used three pieces of state in App.jsx:

```
const [weatherData, setWeatherData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState('');
```

- `weatherData` stores the JSON from the API
- `isLoading` controls the loading indicator
- `error` holds any error message to display

There's also a `unit` state for toggling between metric and imperial.

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

Create a `.env` file in the root folder:

```
VITE_WEATHER_API_KEY=your_api_key_here
```

You can get a free key from [openweathermap.org](https://openweathermap.org/api). Go to the API keys tab after signing up.

Note: new keys sometimes take a couple of hours to start working.

### 4. Start the dev server

```bash
npm run dev
```

Opens at `http://localhost:5173/`

## Project structure

```
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx
│   │   └── WeatherCard.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## API

Uses the [OpenWeatherMap Current Weather API](https://openweathermap.org/current).

```
GET https://api.openweathermap.org/data/2.5/weather?q={city}&appid={key}&units=metric
```

