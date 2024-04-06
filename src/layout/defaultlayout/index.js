import React, { useState } from "react";
import SideNavbar from "../../navbar/sidenav";
import Header from "../../navbar/header";
import "./style.css"
function DefaultLayout({ children }) {
  const [active, setActive] = useState(false)
  return (
    <div className="container-m">
      <div className="side">
        <SideNavbar active={active} setActive={setActive}/>
      </div>
      <div className="site-content">
        <Header setActive={setActive} active={active}/>
        <div>{children ? children : null}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
