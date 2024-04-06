import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Table from "../../components/table";
import "./style.css";
import { useEffect } from "react";
import {
  editProduct,
  edit_input,
  deleteAddresses,
  selectAddresses,
  setItem_s,
} from "./functions";
import Form from "../../components/form";
import { Icon } from "@iconify/react";

const Addresses = () => {
  const [item, setitem] = useState(false);

  const [itemHidden, setItemHidden] = useState();

  useEffect(() => {
    setItem_s(item);
    setItemHidden(item?.category_hidden === "yes");
  }, [item]);

  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);

  useEffect(() => {
    selectAddresses({ setBody, query });
  }, []);

  const [showEditForm, setShowEditForm] = useState(false);
  const [removeModel, setRemoveModel] = useState(false);
  const closeModels = () => {
    setShowEditForm(false);
    setRemoveModel(false);
  };

  const headers = [
    {
      label: "رقم التصنيف",
      dataIndex: "categoryId",
    },
    {
      label: "إسم التصنيف",
      dataIndex: "name",
    },

    {
      label: "شعار التصنيف",
      dataIndex: "image",
      type: "img",
    },
    {
      label: "حالة التصنيف",
      dataIndex: "hidden",
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
          label: "إخفاء / إظهار",
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
            <ContentNav head={"التصنيفات"} />
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
                item.categoryId,
                () => selectAddresses({ setBody, query }),
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
          تحديث حالة المنتج رقم {item.categoryId}
          <p style={{ color: "red" }}>
            الضغط على كلمة إخفاء للإخفاء أو عدم التحديد للإظهار
          </p>
          <form
            id="order-status-form"
            onSubmit={(e) => {
              deleteAddresses(
                e,
                item.categoryId,
                () => selectAddresses({ setBody, query }),
                { closeModels }
              );
            }}
          >
            <label>
              <input
                type="checkbox"
                name="category_hidden"
                value=""
                checked={itemHidden}
                onChange={(event) => setItemHidden(event.target.checked)}
              />
              <span id="canceled">إخفاء</span>
            </label>
            <button type="submit">تحديث</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Addresses;
