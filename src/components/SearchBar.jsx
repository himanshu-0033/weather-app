import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { MdMyLocation } from 'react-icons/md';

function SearchBar({ onSearch, onLocate, isLoading }) {
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
        title="Search"
      >
        <IoSearch />
      </button>
      <button
        id="locate-button"
        type="button"
        className="search-btn locate-btn"
        disabled={isLoading}
        onClick={onLocate}
        title="Use my location"
      >
        <MdMyLocation />
      </button>
    </form>
  );
}

export default SearchBar;
