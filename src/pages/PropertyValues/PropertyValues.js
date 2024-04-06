import React, { useEffect, useState } from "react";
import "./propertyValues.css";
import { AiOutlinePlus } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import { useSelector } from "react-redux";
import { Table } from "antd";
import axios from "axios";
import { Icon } from "@iconify/react";
import { Loader } from "rsuite";
import { toast } from "react-toastify";
import lodash from "lodash/lodash";
const PropertyValues = () => {
  const location = useLocation();
  const { record } = location.state;
  // console.log(record)
  const [showadd, setshowadd] = useState(false);
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [props, setprops] = useState([]);
  const language = useSelector((state) => state.language.lang);
  const [addloading, setaddloading] = useState(false);
  const [addobj, setaddobj] = useState({
    label: "",
    label_ar: "",
    plus_price: ""
  });
  const [showedit, setshowedit] = useState(false);
  const [recorddata, setrecorddata] = useState({});
  const [rowdataload, setrowdataload] = useState({
    loading: false,
    id: ""
  });
  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: language == "ar" ? "إسم القيمه بالانجليزيه" : "Label In English",
      dataIndex: "label",
      key: "label"
    },
    {
      title: language == "ar" ? "إسم القيمه بالعربيه" : "Label In Arabic",
      dataIndex: "label_ar",
      key: "label_ar"
    }
    // {
    //   title:language=='ar'?"أوامر":"Actions",
    //   key:'action',
    //   render:(_,record)=>{
    //     return(
    //       <div style={{
    //         display:'flex',
    //         alignItems:'center',
    //         justifyContent:'space-between',
    //         flexWrap:'wrap',
    //         rowGap:'4px',
    //         gap:'4px'
    //       }}>
    //         {
    //           (rowdataload.id==record.id&&rowdataload.loading)?(
    //             <Loader/>
    //           ):(
    //             <img onClick={()=>{
    //               handledelete(record.id);
    //               setrecorddata(record)
    //               setrowdataload({
    //                 loading:true,
    //                 id:record.id
    //               })
    //             }} style={{ width:'30px' ,cursor:'pointer'}} src={require("../../assets/images/delete.png")} alt="" />
    //           )
    //         }
    //         <img
    //           onClick={()=>{
    //             setshowedit(true)
    //             setrecorddata(record)
    //           }}
    //         style={{ width:'30px',cursor:'pointer' }} src={require("../../assets/images/edit.png")} alt="" />
    //       </div>
    //     )
    //   }
    // },
  ];
  const handledelete = (id) => {
    const data_send = {
      prop_value_id: id
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/color_props/delete_value", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getvalues();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setrowdataload({
          loading: false,
          id: ""
        });
      });
  };
  const handleaddpropvaleu = () => {
    setaddloading(true);
    const data_send = {
      ...addobj,
      prop_id: record.id
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/add_value", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getvalues();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setaddloading(false);
      });
  };
  const getvalues = () => {
    const data_send = {
      prop_id: record.id
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color_props/get_values", data_send)
      .then((res) => {
        // console.log(res.data.message)
        if (res.data.message == "No props") {
          setprops([]);
        } else {
          setprops(res.data.message);
          setgetdataOriginal(res.data.message);
        }
        // console.log(res.data.message)
      });
  };
  const handleeditvalue = () => {
    setaddloading(true);
    const data_send = {
      label: recorddata.label,
      title_ar: recorddata.label_ar,
      prop_value_id: record.id,
      plus_price: recorddata.plus_price
    };
    console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/color_props/edit_value", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getvalues();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setaddloading(false);
      });
  };

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setprops(filteredData);
  }
  const contains = (items, query) => {
    const { label, label_ar } = items;
    if (
      label?.toLowerCase().includes(query) ||
      label_ar?.toLowerCase().includes(query)
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    getvalues();
  }, []);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav
              head={language == "ar" ? "قيم الخاصيه" : "Property Values"}
            />
            {
              // <Ratios statics={statics} />
              // <Filter />
              // <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} />
            }
            <div
              className="add_item"
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
              />
            </div>
            <input
              type="text"
              placeholder={
                language == "ar"
                  ? "بحث فى قيم الخاصية"
                  : "Search In Property Value"
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
            <Table dataSource={props} columns={columns} />
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
                    handleaddpropvaleu();
                    setshowadd(false);
                  }}
                  className="from_Shipping"
                  action=""
                >
                  <label htmlFor="">
                    {language == "ar"
                      ? "إسم الخاصيه بالإنجليزيه"
                      : "Label In English"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddobj({ ...addobj, label: e.target.value });
                    }}
                    type="text"
                  />
                  <label htmlFor="">
                    {language == "ar"
                      ? "إسم الخاصيه بالعربيه"
                      : " Label In Arabic"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddobj({ ...addobj, label_ar: e.target.value });
                    }}
                    type="text"
                  />
                  <label htmlFor="">
                    {language == "ar" ? "قيمة الزياده" : "Plus value"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddobj({ ...addobj, plus_price: e.target.value });
                    }}
                    type="text"
                  />
                  <button>
                    {language == "ar" ? (
                      addloading ? (
                        <Loader />
                      ) : (
                        "إضافه"
                      )
                    ) : (
                      "Add"
                    )}
                  </button>
                </form>
              </div>
            ) : null}
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
                    // handleaddpropvaleu()
                    handleeditvalue();
                    setshowedit(false);
                  }}
                  className="from_Shipping"
                  action=""
                >
                  <label htmlFor="">
                    {language == "ar"
                      ? "إسم الخاصيه بالإنجليزيه"
                      : "Label In English"}
                  </label>
                  <input
                    value={recorddata.label}
                    onChange={(e) => {
                      setrecorddata({ ...recorddata, label: e.target.value });
                    }}
                    type="text"
                  />
                  <label htmlFor="">
                    {language == "ar"
                      ? "إسم الخاصيه بالعربيه"
                      : " Label In Arabic"}
                  </label>
                  <input
                    value={recorddata.label_ar}
                    onChange={(e) => {
                      setrecorddata({
                        ...recorddata,
                        label_ar: e.target.value
                      });
                    }}
                    type="text"
                  />
                  <label htmlFor="">
                    {language == "ar" ? "قيمة الزياده" : "Plus value"}
                  </label>
                  <input
                    value={recorddata.plus_price}
                    onChange={(e) => {
                      setrecorddata({
                        ...recorddata,
                        plus_price: e.target.value
                      });
                    }}
                    type="text"
                  />
                  <button>
                    {language == "ar" ? (
                      addloading ? (
                        <Loader />
                      ) : (
                        "تعديل"
                      )
                    ) : (
                      "Edit"
                    )}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        }
      />
    </div>
  );
};

export default PropertyValues;
