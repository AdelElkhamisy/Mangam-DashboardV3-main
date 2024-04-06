import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PrintPage() {
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate("");
  useEffect(() => {
    if (!location.state) {
      navigate("/Invoices");
    } else {
      document.querySelector(".printable_2").innerHTML = location.state;
      window.print();
    }
  }, []);

  window.onafterprint = function () {
    navigate("/Invoices");
  };

  return (
    <div
      className="printable printable_2"
      style={{
        padding: "10px",
      }}
    ></div>
  );
}

export default PrintPage;
