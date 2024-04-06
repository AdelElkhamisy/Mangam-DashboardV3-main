import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import DateFilterBox from "../../components/filter";
import SearchBox from "../../components/searchBox";
import { Card, Col, Table } from "antd";
import moment from "moment";
import axios from "axios";
import { Icon } from "@iconify/react";
import "./shipping.css";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import { AiOutlinePlus } from "react-icons/ai";
import { useSelector } from "react-redux";
import lodash from "lodash/lodash";
const Shipping = () => {
  const language = useSelector((state) => state.language.lang);
  const [showedit, setshowedit] = useState(false);
  const [data, setData] = useState([]);
  const [query, setQuery] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [editloading, seteditloading] = useState(false);
  const [orderData, setorderData] = useState({});
  const [searchTxt, setSearchTxt] = useState("");
  const [showadd, setshowadd] = useState(false);
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const [pageloading, setpageloading] = useState(true);
  const columns = [
    {
      title: language == "ar" ? "*" : "Id",
      dataIndex: "id"
    },
    {
      title: language == "ar" ? "الاسم بالانجليزيه" : "title In English",
      dataIndex: "title"
    },
    {
      title: language == "ar" ? "الاسم بالعربيه" : "title In Arabic",
      dataIndex: "title_ar"
    },
    // {
    //   title: language=='ar'?"السعر":"price",
    //   dataIndex: "price",
    //   key:"price"
    // },
    // {
    //   title: language=='ar'?"وقت التوصيل":"Delivery Time",
    //   render:(_,record)=>{
    //     return(
    //       <span>{record.delivery_time} Day</span>
    //     )
    //   }
    // },

    {
      title: language == "ar" ? "تعديل" : "Edit",
      key: "Edit",
      render: (_, record) => {
        return (
          <img
            onClick={() => {
              setshowedit(true);
              setorderData(record);
            }}
            style={{ width: "30px", cursor: "pointer" }}
            src={require("../../assets/images/edit.png")}
            alt=""
          />
        );
      }
    }
    // deliveryAddress
  ];

  const [addeddata, setaddeddata] = useState({
    title: "",
    price: "",
    delivery_time: "",
    title_ar: ""
  });

  const handleedit = () => {
    seteditloading(true);
    const data_send = {
      id: orderData.id,
      title: orderData.title,
      title_ar: orderData.title_ar,
      price: orderData.price,
      delivery_time: orderData.delivery_time
    };
    axios
      .post("https://api.manjam.shop/v3/shipping/edit", data_send)
      .then((res) => {
        // console.log(res.data)
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getshippingdata();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error("Something Went Error");
        }
        // if()
      })
      .catch((err) => console.log(err))
      .finally(() => {
        seteditloading(false);
      });
  };

  const getshippingdata = () => {
    axios
      .post("https://api.manjam.shop/v3/shipping/getAll")
      .then((res) => {
        // console.log(res.data);
        // setData(res.data.message);
        if (res.data.status == 1) {
          if (Array.isArray(res.data.message)) {
            setData(res.data.message);
            setgetdataOriginal(res.data.message);
          }
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setpageloading(false);
      });
  };

  const handleadd = () => {
    seteditloading(true);
    const data_send = {
      ...addeddata
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/shipping/add", data_send)
      .then((res) => {
        // console.log(res)
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getshippingdata();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        seteditloading(false);
        setshowadd(false);
      });
  };

  useEffect(() => {
    getshippingdata();
  }, []);

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setData(filteredData);
  }
  const contains = (items, query) => {
    const { title, title_ar } = items;
    if (
      title?.toLowerCase().includes(query) ||
      title_ar?.toLowerCase().includes(query)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs">
            <ContentNav head={language == "ar" ? "شركة النقل" : "Shipping"} />
            {/* <div className="filteration">
              <DateFilterBox
                setDateFilter={setDateFilter}
                label={"ايجاد الداتا حسب التاريخ"}
              />
              <SearchBox
                setQuery={setQuery}
                placeholder={"ابحث عن عنوان التوصيل"}
              />
            </div> */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h4>{language == "ar" ? "إضافه" : "add"}</h4>
              <AiOutlinePlus
                onClick={() => {
                  setshowadd(true);
                }}
                style={{
                  fontSize: "22px",
                  cursor: "pointer"
                }}
                color="green"
              />
            </div>
            <input
              type="text"
              placeholder={
                language == "ar"
                  ? "بحث فى شركات الشحن"
                  : "Search In Shiping Company"
              }
              value={searchTxt}
              style={{
                marginBottom: 8,
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                margin: "10px auto",
                outline: "none"
              }}
              onChange={(e) => {
                searchType(e.target.value);
              }}
            />
            {pageloading ? (
              [1, 2, 3].map((x) => (
                <Col xs={24} md={24} lg={24} key={x}>
                  <Card loading minHeight={200} />
                </Col>
              ))
            ) : (
              <Table
                columns={columns}
                dataSource={data}
                classess={["table-tc"]}
              />
            )}
          </div>
        }
      />
      {showedit ? (
        <div className="edit_model add_model from_Shipping_div">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setshowedit(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleedit();
              setshowedit(false);
            }}
            className="from_Shipping"
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "الاسم بالانجليزيه" : "Title In English"}
            </label>
            <input
              onChange={(e) => {
                setorderData({ ...orderData, title: e.target.value });
              }}
              type="text"
              value={orderData.title}
            />
            <label htmlFor="">
              {language == "ar" ? "الاسم بالعربى" : "Title In Arabic"}
            </label>
            <input
              onChange={(e) => {
                setorderData({ ...orderData, title_ar: e.target.value });
              }}
              type="text"
              value={orderData.title_ar}
            />
            {/* <label htmlFor="">{language=='ar'?"السعر":"Price"}</label>
                  <input onChange={(e)=>{
                  setorderData({...orderData,price:e.target.value})
                }} type="text" value={orderData.price}/>
                  <label htmlFor="">{language=='ar'?"وقت التوصيل":"delivery time"}</label>
                  <input  onChange={(e)=>{
                  setorderData({...orderData,delivery_time:e.target.value})
                }} type="text" value={orderData.delivery_time}/> */}
            {editloading ? (
              <div
                style={{
                  textAlign: "center"
                }}
              >
                <Loader />
              </div>
            ) : (
              <button type="submit">
                {language == "ar" ? "تعديل" : "Edit"}
              </button>
            )}
          </form>
        </div>
      ) : null}

      {showadd ? (
        <div className="edit_model add_model from_Shipping_div">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setshowadd(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleadd();
            }}
            className="from_Shipping"
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "الاسم بالانجليزيه" : "Title In English"}
            </label>
            <input
              onChange={(e) => {
                setaddeddata({ ...addeddata, title: e.target.value });
              }}
              type="text"
            />
            <label htmlFor="">
              {language == "ar" ? "الاسم بالعربى" : "Title In Arabic"}
            </label>
            <input
              onChange={(e) => {
                setaddeddata({ ...addeddata, title_ar: e.target.value });
              }}
              type="text"
            />
            {/* <label htmlFor="">{language=='ar'?"السعر":"Price"}</label>
                  <input onChange={(e)=>{
                  setaddeddata({...addeddata,price:e.target.value})
                }} type="text" />
                  <label  htmlFor="">{language=='ar'?"وقت التوصيل":"delivery time"}</label>
                  <input  onChange={(e)=>{
                  setaddeddata({...addeddata,delivery_time:e.target.value})
                }} type="text"/> */}
            {editloading ? (
              <div
                style={{
                  textAlign: "center"
                }}
              >
                <Loader />
              </div>
            ) : (
              <button type="submit">{language == "ar" ? "أضف" : "Add"}</button>
            )}
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Shipping;
