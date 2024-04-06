import { ToastContainer } from "react-toastify";
import "./App.css";
import RouteComponent from "./routes/index";
import "react-toastify/dist/ReactToastify.css";
import { checkLoggin } from "./pages/login/functions";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "rsuite/dist/rsuite.min.css"; // or 'rsuite/dist/rsuite.min.css'
import { useSelector } from "react-redux";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import Login from "./pages/login";
import { useEffect } from "react";
import axios from "axios";
const getLocalStorage = localStorage.getItem("authenticatedUser");
export let userData = getLocalStorage
  ? JSON.parse(getLocalStorage)
    ? JSON.parse(getLocalStorage)
    : JSON.parse(getLocalStorage)[0]
    ? JSON.parse(getLocalStorage)[0]?.id
      ? JSON.parse(getLocalStorage)
      : null
    : null
  : null;
function App() {
  const language = useSelector((state) => state.language.lang);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData]);

  useEffect(() => {
    axios
      .post("https://api.manjam.shop/v3/user/getInfo", {
        id: userData ? (userData[0] ? userData[0]?.id : null) : null,
        type: "admin",
      })
      .then((res) => {
        if (!res.data.status) {
          localStorage.removeItem("authenticatedUser");
          userData = null;
          navigate("/login");
        }
      });
  }, [userData]);

  return (
    <div className={language == "ar" ? "App rtl" : "App ltr"}>
      {!userData && !userData?.length ? (
        <Routes>
          <Route path="Login" element={<Login />} />
        </Routes>
      ) : (
        <RouteComponent />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
