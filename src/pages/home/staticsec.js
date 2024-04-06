import React from "react";

function Staticsec({ name, number, percentage }) {
  return (
    <div className="Staticsec">
      <span className="Staticsecname">{name ? name : "عدد المنتجات"}</span>
      <div className="staticsecstatic">
        <div className="rate_s">{percentage ? percentage + "%" : 0 + "%"}</div>
        <div className="number_s">{number ? number : 0}</div>
      </div>
    </div>
  );
}

export default Staticsec;
