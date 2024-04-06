import { Card, Col, Table } from "antd";
import React, { useState } from "react";
import ContentNav from "../../datanavcontent";
import DefaultLayout from "../../layout/defaultlayout";
import { useSelector } from "react-redux";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import "./reasons.css";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import lodash from "lodash/lodash";
const Reasons = () => {
  const language = useSelector((state) => state.language.lang);
  const [showadd, setshowadd] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const [body, setbody] = useState([]);
  const [showedit, setshowedit] = useState(false);
  const [itemedited, setitemedited] = useState({});
  const [itemadded, setitemadded] = useState({
    text: "",
    text_ar: "",
  });
  const [deleteloadig, setdeleteloading] = useState({
    id: null,
    loading: false,
  });
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const [itemid, setitemid] = useState("");
  const [searchTxt, setSearchTxt] = useState("");
  const [addloading, setaddloading] = useState(false);
  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: language == "ar" ? "السبب بالانجليزيه" : "English Arabic",
      dataIndex: "text",
      key: "text",
    },
    {
      title: language == "ar" ? "السبب بالعربيه" : "Arabic Arabic",
      dataIndex: "text_ar",
      key: "text",
    },
    {
      title: language == "ar" ? "أوامر" : "Edit",
      key: "edit",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              rowGap: "4px",
            }}
          >
            <img
              onClick={() => {
                setshowedit(true);
                setitemedited(record);
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/edit.png")}
              alt=""
            />
            {deleteloadig?.id == record.id ? (
              <Loader />
            ) : (
              <img
                onClick={() => {
                  setdeleteloading({
                    id: record.id,
                    loading: true,
                  });
                  handledelete(record.id);
                }}
                style={{ width: "30px", cursor: "pointer" }}
                src={require("../../assets/images/delete.png")}
                alt=""
              />
            )}
          </div>
        );
      },
    },
  ];
  const handledelete = (id) => {
    const data_send = {
      id,
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/reason/delete", data_send)
      .then((res) => {
        // console.log(res)
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getReasons();
          // setshowedit(false);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setpageloading(false);
      });
  };
  const getReasons = () => {
    axios
      .get("https://api.manjam.shop/v3/reason/getAll")
      .then((res) => {
        // console.log(res.data.message)
        // console.log(res.data)
        if (Array.isArray(res.data.message)) {
          setbody(res.data.message);
          setgetdataOriginal(res.data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setpageloading(false);
      })
      .finally(() => {
        setdeleteloading({
          id: null,
          loading: false,
        });
      });
  };
  const handleedit = () => {
    setaddloading(true);
    const data_send = {
      id: itemedited.id,
      text_ar: itemedited.text_ar,
      text: itemedited.text,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/reason/edit", data_send)
      .then((res) => {
        // console.log(res.data);
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getReasons();
          setshowedit(false);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setaddloading(false);
      });
  };
  const handleadd = () => {
    setaddloading(true);
    const data_send = {
      text_ar: itemadded.text_ar,
      text: itemadded.text,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/reason/add", data_send)
      .then((res) => {
        // console.log(res.data);
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getReasons();
          setshowadd(false);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
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
    setbody(filteredData);
  }
  const contains = (items, query) => {
    const { text, text_ar, id } = items;
    if (
      text?.toLowerCase().includes(query) ||
      text_ar?.toLowerCase().includes(query) ||
      id == query
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    getReasons();
  }, []);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={language == "ar" ? "الاسباب" : "Reasons"} />
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
                justifyContent: "space-between",
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
                  ? "بحث فى أسباب الاسترجاع"
                  : "Search In Returns Reasons"
              }
              value={searchTxt}
              style={{
                marginBottom: 8,
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                margin: "10px auto",
                outline: "none",
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
              <Table dataSource={body} columns={columns} />
            )}
          </div>
        }
      />

      {showedit ? (
        <div className="edit_model add_model edit_reson from_Shipping_div from_Shipping_div_edit">
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
              // handleedit();
              // handleaddcolor()
              // setshowadd(false)
            }}
            className="from_Shipping "
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "السبب بالانجليزيه" : "English Reason"}
            </label>
            <input
              onChange={(e) => {
                setitemedited({ ...itemedited, text: e.target.value });
              }}
              type="text"
              value={itemedited.text}
            />
            <label htmlFor="">
              {language == "ar" ? "السبب بالعربيه" : "Arabic Reason"}
            </label>
            <input
              onChange={(e) => {
                setitemedited({ ...itemedited, text_ar: e.target.value });
              }}
              type="text"
              value={itemedited.text_ar}
            />
            <button>
              {addloading ? <Loader /> : language == "ar" ? "تعديل" : "Edit"}
            </button>
          </form>
        </div>
      ) : null}
      {showadd ? (
        <div className="edit_model add_model edit_reson from_Shipping_div from_Shipping_div_edit">
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
              // handleedit();
              // handleaddcolor()
              // setshowadd(false)
            }}
            className="from_Shipping "
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "السبب بالانجليزيه" : "English Reason"}
            </label>
            <input
              onChange={(e) => {
                setitemadded({ ...itemadded, text: e.target.value });
              }}
              type="text"
              value={itemadded.text}
            />
            <label htmlFor="">
              {language == "ar" ? "السبب بالعربيه" : "Arabic Reason"}
            </label>
            <input
              onChange={(e) => {
                setitemadded({ ...itemadded, text_ar: e.target.value });
              }}
              type="text"
              value={itemadded.text_ar}
            />
            <button>
              {addloading ? <Loader /> : language == "ar" ? "إضافه" : "Add"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Reasons;
