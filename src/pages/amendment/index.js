import React, { Fragment, useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import "./style.css";
import Switches from "../../components/switches";
import {
  add_class,
  add_company,
  add_offer,
  choices,
  chooseDep,
  classification_input,
  company_input,
  handlepub,
  offer_input,
  socialWData,
} from "./functions";
import Form from "../../components/form";
import EditLogo from "./editLogo";
import FormTypeTwo from "../../components/formTypeTwo/formTypeTwo";
import { add_contact, contact_input } from "../addition/functions";
function Amendment() {
  const [choice, setChoice] = useState("logo");

  useEffect(() => {
    // console.log(choice);
  }, [choice]);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs">
            <ContentNav head={"تعديل"} />
            <Switches
              switches={choices}
              choice={choice}
              chooseFunction={chooseDep}
              setChoice={setChoice}
            />
            <div className="table-t common-cl">
              {choice == "logo" ? (
                <EditLogo />
              ) : choice == "social" ? (
                <Fragment>
                  <Form inputs={socialWData} submitFunction={handlepub} />
                </Fragment>
              ) : choice == "contact" ? (
                <Form inputs={contact_input} submitFunction={add_contact} />
              ) : choice == "company" ? (
                <Form inputs={company_input} submitFunction={add_company} />
              ) : null}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Amendment;
