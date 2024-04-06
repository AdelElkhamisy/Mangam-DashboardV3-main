import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Ratios from "./Ratios";
import Filter from "./Filter";
import Table from "../../components/table";
import "./style.css";
import { useEffect } from "react";
import {
  add_offer,
  editCoupon,
  edit_input,
  equdata,
  hideShowCoupon,
  offer_input,
  selectCoupons,
  setItem_s,
} from "./functions";
import Form from "../../components/form";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { getStatic } from "../home/functions";
import SearchBox from "../../components/searchBox";
import { useNavigate } from "react-router-dom";
const Coupons = () => {
  const [show, setshow] = useState(false);
  const [item, setitem] = useState(false);
  const navigate = useNavigate();
  const showofferbox = ({ item }) => {
    setitem(item);
    setshow(true);
    equdata(item);
    offer_input[1].value = item.price;
    offer_input[2].value = item.name;
  };

  const headers = [
    {
      label: "رقم المنتج",
      dataIndex: "id",
    },
    {
      label: "إسم البطاقة",
      dataIndex: "name",
    },
    {
      label: "صورة البطاقة",
      dataIndex: "image",
      type: "img",
    },
    {
      label: "الفئه",
      dataIndex: "category",
    },

    {
      label: "سعر البطاقة",
      dataIndex: "oldPrice",
    },
    {
      label: "سعر البطاقة بعد الخصم",
      dataIndex: "price",
    },
    {
      label: "العدد المتوفر من البطاقات",
      dataIndex: "number_of_pieces",
    },
    {
      label: "نسبة الخصم",
      dataIndex: "discount_ratio",
    },
    {
      label: "حالة البطاقة",
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
          label: "عرض",
          action: ({ item }) => {
            navigate("/codes", { state: item });
          },
          class: "btn-primary",
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
  const [itemHidden, setItemHidden] = useState();

  useEffect(() => {
    setItem_s(item);
    setItemHidden(item?.item_hidden === "yes");
  }, [item]);

  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);
  useEffect(() => {
    selectCoupons({ setBody, query });
  }, [selectCoupons, query]);

  const submitorder = (e) => {
    const handleOffer = {};
    offer_input.forEach((item) => {
      handleOffer[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
    });

    const data_send = {
      item_id: item.id,
      item_old_price: item.price,
      item_new_price: handleOffer.item_new_price,
    };
    axios
      .post(
        "https://roma-cosmetic.com/api/v1/admin/categories_product/add_offer.php",
        JSON.stringify(data_send)
      )
      .then((res) => {
        if (res.data.status == "success") {
          toast.success(res.data.message);
          setshow(true);
        } else if (res.data.status == "error") {
          toast.error(res.data.message);
        } else {
          toast.success("حدث خطأ ما");
        }
      });
  };

  const [showEditForm, setShowEditForm] = useState(false);
  const [removeModel, setRemoveModel] = useState(false);
  const closeModels = () => {
    setShowEditForm(false);
    setRemoveModel(false);
  };
  const [statics, setStatics] = useState(false);
  useEffect(() => {
    getStatic({ setStatics });
  }, []);

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={"البطاقات"} />
            <Ratios statics={statics} />
            <Filter />
            <SearchBox setQuery={setQuery} placeholder={"ابحث ف البطاقات"} />
            <Table headers={headers} body={body} classess={["table-pc"]} />
          </div>
        }
      />
      {show ? (
        <div className="showproductoffer" style={{ cursor: "pointer" }}>
          <span
            onClick={() => {
              setshow(false);
            }}
          >
            <Icon icon={"material-symbols:close"} />
          </span>
          <Form inputs={offer_input} submitFunction={submitorder} />
        </div>
      ) : null}
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
            submitFunction={(e) =>
              editCoupon(e, item.id, () => selectCoupons({ setBody, query }), {
                closeModels,
              })
            }
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
          تحديث حالة المنتج رقم {item.id}
          <p style={{ color: "red" }}>
            الضغط على كلمة إخفاء للإخفاء أو عدم التحديد للإظهار
          </p>
          <form
            id="order-status-form"
            onSubmit={(e) => {
              hideShowCoupon(
                e,
                item.id,
                () => selectCoupons({ setBody, query }),
                { closeModels }
              );
            }}
          >
            <label>
              <input
                type="checkbox"
                name="status"
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

export default Coupons;
