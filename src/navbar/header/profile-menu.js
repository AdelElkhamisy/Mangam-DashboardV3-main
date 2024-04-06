import React, { useEffect, useState } from "react";
import "./style.css";
import { Icon } from "@iconify/react";
import { logOut } from "./functions";
import { useDispatch, useSelector } from "react-redux";
import { updateLanguage } from '../../store/languageReducer';
import { userData } from "../../App";
function ProfileMenu() {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.lang);
  const [openMenu, setOpenMenu] = useState(false);
  const user = userData ? (userData[0] ? userData[0] : {}) : {};
  const updateLaguageData = (lang) => {
    dispatch(updateLanguage(lang));
    // setSelectedLangaued(lang);
    // onClose();
    setOpenMenu(false);
  };

  useEffect(() => {
    document.head.insertAdjacentHTML(
      "beforeend",
      `${
        language == 'ar'
          ? `<style>:*{direction:'rtl'</style>`
          : `<style>:root{direction:'ltr'}</style>`
      }`
    );
  }, [language]);

  return (
    <div className="profileMenu">
      <div className="top_info" onClick={() => setOpenMenu(!openMenu)}>
        <span>
          {!openMenu ? (
            <Icon icon="ei:chevron-down" />
          ) : (
            <Icon icon="ei:chevron-up" />
          )}
        </span>

        <span>{user?.name}</span>
        <span className="imgSpan">
          <img src={user?.avatar} alt="" />
        </span>
      </div>
      {openMenu ? (
        <div className="menu-down">
          <button className="btn btn-success" onClick={() => logOut()}>
            Logout
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              updateLaguageData(language == 'ar' ? 'en' : 'ar');
            }}
          >
            {language != 'ar' ? "العربيه" : "English"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default ProfileMenu;
