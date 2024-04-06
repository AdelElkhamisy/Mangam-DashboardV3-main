import React, { useState, useEffect } from "react";
import "./style.css";
import { getStatic } from "./functions";
import HeaderStatic from "./headerStatic";
import Staticsec from "./staticsec";

function SalesStatic() {
  const [statics, setStatics] = useState(false);
  useEffect(() => {
    getStatic({ setStatics });
  }, []);
  return (
    <div className="salesStatic static">
      <HeaderStatic
        src={
          "https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689329639/My%20Folder/public/Graph_lwn7qp.svg"
        }
      />
      <div className="stitics_sc">
        <Staticsec name={"المبيعات"} number={statics.sales} />
      </div>
    </div>
  );
}

export default SalesStatic;
