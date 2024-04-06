import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Switches from "../../components/switches";
import { choices, chooseDep, getInvoices } from "./functions";
import "./style.css";
import Invoice from "./Invoice";
import Filter from "../../components/switches/Filter";
const Invoices = () => {
  const [choice, setChoice] = useState("cash");
  const [invoices, setInvoices] = useState([]);
  useEffect(() => {
    getInvoices().then((res) => {
      res.data?.message.map((item) => {
        item.totalPrice =
          item?.orderItems && item?.orderItems?.length
            ? item.orderItems.reduce((acc, currentValue) => {
                return acc + parseInt(currentValue.single_price);
              }, 0)
            : 0;
      });
      setInvoices(
        res.data.message.filter((item) => item.payment_type == choice)
      );
    });
  }, [choice]);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="children">
            <ContentNav head={"الفواتير"} />
            <div className="Invoices_filter">
              <div className="Invoices_filter_week">
                <Filter />
              </div>
              <div className="invoices_switech">
                <Switches
                  switches={choices}
                  choice={choice}
                  chooseFunction={chooseDep}
                  setChoice={setChoice}
                />
              </div>
              <div className="invoices">
                {invoices.length ? (
                  invoices.map((item, index) => {
                    return <Invoice inv={item} key={index}/>;
                  })
                ) : (
                  <p>لا يوجد فواتير</p>
                )}
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
};

export default Invoices;
