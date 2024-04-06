import React from "react";
import "./style.css";
function Heading({head}) {
  return <h1 className="heading-d">{head ? head : "head"}</h1>;
}

export default Heading;
