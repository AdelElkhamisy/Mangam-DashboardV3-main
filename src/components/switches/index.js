import { Icon } from "@iconify/react";
import React from "react";
import "./style.css";
import Filter from "./Filter";
import { useSelector } from "react-redux";
function Switches({ filters, switches, setChoice, choice, chooseFunction }) {
  const language = useSelector((state) => state.language.lang);
  return (
    <div className="s_fl">
      <div className="switch">
        <div className="switches_btns">
          {switches.map((item, index) => {
            document.querySelectorAll("#type_1 input").forEach((item) => {
              item.value = "";
            });
            return (
              <button
                key={index}
                className={
                  choice == item.data
                    ? "btn btn-switch active"
                    : "btn btn-switch"
                }
                onClick={() => chooseFunction(setChoice, { choice: item.data })}
              >
                {language=='ar'?item?.label:item?.label_en}
              </button>
            );
          })}
        </div>
      </div>
      {filters ? <Filter /> : null}
    </div>
  );
}

export default Switches;
