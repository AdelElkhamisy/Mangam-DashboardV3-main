import React from "react";
import ProfileMenu from "./profile-menu";
import "./style.css";
import { Icon } from "@iconify/react";
function Header({ active, setActive }) {
  const authenticatedUser = JSON?.parse(localStorage.getItem("authenticatedUser"));
  return (
    <header>
      <div className="list-toggle" onClick={() => setActive(!active)}>
        <Icon icon="line-md:list-3-twotone" />
      </div>
      <ProfileMenu userData={authenticatedUser} />
    </header>
  );
}

export default Header;
