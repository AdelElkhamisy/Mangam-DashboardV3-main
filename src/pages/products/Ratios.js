import React from "react";
import { RatiosLabels } from "./functions";
import "./style.css";
const Ratios = ({ statics }) => {
  return (
    <div className="ratios_page">
      {RatiosLabels({ statics }).map((item, index) => {
        return (
          <div className="ratio_cat" key={index}>
            <p>{item.label}</p>
            <p>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Ratios;
