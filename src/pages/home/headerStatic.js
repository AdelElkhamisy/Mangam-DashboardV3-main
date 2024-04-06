import React from "react";
import Filter from "../../components/switches/Filter";

function HeaderStatic({ src,name }) {
  return (
    <div className="HeaderStatic">
      <div className="icon">
        <img src={src ? src : ""} alt="" />
      </div>
      <h4>{name}</h4>
      <Filter />
    </div>
  );
}

export default HeaderStatic;
