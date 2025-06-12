import { useState } from "react";
import "../styles/index.css";
import "../styles/SearchForm.css"; // Specific styles for SearchForm

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="search-form-group">
        <input
          type="text"
          placeholder="Search by city, ZIP, or keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </div>
    </form>
  );
}

export default SearchForm;
