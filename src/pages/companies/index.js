import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Table from "../../components/table";
import "./style.css";
import { useEffect } from "react";
import {
  editProduct,
  edit_input,
  deleteCompany,
  selectCompany,
  setItem_s,
} from "./functions";
import Form from "../../components/form";
import { Icon } from "@iconify/react";

const Company = () => {
  const [item, setitem] = useState(false);

  useEffect(() => {
    setItem_s(item);
  }, [item]);
  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);

  useEffect(() => {
    selectCompany({ setBody, query });
  }, []);

  const [showEditForm, setShowEditForm] = useState(false);
  const [removeModel, setRemoveModel] = useState(false);
  const closeModels = () => {
    setShowEditForm(false);
    setRemoveModel(false);
  };

  const headers = [
    {
      label: "إسم الشركة",
      dataIndex: "link",
      type: "link",
      // linkName: "فيسبوك",
      linkNameIndex: "name",
      // link:"www.facebook.com"
    },
    {
      label: "شعار الشركة",
      dataIndex: "image",
      type: "img",
    },
    {
      label: "أوامر",
      type: "actions",
      actions: [
        {
          label: "تعديل",
          action: ({ item }) => {
            setShowEditForm(true);
            setitem(item);
            setItem_s({ item });
            setRemoveModel(false);
          },
        },
        {
          label: "حذف",
          action: ({ item }) => {
            setRemoveModel(true);
            setitem(item);
            setItem_s({ item });
            setShowEditForm(false);
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
            <ContentNav head={"الشركات"} />
            {
              // <Ratios statics={statics} />
              // <Filter />
              // <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} />
            }
            <Table headers={headers} body={body} classess={["table-pc"]} />
          </div>
        }
      />
      {showEditForm ? (
        <div className="showproductoffer">
          <span
            onClick={() => {
              setShowEditForm(false);
              setRemoveModel(false);
            }}
          >
            <Icon icon={"material-symbols:close"} />
          </span>
          <Form
            inputs={edit_input}
            submitFunction={(e) => {
              editProduct(
                e,
                item.company_id,
                () => selectCompany({ setBody, query }),
                { closeModels }
              );
            }}
          />
        </div>
      ) : null}
      {removeModel ? (
        <div className="edit_model">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => setRemoveModel(false)}
          >
            <Icon icon="line-md:close-small" />
          </div>
          حذف الشركة !
          <p style={{ color: "red" }}>هل أنت متأكد من حذف الشركة ؟</p>
  
          <form
            id="order-status-form"
            onSubmit={(e) => {
              deleteCompany(
                e,
                item.company_id,
                () => selectCompany({ setBody, query }),
                { closeModels }
              );
            }}
          >
            <button type="submit">حذف</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Company;
