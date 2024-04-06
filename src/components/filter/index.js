import React from "react";
import "./index.css";
function DateFilterBox({ setDateFilter, placeholder, label }) {
  return (
    <form onSubmit={(e) => e.preventDefault()} id="filterForm">
      <label htmlFor="filter">
        {label ? label : placeholder ? placeholder : ""}
      </label>
      <input
        type="date"
        id="filter"
        name="dateFilter"
        placeholder={placeholder ? placeholder : ""}
        onChange={(e) => setDateFilter(e.currentTarget.value)}
      />
    </form>
  );
}

export default DateFilterBox;
