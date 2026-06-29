import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';

function SearchBar({ onSearch, isLoading }) {
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        id="city-input"
        type="text"
        className="search-input"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        autoComplete="off"
      />
      <button
        id="search-button"
        type="submit"
        className="search-btn"
        disabled={isLoading || !city.trim()}
      >
        <IoSearch />
      </button>
    </form>
  );
}

export default SearchBar;
