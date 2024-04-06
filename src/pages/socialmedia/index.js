import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
// import Table from "../../components/table";
import "./style.css";
import { useEffect } from "react";
import {
  editProduct,
  edit_input,
  deleteSocialMedia,
  selectSocialMedia,
  setItem_s
} from "./functions";
import lodash from "lodash/lodash";
import { AiOutlinePlus } from "react-icons/ai";
import Form from "../../components/form";
import { Icon } from "@iconify/react";
import { Loader } from "rsuite";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, Col, Table } from "antd";
import { useSelector } from "react-redux";

const SocialMedia = () => {
  const language = useSelector((state) => state.language.lang);
  const [item, setitem] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const [editloading, seteditloading] = useState(false);
  const [orderData, setorderData] = useState({});
  const [searchTxt, setSearchTxt] = useState("");
  useEffect(() => {
    setItem_s(item);
  }, [item]);
  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);

  useEffect(() => {
    selectSocialMedia({ setBody, query, setpageloading });
  }, []);

  const [showEditForm, setShowEditForm] = useState(false);
  const [removeModel, setRemoveModel] = useState(false);
  const [changeloading, setchangeloading] = useState({
    id: null,
    loading: false
  });
  const closeModels = () => {
    setShowEditForm(false);
    setRemoveModel(false);
  };
  const [showedit, setshowedit] = useState(false);
  const [showadd, setshowadd] = useState(false);
  const [addloading, setaddloading] = useState(false);
  const [addeddata, setaddeddata] = useState({
    name: "",
    link: "",
    image: "",
    name_ar: ""
  });
  const [image, setimage] = useState(null);
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const headers = [
    {
      label: "إسم مواقع التواصل",
      dataIndex: "link",
      type: "link",
      // linkName: "فيسبوك",
      linkNameIndex: "name"
      // link:"www.facebook.com"
    },
    {
      label: "شعار موقع التواصل",
      dataIndex: "image",
      type: "img"
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
          }
        },
        {
          label: "حذف",
          action: ({ item }) => {
            setRemoveModel(true);
            setitem(item);
            setItem_s({ item });
            setShowEditForm(false);
          },
          class: "btn-danger"
        }
      ]
    }
  ];
  const [imageloading, setimageloading] = useState(false);
  const [socials, setsocials] = useState([]);

  const getSocials = () => {
    axios
      .post("https://api.manjam.shop/v3/site/social_media/getAll?type=admin")
      .then((res) => {
        // console.log(res.data);
        if (Array.isArray(res.data.message)) {
          setsocials(res.data.message);
          setgetdataOriginal(res.data.message);
        }
      });
  };

  const handleadd = () => {
    setaddloading(true);
    const data_send = {
      ...addeddata
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/site/social_media/add", data_send)
      .then((res) => {
        // console.log(res.data);
        if (res.data.status == 1) {
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error("Something went error");
        }
      })
      .finally(() => {
        setaddloading(false);
        setshowadd(false);
      });
  };

  const handleupdateimg = () => {
    setimageloading(true);
    const formdata = new FormData();
    formdata.append("image", image);
    axios
      .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
      .then((res) => {
        // console.log(res)
        if (res.data.imgUrl != "") {
          toast.success("has uploaded");
          setaddeddata({ ...addeddata, image: res.data.imgUrl });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
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
          setorderData({ ...orderData, image: res.data.imgUrl });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
      });
  };

  const handleedit = () => {
    seteditloading(true);
    const data_send = {
      name_ar: orderData.name_ar,
      image: orderData.image,
      link: orderData.link,
      social_media_id: orderData.id
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/site/social_media/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getSocials();
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error("Something went error");
        }
      })
      .finally(() => {
        seteditloading(false);
        setshowedit(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getSocials();
  }, []);

  const columns = [
    {
      title: language == "ar" ? "*" : "Id",
      dataIndex: "id"
    },
    {
      title: language == "ar" ? "صوره وسيلة التواصل" : "social image",
      render: (_, record) => {
        return (
          <a href={record.link} target="_blank">
            <img src={record.image} alt={record.image} />
          </a>
        );
      }
    },
    {
      title: language == "ar" ? "الاسم بالانجليزيه" : "English Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: language == "ar" ? "الاسم بالعربيه" : "Arabic Name",
      dataIndex: "name_ar",
      key: "name_ar"
    },
    {
      title: language == "ar" ? "الحاله" : "status",
      key: "hidden",
      render: (_, record) => {
        return (
          <p
            style={{ width: "fit-content", margin: "auto", padding: "3px" }}
            className={record.hidden == 0 ? "status show" : "status hidden"}
          >
            {record.hidden == 0 ? "Show" : "Hidden"}
          </p>
        );
      }
    },
    {
      title: language == "ar" ? "أوامر" : "action",
      key: "action",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              rowGap: "4px"
            }}
          >
            <img
              onClick={() => {
                setshowedit(true);
                setorderData(record);
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/edit.png")}
              alt=""
            />
            {changeloading.id == record.id ? (
              <Loader />
            ) : (
              <img
                onClick={() => {
                  setchangeloading({
                    id: record.id,
                    loading: true
                  });
                  const data_send = {
                    status: record.hidden == 0 ? 1 : 0,
                    social_media_id: record.id
                  };
                  // console.log(data_send)
                  axios
                    .post(
                      "https://api.manjam.shop/v3/site/social_media/updateHidden",
                      data_send
                    )
                    .then((res) => {
                      if (res.data.status == 1) {
                        getSocials();
                        toast.success(res.data.message);
                      } else if (res.data.status == 0) {
                        toast.error(res.data.message);
                      } else {
                        toast.error("Something went error");
                      }
                    })
                    .finally(() => {
                      setchangeloading({
                        id: null,
                        loading: false
                      });
                    });
                }}
                style={{ width: "30px", cursor: "pointer" }}
                src={require("../../assets/images/chnage.png")}
                alt=""
              />
            )}
          </div>
        );
      }
    }
    // deliveryAddress
  ];

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setsocials(filteredData);
  }
  const contains = (items, query) => {
    const { name, name_ar, id } = items;
    if (
      name?.toLowerCase().includes(query) ||
      name_ar?.toLowerCase().includes(query) ||
      id == query
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
              head={language == "ar" ? "مواقع التواصل" : "Social media"}
            />
            {
              // <Ratios statics={statics} />
              // <Filter />
              // <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} />
            }
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h3>{language == "ar" ? "إضافه" : "Add"}</h3>
              <AiOutlinePlus
                onClick={() => {
                  setshowadd(true);
                }}
                style={{
                  fontSize: "22px",
                  cursor: "pointer"
                }}
              />
            </div>
            <input
              type="text"
              placeholder={
                language == "ar"
                  ? "بحث فى مواقع التواصل"
                  : "Search In Social Media"
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
                dataSource={socials}
                classess={["table-pc"]}
              />
            )}
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
                item.account_id,
                () => selectSocialMedia({ setBody, query, setpageloading }),
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
          حذف موقع التواصل !
          <p style={{ color: "red" }}>هل أنت متأكد من حذف موقع التواصل ؟</p>
          <form
            id="order-status-form"
            onSubmit={(e) => {
              deleteSocialMedia(
                e,
                item.account_id,
                () => selectSocialMedia({ setBody, query, setpageloading }),
                { closeModels }
              );
            }}
          >
            <button type="submit">حذف</button>
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
              {language == "ar" ? "صور وسائل التواصل" : "Social Image"}
            </label>
            <div className="updiv">
              <input
                onChange={(e) => {
                  setimage(e.target.files[0]);
                }}
                type="file"
              />
              {imageloading ? (
                <Icon
                  className={language == "ar" ? "rtl" : "ltr"}
                  icon="eos-icons:loading"
                />
              ) : (
                <button
                  onClick={() => {
                    handleupdateimg();
                  }}
                >
                  {language == "ar" ? "رفع الصورة" : "Upload Image"}
                </button>
              )}
            </div>
            <label htmlFor="">
              {language == "ar" ? "الإسم بالإنجليزيه" : "English Name"}
            </label>
            <input
              onChange={(e) => {
                setaddeddata({ ...addeddata, name: e.target.value });
              }}
              type="text"
            />
            <label htmlFor="">
              {language == "ar" ? "الإسم بالعربيه" : "Arabic Name"}
            </label>
            <input
              onChange={(e) => {
                setaddeddata({ ...addeddata, name_ar: e.target.value });
              }}
              type="text"
            />
            <label htmlFor="">
              {language == "ar" ? "لينك الموقع" : "Link"}
            </label>
            <input
              onChange={(e) => {
                setaddeddata({ ...addeddata, link: e.target.value });
              }}
              type="text"
            />
            {addloading ? (
              <div
                style={{
                  textAlign: "center"
                }}
              >
                <Loader />
              </div>
            ) : (
              <button type="submit">
                {language == "ar" ? "إضافه" : "Add"}
              </button>
            )}
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
            }}
            className="from_Shipping"
            action=""
          >
            <div className="updiv">
              <input
                onChange={(e) => {
                  setimage(e.target.files[0]);
                }}
                type="file"
              />
              {imageloading ? (
                <Icon
                  className={language == "ar" ? "rtl" : "ltr"}
                  icon="eos-icons:loading"
                />
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
            <label htmlFor="">
              {language == "ar" ? "الاسم بالإنجليزيه" : "English Name"}
            </label>
            <input
              onChange={(e) => {
                setorderData({ ...orderData, name: e.target.value });
              }}
              type="text"
              value={orderData.name}
            />
            <label htmlFor="">
              {language == "ar" ? "الإسم بالعربيه" : "Arabic Name"}
            </label>
            <input
              onChange={(e) => {
                setorderData({ ...orderData, name_ar: e.target.value });
              }}
              type="text"
              value={orderData.name_ar}
            />
            <label htmlFor="">
              {language == "ar" ? "لينك الموقع" : "Link"}
            </label>
            <input
              onChange={(e) => {
                setorderData({ ...orderData, link: e.target.value });
              }}
              type="text"
              value={orderData.link}
            />
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
    </div>
  );
};

export default SocialMedia;
