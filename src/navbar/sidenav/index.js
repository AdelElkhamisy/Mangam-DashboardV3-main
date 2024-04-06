import React, { Fragment, useEffect, useState } from "react";
import { SideNavData } from "../sidenav/sidenavdata";
import { NavLink, Navigate } from "react-router-dom";
import "./style.css";
import { checkLoggin } from "../../pages/login/functions";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";
function SideNavbar({ active, setActive }) {
  const [logo, setlogo] = useState("");
  useEffect(() => {
    axios.get("https://api.manjam.shop/v3/site/info/getAll").then((res) => {
      // console.log(res.data)
      if (res.data.status === 1) {
        setlogo(res.data.message[0].logo);
      }
    });
  }, []);
  const language = useSelector((state) => state.language.lang);
  return (
    <Fragment>
      <aside
        className={
          active
            ? `${language == "ar" ? "rtl active" : "active ltr"}`
            : language == "ar"
            ? "rtl"
            : "ltr"
        }
      >
        <div className="list-close" onClick={() => setActive(false)}>
          <Icon icon="line-md:close-small" />
        </div>
        <div className="logo-ic">
          <img
            src={
              "https://res.cloudinary.com/duovxefh6/image/upload/v1694518427/logo_aizulw.png"
            }
            alt={"Manjam Logo"}
          />
        </div>
        <div className="links">
          {SideNavData.map((item, index) => {
            return (
              <NavLink
                to={item.path}
                onClick={() => setActive(false)}
                key={index}
              >
                <img src={item.icon} alt="" />
                {language == "ar" ? (
                  <em>{item.label}</em>
                ) : (
                  <em>{item.label_en}</em>
                )}
              </NavLink>
            );
          })}
        </div>
        <a href="https://www.its.ae" className="logo-ic footerlogo">
          <img
            src={
              "https://www.sedihisham.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbigbang.de7f6c1f.png&w=96&q=75"
            }
            alt={"Big Bang"}
          />
        </a>
      </aside>
    </Fragment>
  );
}

export default SideNavbar;
