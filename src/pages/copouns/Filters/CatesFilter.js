import React, { useState } from "react";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

const CatesFilter = ({ items, filter, filterfunction }) => {
  const [catefilteract, setcatefilteract] = useState(false);
  const [filters, setFilter] = useState(filter);
  return (
    <div className="filter_cat">
      <h5>الفئه</h5>
      <h6>الكل</h6>
      <h6 className="choose_filter">
        {!catefilteract ? (
          <MdOutlineKeyboardArrowDown
            style={{ cursor: "pointer" }}
            onClick={() => {
              setcatefilteract(true);
            }}
          />
        ) : (
          <MdOutlineKeyboardArrowUp
            style={{ cursor: "pointer" }}
            onClick={() => {
              setcatefilteract(false);
            }}
          />
        )}
      </h6>
    </div>
  );
};

export default CatesFilter;
