import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Table from "../../components/table";
import "./style.css";
import { useEffect } from "react";
import {
  editProduct,
  edit_input,
  deleteSlider,
  selectSlider,
  setItem_s,
  add_input,
  add_codes,
} from "./functions";
import Form from "../../components/form";
import { Icon } from "@iconify/react";
import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const Slider = () => {
  const [item, setitem] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  if (!location.state) {
    navigate("/products");
  }
  const p_item = location.state;

  useEffect(() => {
    setItem_s(item);
  }, [item]);
  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);

  useEffect(() => {
    selectSlider(p_item, { setBody });
  }, []);

  const [removeModel, setRemoveModel] = useState(false);
  const [addModel, setAddModel] = useState(false);
  const closeModels = () => {
    setRemoveModel(false);
    setAddModel(false)
  };

  const headers = [
    {
      label: "رقم الكود",
      dataIndex: "code_id",
    },
    {
      label: "الكود",
      dataIndex: "code",
    },
    {
      label: "رقم المنتج",
      dataIndex: "item_id",
    },
    {
      label: "حالة الكود",
      type: "children",
      children: ({ headers, row }) => (
        <div>
          {row.used > 0 ? (
            <span className="used">مستخدم</span>
          ) : (
            <span className="notUsed">غير مستخدم</span>
          )}
        </div>
      ),
    },
    {
      label: "أوامر",
      type: "actions",
      actions: [
        {
          label: "حذف",
          action: ({ item }) => {
            setRemoveModel(true);
            setitem(item);
          },
          class: "btn-danger",
        },
      ],
    },
  ];
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={"الأكواد"} />

            <button onClick={() => setAddModel(true)} className="btn btn-success" style={{marginTop:"14px"}}> إضافة أكواد </button>
            <Table headers={headers} body={body} classess={["table-pc"]} />
          </div>
        }
      />

      {removeModel ? (
        <div className="edit_model">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => setRemoveModel(false)}
          >
            <Icon icon="line-md:close-small" />
          </div>
          حذف الكود !<p style={{ color: "red" }}>هل أنت متأكد من حذف الكود ؟</p>
          <form
            id="order-status-form"
            onSubmit={(e) => {
              deleteSlider(
                e,
                item.code_id,
                () => selectSlider(p_item, { setBody }),
                { closeModels }
              );
            }}
          >
            <button className="btn btn-danger" type="submit">حذف</button>
          </form>
        </div>
      ) : null}
      {addModel ? (
        <div className="edit_model add_model">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => setAddModel(false)}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <Form
            id="order-status-form"
            inputs={add_input}
            submitFunction={(e) => {
              add_codes(e, p_item.id, () => selectSlider(p_item, { setBody }), {
                closeModels,
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default Slider;
