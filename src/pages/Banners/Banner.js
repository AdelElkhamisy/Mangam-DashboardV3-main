import React from "react";
import ContentNav from "../../datanavcontent";
import DefaultLayout from "../../layout/defaultlayout";
import { useSelector } from "react-redux";
import { Card, Col, Table } from "antd";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { Loader } from "rsuite";
import lodash from "lodash/lodash";
const Banner = () => {
  const [banners, setbannser] = useState([]);
  const [pageoading, setpageloading] = useState(true);
  const [showedit, setshowedit] = useState(false);
  const [rowdata, setrowdata] = useState({});
  const [imageloading, setimageloading] = useState(false);
  const language = useSelector((state) => state.language.lang);
  const [addloading, setaddloading] = useState(false);
  const [image, setimage] = useState(null);
  const [searchTxt, setSearchTxt] = useState("");
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: language == "ar" ? "الاسم بالإنجليزيه" : "title In English",
      dataIndex: "title",
      key: "title",
    },
    {
      title: language == "ar" ? "الصوره" : "Image",
      dataIndex: "image",
      render: (_, record) => {
        return (
          <div>
            <img
              style={{ maxWidth: "100%" }}
              src={record.imageLink}
              alt={record.imageLink}
            />
          </div>
        );
      },
    },
    {
      title: language == "ar" ? "الاسم بالعربيه" : "title In Arabic",
      dataIndex: "title_ar",
      key: "title_ar",
    },
    {
      title: language == "ar" ? "النص بالإنجليزيه" : "text In English",
      dataIndex: "text",
      key: "text",
    },
    {
      title: language == "ar" ? "النص بالعربيه" : "text In Arabic",
      dataIndex: "text_ar",
      key: "text_ar",
    },
    {
      title: language == "ar" ? "النص بالعربيه" : "text In Arabic",
      key: "text_ar",
      render: (_, record) => {
        return (
          <p className={record.hidden == 0 ? "status show" : "status hidden"}>
            {record.hidden == 0
              ? language == "ar"
                ? "ظاهر"
                : "Show"
              : language == "ar"
              ? "مختفى"
              : "hidden"}
          </p>
        );
      },
    },
    {
      title: language == "ar" ? "أوامر" : "Actions",
      key: "actions",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              rowGap: "3px",
            }}
          >
            <img
              onClick={() => {
                const data_send = {
                  banner_id: record.id,
                  status: record.hidden == 0 ? 1 : 0,
                };
                axios
                  .post(
                    "https://api.manjam.shop/v3/banner/updateHidden",
                    data_send
                  )
                  .then((res) => {
                    if (res.data.status == 1) {
                      toast.success(res.data.message);
                      getbanners();
                    } else if (res.data.status == 0) {
                      toast.error(res.data.message);
                    } else {
                      toast.error(
                        language == "ar" ? "حدث خطأ ما" : "Something Went Error"
                      );
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              }}
              style={{ cursor: "pointer", width: "25px" }}
              src={require("../../assets/images/chnage.png")}
              alt=""
            />
            <img
              onClick={() => {
                setshowedit(true);
                setrowdata(record);
              }}
              style={{ cursor: "pointer", width: "25px" }}
              src={require("../../assets/images/edit.png")}
              alt=""
            />
          </div>
        );
      },
    },
  ];
  const getbanners = () => {
    axios
      .get("https://api.manjam.shop/v3/banner/getAll?type=admin")
      .then((res) => {
        // console.log(res.data.message)
        if (Array.isArray(res.data.message)) {
          setgetdataOriginal(res.data.message);
          setbannser(res.data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setpageloading(false);
      });
  };

  const handleuploadafteredit = () => {
    setimageloading(true);
    const formdata = new FormData();
    formdata.append("image", image);
    axios
      .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
      .then((res) => {
        // console.log(res)
        if (res.data.imgUrl != "") {
          toast.success("has uploaded");
          setrowdata({ ...rowdata, imageLink: res.data.imgUrl });
          // setorderData({...orderData,image:res.data.imgUrl});
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
      });
  };

  const handleeditbanner = () => {
    setaddloading(true);

    const data_send = {
      banner_id: rowdata.id,
      title: rowdata.title,
      title_ar: rowdata.title_ar,
      text: rowdata.text,
      text_ar: rowdata.text_ar,
      imageLink: rowdata.imageLink,
      link: rowdata.link,
    };
    axios
      .post("https://api.manjam.shop/v3/banner/edit_banner", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getbanners();
          setshowedit(false);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .finally(() => {
        setaddloading(false);
      });
  };

  function searchType(e) {
    const formattedQuery = e.toLowerCase();
    const filteredData = getdataOriginal.filter((item) => {
      return (
        item?.title?.toLowerCase().includes(formattedQuery) ||
        item?.title_ar?.toLowerCase().includes(formattedQuery) ||
        parseInt(item.id) == formattedQuery
      );
    });
    setbannser(filteredData);
  }
  const contains = (items, query) => {
    const { title, title_ar, id } = items;
    if (
      title?.toLowerCase().includes(query) ||
      title_ar?.toLowerCase().includes(query) ||
      id == query
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    getbanners();
  }, []);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={language == "ar" ? "البانرات" : "banners"} />
            <input
              type="text"
              placeholder={
                language == "ar" ? "بحث فى البنرات" : "Search In Banners"
              }
              // value={searchTxt}
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
            {pageoading ? (
              [1, 2, 3].map((x) => (
                <Col xs={24} md={24} lg={24} key={x}>
                  <Card loading minHeight={200} />
                </Col>
              ))
            ) : (
              <Table dataSource={banners} columns={columns} />
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
              handleeditbanner();
            }}
            className="formaddproduct"
          >
            <label htmlFor="">
              {language == "ar" ? "الاسم بالانجليزيه" : "title In English"}
            </label>
            <input
              value={rowdata.title}
              onChange={(e) => {
                setrowdata({ ...rowdata, title: e.target.value });
              }}
              type="text"
              placeholder={
                language == "ar" ? "الإسم بالإنجليزيه" : "title In English"
              }
            />

            <label htmlFor="">
              {language == "ar" ? "الاسم بالعربيه" : "title In Arabic"}
            </label>
            <input
              value={rowdata.title_ar}
              onChange={(e) => {
                setrowdata({ ...rowdata, title_ar: e.target.value });
              }}
              type="text"
              placeholder={
                language == "ar" ? "الإسم بالعربيه" : "title In arabic"
              }
            />

            <label htmlFor="">
              {language == "ar" ? "النص بالإنجليزيه" : "text In English"}
            </label>
            <input
              value={rowdata.text}
              onChange={(e) => {
                setrowdata({ ...rowdata, text: e.target.value });
              }}
              type="text"
              placeholder={
                language == "ar" ? "النص بالإنجليزيه" : "text In English"
              }
            />
            <label htmlFor="">
              {language == "ar" ? "النص بالعربيه" : "text In arabic"}
            </label>
            <input
              value={rowdata.text_ar}
              onChange={(e) => {
                setrowdata({ ...rowdata, text_ar: e.target.value });
              }}
              type="text"
              placeholder={
                language == "ar" ? "النص بالعربيه" : "text In arabic"
              }
            />
            <label htmlFor="">{language == "ar" ? "الصوره" : "image"}</label>
            <div className={language == "ar" ? "updiv rtl" : "updiv"}>
              <input
                onChange={(e) => {
                  setimage(e.target.files[0]);
                }}
                type="file"
              />
              {imageloading ? (
                <Icon icon="eos-icons:loading" />
              ) : (
                <button
                  onClick={() => {
                    handleuploadafteredit();
                  }}
                >
                  {language == "ar" ? "رفع الصورة" : "Upload Image"}
                </button>
              )}
            </div>
            <label htmlFor="">{language == "ar" ? "اللينك" : "Link"}</label>
            <input
              value={rowdata.link}
              onChange={(e) => {
                setrowdata({ ...rowdata, link: e.target.value });
              }}
              type="text"
              placeholder={language == "ar" ? "اللينك" : "Link"}
            />
            <button>
              {addloading ? <Loader /> : language == "ar" ? "تعديل" : "Edit"}
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Banner;
