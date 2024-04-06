import React, { useEffect } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import "./style.css";
import ProfuctsStatic from "./profuctsStatic";
// import UsersStatic from "./usersStatic";
import SalesStatic from "./salesStatic";
import { useSelector } from "react-redux";
import axios from "axios";
import ProfuctsStatic2 from "./usersStatic";
function Home() {
  const language = useSelector((state) => state.language.lang);

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs">
            <ContentNav head={language=='ar'?"الرئيسية":"Home"} />
            <div className="staticContainer">
              <ProfuctsStatic/>
              <ProfuctsStatic2/>
              {/* <SalesStatic /> */}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Home;
