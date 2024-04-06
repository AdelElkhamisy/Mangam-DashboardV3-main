import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Ratios from "./Ratios";
import Filter from "./Filter";
// import Table from "../../components/table";
import "./style.css";
import * as XLSX from "xlsx";
import lodash from "lodash/lodash";
import { useEffect } from "react";
import {
  editProduct,
  edit_input,
  equdata,
  hideShowProduct,
  offer_input,
  selectProducts,
  setItem_s
} from "./functions";
import Form from "../../components/form";
import axios from "axios";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";
import { getStatic } from "../home/functions";
import SearchBox from "../../components/searchBox";
import { useNavigate } from "react-router-dom";
import { Card, Col, Table } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
const Products = () => {
  const [pageloading, setpageloading] = useState(true);
  const [reqcheck, setreqcheck] = useState(false);
  const [show, setshow] = useState(false);
  const [item, setitem] = useState(false);
  const [timefilter, settimefilter] = useState("");
  const navigate = useNavigate();
  const [shwoeditedit, setshwoeditedit] = useState(false);
  const [rowdata, setrowdata] = useState({});
  const [filterdate, setfilterdate] = useState("");
  // const [pageloading,setpageloading]=useState(true);
  const showofferbox = ({ item }) => {
    setitem(item);
    setshow(true);
    equdata(item);
    offer_input[1].value = item.price;
    offer_input[2].value = item.name;
  };
  const language = useSelector((state) => state.language.lang);
  const [getdataOriginal, setgetdataOriginal] = useState([]);

  const handlechange = (id) => {
    let allproducts = [...body];
    let pushedproducts = allproducts.map((item) => {
      if (item.id == id) {
        return { ...item, checked: !item.checked };
      } else {
        return { ...item };
      }
    });
    setBody(pushedproducts);
    // console.log(pushedproducts)
  };

  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: language == "ar" ? "اسم المنتج" : "Name",
      dataIndex: "title",
      key: "name"
    },
    {
      title: language == "ar" ? "اسم المنتج بالعربيه" : "Arabic Name",
      dataIndex: "title_ar",
      key: "title_ar"
    },
    {
      title: language == "ar" ? "تاريخ الإنتاج" : "Created At",
      key: "created",
      render: (_, record) => {
        return <span>{moment(record.createdAt).format("YYYY-MM-DD")}</span>;
      }
    },
    {
      title: language == "ar" ? "رقم النموذج" : "Model Number",
      dataIndex: "model_number",
      key: "model_number"
    },
    {
      title: language == "ar" ? "الشركه" : "Company",
      dataIndex: "producing_company",
      key: "producing_company"
    },
    {
      title: language == "ar" ? "الفئه" : "Category",
      dataIndex: "category_name",
      key: "category"
    },
    // {
    //   title: language=='ar'?"لون المنتج":"Product Color",
    //   dataIndex: 'color_title',
    //   key: 'color',
    // },
    {
      title: language == "ar" ? "الالوان" : "Colors",
      key: "colors",
      render: (_, record) => {
        return (
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              listStyle: "none",
              gap: "10px"
            }}
          >
            {record.colors.map((item, index) => {
              return <li>{item.color}</li>;
            })}
          </ul>
        );
      }
    },
    // {
    //   title: language=='ar'?"السعر القديم":"Old Price",
    //   dataIndex: 'price',
    //   key: 'price',
    // },
    // {
    //   title: language=='ar'?"السعر":"Price",
    //   key: 'newprice',
    //   render:(_,record)=>{
    //     return(
    //       Math.floor(record?.price - (record?.price * (record?.discount / 100)))
    //     )
    //   }
    // },
    // {
    //   title: language=='ar'?"متوفر عند":"Avilable After",
    //   key: 'will_av_after',
    //   render:(_,record)=>{
    //     return(
    //       <span>{moment(record.will_av_after).format('YYYY-MM-DD h:m:s')}</span>
    //     )
    //   }
    // },
    // {
    //   title: language=='ar'?"متوفر لوقت":"Avilable For",
    //   key: 'will_av_for',
    //   render:(_,record)=>{
    //     /* record.will_av_for */
    //     return(
    //       <span>{moment(`2023-08-24T${record.will_av_for}.000Z`).format('H:m:s')}</span>
    //     )
    //   }
    // },
    {
      title: language == "ar" ? "الخصائص" : "Properties",
      key: "will_av_for",
      render: (_, record) => {
        /* record.will_av_for */
        return (
          <img
            onClick={() => {
              navigate("/productfeatures", { state: { data: record } });
            }}
            style={{
              cursor: "pointer",
              maxWidth: "100%"
            }}
            src={require("../../assets/images/features.png")}
            alt=""
          />
        );
      }
    },
    {
      title: language == "ar" ? "الحاله" : "Status",
      key: "status",
      render: (_, record) => {
        return (
          <p
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
      title: language == "ar" ? "أوامر" : "Action",
      key: "action",
      render: (_, record) => {
        console.log(record);
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
                // console.log(record)
                const data_send = {
                  id: record.id,
                  status:
                    record.hidden == "show" || record.hidden == "Show" ? 1 : 0
                };
                // console.log(data_send)
                axios
                  .post(
                    "https://api.manjam.shop/v3/product/updateHidden",
                    data_send
                  )
                  .then((res) => {
                    // console.log(res.data);
                    if (res.data.status == 1) {
                      toast.success(res.data.message);
                      selectProducts({
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
                  .catch((err) => console.log(err));
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/chnage.png")}
              alt=""
            />
            <img
              onClick={() => {
                // setshwoeditedit(true)
                setrowdata(record);
                navigate("/editproduct", { state: { record } });
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/edit.png")}
              alt=""
            />
          </div>
        );
      }
    },
    {
      title: language == "ar" ? "تحديد" : "Select",
      render: (_, record) => {
        return (
          <input
            onClick={() => {
              handlechange(record.id);
            }}
            style={{
              width: "20px",
              height: "20px",
              cursor: "pointer"
            }}
            checked={record.checked}
            type="checkbox"
            name=""
            id=""
          />
        );
      }
    }
  ];

  const [itemHidden, setItemHidden] = useState();
  const [searchTxt, setSearchTxt] = useState("");
  useEffect(() => {
    setItem_s(item);
    setItemHidden(item?.item_hidden === "yes");
  }, [item]);

  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);
  useEffect(() => {
    selectProducts({ setBody, query, setgetdataOriginal, setpageloading });
  }, [selectProducts, query]);

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
      item_new_price: handleOffer.item_new_price
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
  const [todate, settodate] = useState("");
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

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setBody(filteredData);
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

  const handleeditproduct = () => {
    const data_send = {
      product_id: rowdata.id,
      category_id: rowdata.category_id,
      description: rowdata.description,
      model_number: rowdata.model_number,
      producing_company: rowdata.producing_company,
      will_av_for: rowdata.will_av_for,
      will_av_after: rowdata.will_av_after,
      conditions: rowdata.conditions,
      description_ar: rowdata.description_ar,
      title_ar: rowdata.title_ar,
      conditions_ar: rowdata.conditions_ar
    };
    console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/product/edit_product")
      .then((res) => {
        console.log(res.data);
        if (res.data.status == 1) {
          toast.success(res.data.message);
          selectProducts({
            setBody,
            query,
            setgetdataOriginal,
            setpageloading
          });
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  //    async function exportFunction(dataWanted) {
  //     var myHeaders = new Headers();
  //     myHeaders.append("Content-Type", "application/json");
  //     myHeaders.append("Authorization", `Bearer ${
  //         localStorage.getItem("token")
  //     }`);

  //     var raw = JSON.stringify({"dataWanted": dataWanted, "path": true});

  //     var requestOptions = {
  //         method: 'POST',
  //         headers: myHeaders,
  //         body: raw,
  //         redirect: 'follow'
  //     };

  //     const data = await fetch("https://graduation-project-way2.vercel.app/data/export?type=admin", requestOptions);
  //     const cases = await data.blob();
  //     const status = data.status;
  //     if (status == 200) {
  //         const file = new File([cases], "cases.xlsx", {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
  //         window.open(URL.createObjectURL(file), '_blank');
  //         return {found: true, message: "success"};
  //     } else if (status == 404) {
  //         return {found: false, message: "Bad Params"}
  //     } else if (status == 401) {
  //         return {found: false, message: "Unauthorized"}
  //     }
  // }

  const exportFunction = () => {
    axios
      .post(
        "https://api.manjam.shop/v3/site/info/export?type=admin&dataName=product"
      )
      .then((res) => {
        console.log(res.data.message);
      });
  };
  const handleexport1 = () => {
    const pp = [];
    body.map((item, index) => {
      if (item.checked === true) {
        let newobj = {
          title: item.title || "",
          title_ar: item.title_ar || "",
          category_name: item.category_name || "",
          category_name_ar: item.category_name_ar || "",
          // phone: item.phone,
          color_title: item.color_title || "",
          conditions: item.conditions || "",
          conditions_ar: item.conditions_ar || "",
          createdAt: moment(item.createdAt).format("L") || "",
          description: item.description || "",
          description_ar: item.description_ar || "",
          grade: item.grade || "",
          hidden: item.hidden || "",
          isReturned: item.isReturned == 1 ? true : false,
          model_number: item.model_number || "",
          price: item.price || "",
          producing_company: item.producing_company || "",
          store: item.store || ""
        };
        for (let i = 0; i < item?.colors.length; i++) {
          newobj[`color${i + 1}`] = item?.colors[i].color || "";
          newobj[`color_ar${i + 1}`] = item?.colors[i].color_ar || "";
          for (let j = 0; j < item?.colors[i].images.length; j++) {
            newobj[`images ${j + 1}`] = item?.colors[i].images[j].link;
            console.log(item?.colors[i].images[j].link);
          }
        }
        pp.push(newobj);
      }
    });
    const ids = pp.join("&&");
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(pp);
    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    XLSX.writeFile(wb, "MyExcel.XLSX");
  };

  const filterfunc = () => {
    console.log(filterdate);
    let alldata = [...getdataOriginal];

    setBody(
      alldata.filter(
        (item) =>
          moment(item.createAt).format("L") >= moment(filterdate).format("L")
      )
    );
  };

  useEffect(() => {
    filterfunc();
  }, [filterdate]);

  useEffect(() => {
    let alldata = [...getdataOriginal];
    if (timefilter == "" && todate == "") {
      setBody(alldata);
    } else if (timefilter == "" && todate !== "") {
      setBody(
        alldata.filter(
          (item) =>
            moment(item.createdAt).format("L") <= moment(todate).format("L")
        )
      );
    } else if (timefilter !== "" && todate == "") {
      setBody(
        alldata.filter(
          (item) =>
            moment(item.createdAt).format("L") >= moment(timefilter).format("L")
        )
      );
    } else if (timefilter !== "" && todate != "") {
      // console.log("eddf")
      setBody(
        alldata.filter(
          (item) =>
            moment(item.createdAt).format("L") >=
              moment(timefilter).format("L") &&
            moment(item.createdAt).format("L") <= moment(todate).format("L")
        )
      );
    }
  }, [timefilter, todate]);

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={language == "ar" ? "المنتجات" : "products"} />
            {/* <Ratios statics={statics} /> */}
            {/* <Filter /> */}
            {/* <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} /> */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <input
                type="text"
                placeholder={
                  language == "ar" ? "بحث فى المنتجات" : "Search In Products"
                }
                value={searchTxt}
                style={{
                  marginBottom: 8,
                  // width:'',
                  flex: 1,
                  // width:'90%',
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
              <button
                onClick={() => {
                  handleexport1();
                }}
                className="btn btn-primary"
              >
                {language == "ar" ? "تصدير" : "Export"}
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px 0px"
              }}
            >
              {/* <div style={{ width:'200px' }}>
                <input style={{ width:'100%',padding:'10px',borderRadius:'4px',cursor:'pointer',outline:'none',border:'1px solid #ccc' }} onChange={(e)=>{
                  let newdate=new Date(e.target.value);
                  // console.log(newdate)
                  setfilterdate(e.target.value);
                }} type="date" />
              </div> */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setreqcheck(!reqcheck);
                    if (reqcheck == true) {
                      setBody(
                        body.map((item) => {
                          return { ...item, checked: false };
                        })
                      );
                    } else {
                      setBody(
                        body.map((item) => {
                          return { ...item, checked: true };
                        })
                      );
                    }
                    // setrequistcerdata(
                    //   requistcerdata.map(item => {
                    //     return { ...item, checked: !item.checked };
                    //   }),
                    // );
                  }}
                  checked={reqcheck}
                />
                <span>{language == "ar" ? "تحديد الكل" : "Select All"}</span>
              </div>
            </div>
            <div
              className="filterdate"
              style={{ width: "100%", marginBottom: "10px" }}
            >
              <div>
                <h4>{language == "ar" ? "من" : "From"}</h4>
                <input
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    outline: "none"
                  }}
                  type="date"
                  onChange={(e) => {
                    // setdatefilter(e.target.value)
                    settimefilter(e.target.value);
                  }}
                />
              </div>
              <div>
                <h4>{language == "ar" ? "إلى" : "To"}</h4>
                <input
                  style={{
                    padding: "10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                    outline: "none"
                  }}
                  onChange={(e) => {
                    settodate(e.target.value);
                  }}
                  type="date"
                />
              </div>
            </div>
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
              editProduct(
                e,
                item.id,
                () =>
                  selectProducts({
                    setBody,
                    query,
                    setgetdataOriginal,
                    setpageloading
                  }),
                { closeModels }
              )
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
              hideShowProduct(
                e,
                item.id,
                () =>
                  selectProducts({
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
      {shwoeditedit ? (
        <div className="edit_model add_model from_Shipping_div">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setshwoeditedit(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // handleaddpropvaleu()
              // handleeditvalue()
              handleeditproduct();
              // setshowedit(false)
              setshwoeditedit(false);
            }}
            className="from_Shipping edpro from_Shipping_div_edit"
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "الاسم بالانجليزيه" : "Name In English"}
            </label>
            <input
              onChange={(e) => {
                setrowdata({ ...rowdata, title: e.target.value });
              }}
              type="text"
              value={rowdata.title}
            />
            <label htmlFor="">
              {language == "ar" ? "الاسم بالعربيه" : "Name In arabic"}
            </label>
            <input
              onChange={(e) => {
                setrowdata({ ...rowdata, title_ar: e.target.value });
              }}
              type="text"
              value={rowdata.title_ar}
            />
            <label htmlFor="">
              {language == "ar"
                ? "الوصف بالانجليزيه"
                : "Description In English"}
            </label>
            <input
              onChange={(e) => {
                setrowdata({ ...rowdata, description: e.target.value });
              }}
              type="text"
              value={rowdata.description}
            />
            <label htmlFor="">
              {language == "ar" ? "الوصف بالعربيه" : "Description In Arabic"}
            </label>
            <input
              onChange={(e) => {
                setrowdata({ ...rowdata, description_ar: e.target.value });
              }}
              type="text"
              value={rowdata.description_ar}
            />
            <label htmlFor="">
              {language == "ar" ? "رقم النموذج" : "Model Number"}
            </label>
            <input
              onChange={(e) => {
                setrowdata({ ...rowdata, model_number: e.target.value });
              }}
              type="text"
              value={rowdata.model_number}
            />
            <label htmlFor="">
              {language == "ar" ? "إسم الشركه" : "Company Name"}
            </label>
            <input
              onChange={(e) => {
                setrowdata({ ...rowdata, producing_company: e.target.value });
              }}
              type="text"
              value={rowdata.producing_company}
            />
            <label htmlFor="">
              {language == "ar" ? "الوقت المتوفر عنده" : "Will Avilable After"}
            </label>
            <input
              style={{ padding: "10px", paddingBottom: "30px" }}
              onChange={(e) => {
                setrowdata({ ...rowdata, will_av_after: e.target.value });
              }}
              type="date"
              value={rowdata.will_av_after}
            />
            <label htmlFor="">
              {language == "ar" ? "الوقت المتوفر خلاله" : "Will Avilable For"}
            </label>
            <input
              style={{ padding: "10px", paddingBottom: "30px" }}
              onChange={(e) => {
                setrowdata({ ...rowdata, will_av_for: e.target.value });
              }}
              type="date"
              value={rowdata.will_av_for}
            />
            <label htmlFor="">
              {language == "ar"
                ? "الشروط بالانجليزيه"
                : "conditions In English"}
            </label>
            <textarea
              style={{ padding: "0px 0px 40px", height: "30px" }}
              value={rowdata.conditions}
              onChange={(e) => {
                setrowdata({ ...rowdata, conditions: e.target.value });
              }}
            ></textarea>
            <label htmlFor="">
              {language == "ar" ? "الشروط بالعربيه" : "conditions In Arabic"}
            </label>
            <textarea
              style={{ padding: "0px 0px 40px", height: "30px" }}
              onChange={(e) => {
                setrowdata({ ...rowdata, conditions_ar: e.target.value });
              }}
              value={rowdata.conditions_ar}
            ></textarea>
            <button>{language == "ar" ? "تعديل" : "Edit"}</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Products;
