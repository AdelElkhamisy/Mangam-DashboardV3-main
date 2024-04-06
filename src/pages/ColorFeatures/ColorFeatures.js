import { Table } from "antd";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ContentNav from "../../datanavcontent";
import { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import lodash from "lodash/lodash";
const ColorFeatures = () => {
  const navigate = useNavigate();
  const [showedit, setshowedit] = useState(false);
  const [recorddata, setrecorddata] = useState({});
  const location = useLocation();
  const [searchTxt, setSearchTxt] = useState("");
  const { record } = location.state;
  // console.log("record",record)
  const [showadd, setshowadd] = useState(false);
  const [props, setpros] = useState([]);
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const language = useSelector((state) => state.language.lang);
  const [addobj, setaddobj] = useState({
    label: "",
    label_ar: ""
  });
  const [delitemobj, setdelitemobj] = useState({
    loading: false,
    prop_id: ""
  });
  const [addloading, setaddloading] = useState(false);
  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: language == "ar" ? "إسم الخاصيه بالانجليزيه" : "label In English",
      dataIndex: "label",
      key: "label"
    },
    {
      title: language == "ar" ? "إسم الخاصيه بالعربيه" : "label In Arabic",
      dataIndex: "label_ar",
      key: "label_ar"
    },
    {
      title: language == "ar" ? "قيم الخواص" : "Properties Values",
      key: "values",
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              navigate("/propertyvalues", { state: { record: record } });
            }}
            className="btn btn-primary"
          >
            الخواص
          </button>
        );
      }
    }
    // {
    //   title:language=='ar'?"أوامر":"action",
    //   key:'action',
    //   render:(_,record)=>{
    //     return(
    //       <div style={{
    //         display:'flex',
    //         alignItems:'center',
    //         justifyContent:'space-between',
    //         flexWrap:'wrap',
    //         rowGap:'4px'
    //        }}>
    //         {
    //           (delitemobj.prop_id==record.id&&delitemobj.loading)?(<Loader/>):(
    //             <img
    //           onClick={()=>{
    //             handledeleteprop(record.id)
    //             setdelitemobj({
    //               loading:true,
    //               prop_id:record.id,
    //             });
    //           }}
    //           style={{ cursor:'pointer',width:'25px' }} src={require("../../assets/images/delete.png")} alt="" />
    //           )
    //         }
    //         <img
    //           onClick={()=>{
    //             setshowedit(true)
    //             setrecorddata(record)
    //           }}
    //         style={{ cursor:'pointer',width:'25px' }} src={require("../../assets/images/edit.png")} alt="" />
    //       </div>
    //     )
    //   }
    // },
  ];
  const handledeleteprop = (id) => {
    const data_send = {
      prop_id: id
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color_props/delete", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getcolorfeatrues();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setdelitemobj({
          loading: false,
          prop_id: ""
        });
      });
  };
  const getcolorfeatrues = () => {
    const data_send = {
      color_id: record.id
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/get_value", data_send)
      .then((res) => {
        // console.log(res.data.message);

        if (res?.data?.message == "No props") {
          setpros([]);
          setgetdataOriginal([]);
        } else {
          setpros(res?.data?.message);
          setgetdataOriginal(res?.data?.message);
        }
      });
  };

  const handleaddprop = () => {
    setaddloading(true);
    const data_send = {
      ...addobj,
      color_id: record.id
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/add", data_send)
      .then((res) => {
        // console.log(res);
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getcolorfeatrues();
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

  const handleedit = () => {
    setaddloading(true);
    const data_send = {
      label: recorddata.label,
      label_ar: recorddata.label_ar,
      prop_id: recorddata.id
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color_props/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getcolorfeatrues();
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

  useEffect(() => {
    getcolorfeatrues();
  }, []);

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setpros(filteredData);
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

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav
              head={language == "ar" ? "الخصائص" : "Colors Features"}
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
                language == "ar" ? "بحث فى خصائص اللون" : "Search In Features"
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
                    handleaddprop();
                    setshowadd(false);
                  }}
                  className="from_Shipping"
                  action=""
                >
                  <label htmlFor="">
                    {language == "ar"
                      ? "Label In English"
                      : "إسم الخاصيه بالإنجليزيه"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddobj({ ...addobj, label: e.target.value });
                    }}
                    type="text"
                  />
                  <label htmlFor="">
                    {language == "ar"
                      ? "Label In Arabic"
                      : "إسم الخاصيه بالعربيه"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddobj({ ...addobj, label_ar: e.target.value });
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
                    handleedit();
                    setshowedit(false);
                  }}
                  className="from_Shipping"
                  action=""
                >
                  <label htmlFor="">
                    {language == "ar"
                      ? "Label In English"
                      : "إسم الخاصيه بالإنجليزيه"}
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
                      ? "Label In Arabic"
                      : "إسم الخاصيه بالعربيه"}
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

export default ColorFeatures;
