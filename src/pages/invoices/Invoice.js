import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { getInvoice } from "./functions";
import OrderModel from "../Order_History/orderModel";
import { useReactToPrint } from "react-to-print";

const Invoice = ({ inv }) => {
  const [loading, setLoading] = useState(false);
  const [showOrderData, setShowOrderData] = useState(false);
  // const handlePrint = useReactToPrint({
  //   content: () => document.querySelector(".printable"),
  //   onBeforeGetContent: () => {
  //     alert("we get Content now");
  //   },
  // });
  return (
    <div className="invoice">
      {showOrderData ? (
        <OrderModel
          data={inv}
          items={inv.orderItems}
          closeModel={() => {
            setShowOrderData(false);
          }}
          
        />
      ) : null}
      <img src={require("../../assets/images/invoice.png")} alt="" />
      <h6>رقم الفاتورة : {inv.order_id}</h6>
      {!loading ? (
        <div className="invoice_actions">
          <div
            className="print"
            onClick={() => {
              setShowOrderData(true);
            }}
          >
            <Icon icon="ion:print-outline" />
            <span>طباعه</span>
          </div>
        </div>
      ) : (
        "سيبدأ التحميل قريبا"
      )}
    </div>
  );
};

export default Invoice;
