import { Table } from "antd";
import React, { useEffect } from "react";
import ContentNav from "../../datanavcontent";
import { useSelector } from "react-redux";
import DefaultLayout from "../../layout/defaultlayout";
import moment from "moment";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AiFillPlusCircle,
  AiOutlineClose,
  AiOutlinePlus,
} from "react-icons/ai";
import "../ProductColors/productcolors.css";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
const OfferProductColors = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location.state;
  const [colordata, setcolordata] = useState({});
  const [images, setimages] = useState([]);
  const [deletedimgs, setdeletedimgs] = useState([]);
  const [editimages, seteditimages] = useState([]);
  const [showedit, setshowedit] = useState(false);
  // console.log(data)
  const [ShowAddOfferModel, setShowAddOfferModel] = useState(false);
  const language = useSelector((state) => state.language.lang);
  const [body, setbody] = useState([]);
  const [imageloading, setimageloading] = useState(false);
  const [colorproperty, setcolorproperty] = useState({
    product_id: data?.id,
    images: "",
    price: "",
    discount: "",
    available_quantity: "",
    color_code: "",
    color: "",
    color_ar: "",
  });
  const [color_id, setcolor_id] = useState("");
  const [image, setimage] = useState(null);
  const [showadd, setshowadd] = useState(false);
  const [offerdata, setofferdata] = useState({
    time_av_after: "",
    time_av_for: "",
    discount: "",
  });
  const columns = [
    {
      title: language == "ar" ? "*" : "Id",
      dataIndex: "id",
    },
    {
      title: language == "ar" ? "اللون" : "color",
      dataIndex: "color",
    },
    {
      title: language == "ar" ? "كود اللون" : "color code",
      render: (_, record) => {
        return <span>{record.color_code}</span>;
      },
    },
    {
      title: language == "ar" ? "السعر" : "price",
      dataIndex: "price",
    },
    {
      title: language == "ar" ? "السعر القديم" : "Old Price",
      dataIndex: "price",
    },
    {
      title: language == "ar" ? "الكميه" : "Remaining Quantity",
      dataIndex: "remainingQuantity",
    },
    {
      title: language == "ar" ? "صوره اللون" : "Color Image",
      render: (_, record) => {
        return (
          <img
            style={{ width: "30px", maxWidth: "100%" }}
            src={record?.images[record?.images?.length - 2]?.link}
            alt={record?.images[0]?.link}
          />
        );
      },
    },
    {
      title: language == "ar" ? "السعر" : "Price",
      key: "price",
      render: (_, record) => {
        return (
          <p>
            {record.discount == 0
              ? record.price
              : record.price * 1 - (record.price * 1) / (record.discount * 1)}
          </p>
        );
      },
    },
    // {
    //   title:language=='ar'?"أوامر":"Action",
    //   key:"actions",
    //   render:(_,record)=>{
    //     return(
    //       <img onClick={()=>{
    //         setShowAddOfferModel(true)
    //         setcolor_id(record.id)
    //       }} style={{ cursor:'pointer',width:'30px' }} src={require("../../assets/images/edit.png")} alt="" />
    //     )
    //   }
    // }
    // {
    //   title: language=='ar'?"الخصائص":"Feature",
    //   key: "feature",
    //   render:(_,record)=>{
    //     return(
    //       <img onClick={()=>{
    //         navigate("/colorfeature",{state:{record:record}})
    //       }} style={{ width:'50px',cursor:'pointer' }} src={require("../../assets/images/features.png")} alt="" />
    //     )
    //   }
    // },
    // {
    //   title:language=='ar'?"أوامر":"actions",
    //   key:"actions",
    //   render:(_,record)=>{
    //     return(
    //       <img onClick={()=>{
    //         setshowedit(true);
    //         // console.log(record);
    //         setcolordata(record)
    //         seteditimages([...record.images]);
    //         // console.log(record.images)
    //       }} style={{ width:'30px',cursor:'pointer'}} src={require("../../assets/images/edit.png")} alt="" />
    //     )
    //   }
    // }
  ];

  const getProductColors = () => {
    const data_send = {
      product_id: data.id,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color/getProducts", data_send)
      .then((res) => {
        // console.log(res.data.message);
        // setbody(res.data.message)
        // handleupdateprod()
        if (Array.isArray(res.data.message[0]?.colors)) {
          setbody(res.data.message[0]?.colors);
        }
      })
      .catch((err) => console.log(err));
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
          setimages([...images, res.data.imgUrl]);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
      });
  };

  const handleaddcolor = () => {
    let imagesarr = [...images];
    let imagesstr = imagesarr.join("***");
    // console.log(imagesarr);
    const data_send = {
      product_id: data?.id,
      images: imagesstr,
      price: colorproperty.price,
      discount: colorproperty.discount,
      available_quantity: colorproperty.available_quantity,
      color_code: colorproperty.color_code,
      color: colorproperty.color,
      color_ar: colorproperty.color_ar,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color/add", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getProductColors();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handledeletecolorimg = (id) => {
    const dataimgs = [...editimages];
    setdeletedimgs([...deletedimgs, id]);
    seteditimages(dataimgs.filter((item) => item.id !== id));
  };

  const handleeditcolorproperty = () => {
    let imagesarr = deletedimgs.join("***");
    const data_send = {
      product_id: data.id,
      images: imagesarr,
      price: colordata.price,
      discount: colordata.discount,
      available_quantity: colordata.available_quantity,
      color_code: colordata.color_code,
      color: colordata.color,
      color_id: colordata.id,
      color_ar: colordata.color_ar,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getProductColors();
          setshowedit(false);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleaddoffer = () => {
    const data_send = {
      ...offerdata,
      product_id: data.id,
      color_id,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/color/make_offer", data_send)
      .then((res) => {
        // console.log(res.data)
        if (res.data.status == 1) {
          setShowAddOfferModel(false);
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getProductColors();
  }, []);

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav
              head={language == "ar" ? "ألوان المنتج" : "Product Colors"}
            />
            {
              // <Ratios statics={statics} />
              // <Filter />
              // <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} />
            }
            {/* <div className='add_item' style={{
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between'
             }}>
              <h4>{language=='ar'?"إضافه":"add"}</h4>
              <AiOutlinePlus
                onClick={()=>{
                  setshowadd(true);
                }}
              />
            </div> */}
            <Table dataSource={body} columns={columns} />
          </div>
        }
      />

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
              // handleedit();
              handleaddcolor();
              setshowadd(false);
            }}
            className="from_Shipping"
            action=""
          >
            <label htmlFor="">{language == "ar" ? "الصور" : "Images"}</label>
            <div className="updiv">
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
            {/* <label htmlFor="">product Price</label> */}
            <input
              type="text"
              placeholder={language == "ar" ? "سعر المنتج" : "Product Price"}
              onChange={(e) => {
                setcolorproperty({ ...colorproperty, price: e.target.value });
              }}
            />
            {/* <label htmlFor="">product Price</label> */}
            <input
              type="number"
              max={100}
              placeholder={language == "ar" ? "قيمة الخصم" : "Product discount"}
              onChange={(e) => {
                setcolorproperty({
                  ...colorproperty,
                  discount: e.target.value,
                });
              }}
            />
            {/* <label htmlFor="">product Quantity</label> */}
            <input
              type="text"
              placeholder={
                language == "ar" ? "كمية المنتج" : "product Quantity"
              }
              onChange={(e) => {
                setcolorproperty({
                  ...colorproperty,
                  available_quantity: e.target.value,
                });
              }}
            />
            {/* <label htmlFor="">Color Code</label> */}
            <input
              type="color"
              placeholder={language == "ar" ? "كود اللون" : "Color Code"}
              onChange={(e) => {
                setcolorproperty({
                  ...colorproperty,
                  color_code: e.target.value,
                });
              }}
            />
            {/* <label htmlFor="">Color In English</label> */}
            <input
              type="text"
              placeholder={
                language == "ar" ? "إسم اللون بالانجليزيه" : "Color In English"
              }
              onChange={(e) => {
                setcolorproperty({ ...colorproperty, color: e.target.value });
              }}
            />
            {/* <label htmlFor="">Color In Arabic</label> */}
            <input
              type="text"
              placeholder={
                language == "ar" ? "إسم اللون بالعربيه" : "Color In Arabic"
              }
              onChange={(e) => {
                setcolorproperty({
                  ...colorproperty,
                  color_ar: e.target.value,
                });
              }}
            />
            <button>{language == "ar" ? "إضافه" : "Add"}</button>
          </form>
        </div>
      ) : null}

      {showedit ? (
        <div className="edit_model add_model from_Shipping_div from_Shipping_div_edit">
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
              handleeditcolorproperty();
              // handleedit();
              // handleaddcolor()
              // setshowadd(false)
            }}
            className="from_Shipping"
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "صور اللون" : "Color Image"}
            </label>
            {editimages?.length > 0 ? (
              <div className="editimgs">
                {editimages?.map((item, index) => {
                  return (
                    <div>
                      <img src={item.link} alt="" />
                      <AiOutlineClose
                        onClick={() => {
                          handledeletecolorimg(item.id);
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            ) : null}
            <label htmlFor="">{language == "ar" ? "السعر:" : "price:"}</label>
            <input
              onChange={(e) => {
                setcolordata({ ...colordata, price: e.target.value });
              }}
              type="text"
              value={colordata.price}
            />
            <label htmlFor="">
              {language == "ar" ? "الخصم:" : "discount:"}
            </label>
            <input
              onChange={(e) => {
                setcolordata({ ...colordata, discount: e.target.value });
              }}
              type="number"
              max={100}
              value={colordata.discount}
            />
            <label htmlFor="">
              {language == "ar" ? "الكميه المتوفره:" : "available quantity:"}
            </label>
            <input
              onChange={(e) => {
                setcolordata({
                  ...colordata,
                  available_quantity: e.target.value,
                });
              }}
              type="number"
              value={colordata.available_quantity}
            />
            <label htmlFor="">
              {language == "ar" ? "كود اللون:" : "color code:"}
            </label>
            <input
              type="color"
              onChange={(e) => {
                setcolordata({ ...colordata, color_code: e.target.value });
              }}
              name=""
              value={colordata.color_code}
              id=""
            />
            <label htmlFor="">
              {language == "ar" ? "اللون بالانجليزيه:" : "color in english:"}
            </label>
            <input
              type="text"
              onChange={(e) => {
                setcolordata({ ...colordata, color: e.target.value });
              }}
              name=""
              value={colordata.color}
              id=""
            />
            <label htmlFor="">
              {language == "ar" ? "اللون بالعربيه:" : "color in arabic"}
            </label>
            <input
              type="text"
              onChange={(e) => {
                setcolordata({ ...colordata, color_ar: e.target.value });
              }}
              name=""
              value={colordata.color_ar}
              id=""
            />
            <button>{language == "ar" ? "تعديل" : "Edit"}</button>
          </form>
        </div>
      ) : null}
      {ShowAddOfferModel ? (
        <div className="edit_model add_model from_Shipping_div ">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setShowAddOfferModel(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleaddoffer();
            }}
            className="from_Shipping"
            action=""
          >
            <label htmlFor="">
              {language == "ar" ? "العرض سارى بدأ من" : "Offer will start at"}
            </label>
            <input
              onChange={(e) => {
                setofferdata({ ...offerdata, time_av_after: e.target.value });
              }}
              type="date"
              placeholder={
                language == "ar" ? "العرض سارى بدأ من" : "Offer will start at"
              }
            />
            <label htmlFor="">
              {language == "ar" ? "العرض سارى ل" : "Offer Will Be For"}
            </label>
            <input
              min={offerdata.time_av_after}
              disabled={offerdata.time_av_after == "" ? true : false}
              onChange={(e) => {
                setofferdata({ ...offerdata, time_av_for: e.target.value });
              }}
              type="date"
              placeholder={
                language == "ar" ? "العرض سارى لوقت" : "Offer Will Be For"
              }
            />
            <label htmlFor="">
              {language == "ar" ? "نسبة الخصم" : "Discount ratio"}
            </label>
            <input
              onChange={(e) => {
                setofferdata({ ...offerdata, discount: e.target.value });
              }}
              type="number"
              placeholder={language == "ar" ? "نسبة الخصم" : "Discount ratio"}
            />
            <button>{language == "ar" ? "إضافه" : "Add"}</button>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default OfferProductColors;
