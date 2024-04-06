import React from "react";
import Heading from "./heading";
import Data from "./date";

function ContentNav({head}) {
  return (
    <div className="content-nav">
      <Heading head={head}/>
      <Data />
    </div>
  );
}

export default ContentNav;
