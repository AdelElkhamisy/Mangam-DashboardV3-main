import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
// import Table from "../../components/table";
import "./style.css";
import { useEffect } from "react";
import {
  editProduct,
  edit_input,
  deleteCategories,
  selectCategories,
  setItem_s
} from "./functions";
import Form from "../../components/form";
import { Icon } from "@iconify/react";
import { Card, Col, Table } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import lodash from "lodash/lodash";
import { Loader } from "rsuite";
const Categories = () => {
  const [changeloading, setchangeloading] = useState({
    id: null,
    loading: false
  });
  const [item, setitem] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");
  const [itemHidden, setItemHidden] = useState();
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const language = useSelector((state) => state.language.lang);
  // console.log(language)
  useEffect(() => {
    setItem_s(item);
    setItemHidden(item?.category_hidden === "yes");
  }, [item]);
  const [pageloading, setpageloading] = useState(true);
  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);
  const [rowdata, setrowdata] = useState({});

  useEffect(() => {
    selectCategories({ setBody, query, setgetdataOriginal, setpageloading });
  }, []);

  const [showEditForm, setShowEditForm] = useState(false);
  const [removeModel, setRemoveModel] = useState(false);
  const closeModels = () => {
    setShowEditForm(false);
    setRemoveModel(false);
  };

  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id"
    },
    {
      title: language == "ar" ? "الصوره" : "Image",
      type: "img",
      render: (_, record) => {
        return <img src={record.image} alt="" />;
      }
    },
    {
      title: language == "ar" ? "الاسم" : "Name",
      dataIndex: "title"
    },
    {
      title: language == "ar" ? "الاسم بالعربيه" : "Arabic Name",
      dataIndex: "title_ar"
    },

    {
      title: language == "ar" ? "الحاله" : "Status",
      key: "status",
      render: (_, record) => {
        return (
          <p
            style={{ width: "fit-content", padding: "3px", margin: "auto" }}
            className={
              record.hidden == "Show" || record.hidden == "show"
                ? "status show"
                : "status hidden"
            }
          >
            {record.hidden}
          </p>
        );
      }
    },
    {
      title: language == "ar" ? "أمر" : "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              rowGap: "3px"
            }}
          >
            {changeloading.id == record.id ? (
              <Loader />
            ) : (
              <img
                onClick={() => {
                  setchangeloading({
                    id: record.id,
                    loading: true
                  });
                  // console.log(record)
                  const data_send = {
                    category_id: record.id,
                    hidden:
                      record.hidden == "show" || record.hidden == "Show" ? 1 : 0
                  };
                  // console.log(data_send)
                  axios
                    .post(
                      "https://api.manjam.shop/v3/category/updateHidden",
                      data_send
                    )
                    .then((res) => {
                      // console.log(res.data);
                      if (res.data.status == 1) {
                        toast.success(res.data.message);
                        selectCategories({
                          setBody,
                          query,
                          setgetdataOriginal,
                          setpageloading
                        });
                      } else if (res.data.status == 0) {
                        toast.error(res.data.message);
                      } else {
                        toast.error("Something Went Error");
                      }
                    })
                    .catch((err) => console.log(err))
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
            <img
              onClick={() => {
                setShowEditForm(true);
                setrowdata(record);
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/edit.png")}
              alt=""
            />
          </div>
        );
      }
    }
    // {
    //   label: "أوامر",
    //   type: "actions",
    //   actions: [
    //     {
    //       label: "تعديل",
    //       action: ({ item }) => {
    //         setShowEditForm(true);
    //         setitem(item);
    //         setItem_s({ item });
    //         setRemoveModel(false);
    //       },
    //     },
    //     {
    //       label: "إخفاء / إظهار",
    //       action: ({ item }) => {
    //         setRemoveModel(true);
    //         setitem(item);
    //         setItem_s({ item });
    //         setShowEditForm(false);
    //       },
    //       class: "btn-danger",
    //     },
    //   ],
    // },
  ];

  const [image, setimage] = useState(null);
  const [uploadloading, setuploadloading] = useState(false);

  function searchType(e) {
    const formattedQuery = e;
    const originalData = body;
    // console.log(formattedQuery);
    const filteredData = originalData.filter((item) => {
      // console.log(item.id);
      return (
        item?.title?.toLowerCase()?.includes(formattedQuery) ||
        item?.title_ar?.toLowerCase()?.includes(formattedQuery) ||
        item.id == formattedQuery
      );
    });
    if (!formattedQuery || !formattedQuery.length) {
      return selectCategories({
        setBody,
        formattedQuery,
        setgetdataOriginal,
        setpageloading
      });
    }
    setBody(filteredData);
  }
  const contains = (items, query) => {
    const { title, title_ar, id } = items;
    if (
      title?.toLowerCase().includes(query) ||
      title_ar?.toLowerCase().includes(query) ||
      id?.toString().includes(query)
    ) {
      return true;
    }
    return false;
  };

  const handleuploadimage = () => {
    if (image == null) {
      toast.warn("أختر صوره");
      return;
    }
    setuploadloading(true);
    const formData = new FormData();
    formData.append("image", image);
    axios
      .post(
        "https://roma-cosmetic.com/api/v1/admin/home/img_uploader.php",
        formData
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("تم الرفع بنجاح");
          setrowdata({ ...rowdata, image: res.data.message });
        }
      })
      .finally(() => {
        setuploadloading(false);
      })
      .catch((err) => console.log(err));
  };
  const [editloading, seteditloading] = useState(false);

  const handleedit = () => {
    seteditloading(true);
    const data_send = {
      id: rowdata.id,
      title: rowdata.title,
      title_ar: rowdata.title_ar,
      image_url: rowdata.image
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/category/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          setShowEditForm(false);
          selectCategories({
            setBody,
            query,
            setgetdataOriginal,
            setpageloading
          });
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Somethign Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        seteditloading(false);
      });
  };

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={language == "ar" ? "التصنيفات" : "Categories"} />
            {
              // <Ratios statics={statics} />
              // <Filter />
              // <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} />
            }
            <input
              type="text"
              placeholder={
                language == "ar" ? "بحث فى التصنيفات" : "Search In Categories"
              }
              // value={searchTxt}
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
              <Table dataSource={body} columns={columns} />
            )}
            {/* <Table headers={headers} body={body} classess={["table-pc"]} /> */}
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleedit();
            }}
            action=""
            className="from_Shipping"
          >
            <label htmlFor="">
              {language == "ar"
                ? "إسم الفئه بالانجليزيه"
                : "Categoy name in English"}
            </label>
            <input
              type="text"
              value={rowdata.title}
              onChange={(e) => {
                setrowdata({ ...rowdata, title: e.target.value });
              }}
            />
            <label htmlFor="">
              {language == "ar"
                ? "إسم الفئه بالعربيه"
                : "Categoy name in Arabic"}
            </label>
            <input
              type="text"
              onChange={(e) => {
                setrowdata({ ...rowdata, title_ar: e.target.value });
              }}
              value={rowdata.title_ar}
            />
            <label htmlFor="">
              {language == "ar" ? "صورة الفئه" : "Categoy Image"}
            </label>
            <div className="updiv">
              <input
                type="file"
                onChange={(e) => {
                  setimage(e.target.files[0]);
                }}
              />
              {uploadloading ? (
                <Icon icon="eos-icons:loading" />
              ) : (
                <button
                  onClick={() => {
                    handleuploadimage();
                  }}
                >
                  {language == "ar" ? "رفع الصورة" : "Upload Image"}
                </button>
              )}
            </div>
            <button>
              {editloading ? <Loader /> : language == "ar" ? "تعديل" : "Edit"}
            </button>
          </form>
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
              deleteCategories(
                e,
                item.categoryId,
                () =>
                  selectCategories({
                    setBody,
                    query,
                    setgetdataOriginal,
                    setpageloading
                  }),
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

export default Categories;
