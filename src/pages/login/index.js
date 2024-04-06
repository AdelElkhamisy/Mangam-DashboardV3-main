import React, { Fragment } from "react";
import Form from "../../components/form";
import "./style.css";
import { Navigate } from "react-router-dom";
import { auth_inputs, checkLoggin, login } from "./functions";

function Login() {

  return (
    <Fragment>
        <div className="authContainer">
          <div className="authFunction">
            <Form
              submitFunction={login}
              inputs={auth_inputs}
            
              buttonLabel={"تسجيل الدخول"}
            />
          </div>
        </div>
     
    </Fragment>
  );
}

export default Login;
