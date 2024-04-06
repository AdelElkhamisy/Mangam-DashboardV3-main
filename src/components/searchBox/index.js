import React from "react";
import "./index.css";
function SearchBox({ setQuery, placeholder, label }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} id="searchForm">
      <label htmlFor="search">
        {label ? label : placeholder ? placeholder : "ابحث..."}
      </label>
      <input
        type="search"
        id="search"
        name="search"
        placeholder={placeholder ? placeholder : "ابحث..."}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
    </form>
  );
}

export default SearchBox;
