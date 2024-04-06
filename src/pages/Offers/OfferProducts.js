import lodash from "lodash/lodash";
import React, { useState } from "react";
import ContentNav from "../../datanavcontent";
import DefaultLayout from "../../layout/defaultlayout";
import "./offersproducts.css";
// import Ratios from "./Ratios";
// import Filter from "./Filter";
import { AiOutlinePlus } from "react-icons/ai";
// import Table from "../../components/table";
import { Icon } from "@iconify/react";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Card, Col, Select, Switch, Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import Form from "../../components/form";
import {
  equdata,
  hideShowProduct,
  offer_input,
  selectProducts,
  setItem_s
} from "../products/functions";
import "../products/style.css";
// AdapterMoment
const { Meta } = Card;

const OfferProducts = () => {
  const [show, setshow] = useState(false);
  const [item, setitem] = useState(false);
  const [showconfstop, setshowconfstop] = useState(false);
  const [pageloading, setpageloading] = useState(true);
  const [record, setrecord] = useState({});
  const [showedit, setshowedit] = useState(false);
  const [todate, settodate] = useState("");
  const [timefilter, settimefilter] = useState("");
  const [possibilities, setpossibilities] = useState([]);
  const [copiedproductid, setcopiedproductid] = useState("");
  const [copiedproducttitle, setcopiedproducttitle] = useState("");
  const navigate = useNavigate();
  const showofferbox = ({ item }) => {
    setitem(item);
    setshow(true);
    equdata(item);
    offer_input[1].value = item.price;
    offer_input[2].value = item.name;
  };
  const [addloading, setaddloading] = useState(false);
  const language = useSelector((state) => state.language.lang);
  const [selsearchprod, setselsearchprod] = useState("");
  const [showaddoffer, setshowaddoffer] = useState(false);
  const [colors, setcolors] = useState([]);
  const [shippingStatus, setShippingStatus] = useState(0);
  // const []=useState([]);
  const columns = [
    {
      title: language == "ar" ? "*" : "id",
      dataIndex: "id",
      key: "id"
    },
    {
      title: language == "ar" ? "اسم المنتج" : "Name",
      render: (_, record) => {
        return <p>{record?.products[0]?.title}</p>;
      },
      key: "name"
    },
    {
      title: language == "ar" ? "اسم المنتج بالعربيه" : "Arabic Name",
      render: (_, record) => {
        return <p>{record?.products[0]?.title_ar}</p>;
      },
      key: "title_ar"
    },
    {
      title: language == "ar" ? "التاريخ" : "Date",
      render: (_, record) => {
        // console.log(record)
        return (
          <span>{moment(record.createdAt).format("YYYY-MM-DD hh:mm:ss")}</span>
        );
      }
    },
    {
      title: language == "ar" ? "رقم النموذج" : "Model Number",
      render: (_, record) => {
        return <p>{record?.products[0]?.model_number}</p>;
      },
      key: "model_number"
    },
    {
      title: language == "ar" ? "الشركه" : "Company",
      render: (_, record) => {
        return <p>{record.products[0]?.producing_company}</p>;
      },
      key: "producing_company"
    },
    {
      title: language == "ar" ? "الفئه" : "Category",
      render: (_, record) => {
        console.log(record?.status);
        return (
          <p>
            {language == "ar"
              ? record.products[0]?.category_name_ar
              : record.products[0].category_name}
          </p>
        );
      },
      key: "category"
    },
    {
      title: language == "ar" ? "حالة العرض" : "Status",
      dataIndex: language == "ar" ? "status_ar" : "Status",
      key: "status"
    },
    // {
    //   title: language == 'ar' ? "لون المنتج" : "Product Color",
    //   render: (_, record) => {
    //     // console.log(record)
    //     return null;
    //     // <p>{language=='ar'?record?.products[0]?.colors[0].color_ar:record.products[0].colors[0].color}</p>
    //   },
    //   key: 'color'
    // },
    // {
    //   title: language == 'ar' ? "كود المنتج" : "Color Code",
    //   render: (_, record) => {
    //     return null;
    //     // <p>{language=='ar'?record?.products[0]?.colors[0].color_ar:record.products[0].colors[0].color}</p>
    //   },
    //   key: 'color'
    // },
    {
      title: language == "ar" ? "متوفر عند" : "Avilable After",
      key: "will_av_after",
      render: (_, record) => {
        return (
          <span>
            {moment(record.will_av_after).format("YYYY-MM-DD hh:mm:ss")}
          </span>
        );
      }
    },
    {
      title: language == "ar" ? "النوع" : "Type",
      key: "will_av_after",
      render: (_, record) => {
        return (
          <span>
            {record?.isTendered ? "ضمن المناقصة" : "ليس ضمن المناقصة"}
          </span>
        );
      }
    },
    {
      title: language == "ar" ? "متوفر لوقت" : "Avilable For",
      key: "will_av_for",
      render: (_, record) => {
        // console.log(record.will_av_for)
        /* record.will_av_for */
        return (
          <span>
            {moment(`${record.will_av_for}`).format("YYYY-MM-DD hh:mm:ss")}
          </span>
        );
      }
    },
    // {
    //   title: language == 'ar' ? "الخصائص" : "Properties",
    //   key: 'will_av_for',
    //   render: (_, record) => {
    //     // console.log(record)
    //     /* record.will_av_for */
    //     return (
    //       <img
    //         onClick={() => {
    //           navigate("/offerproductcolros", { state: { data: record } });
    //         }}
    //         style={{
    //           cursor: 'pointer',
    //           maxWidth: '100%'
    //         }}
    //         src={require("../../assets/images/features.png")}
    //         alt=""
    //       />
    //     );
    //   }
    // },
    {
      title: language == "ar" ? "مخزن فى" : "Store",
      key: "store",
      render: (_, record) => {
        /* record.will_av_for */
        return <p>{record.store}</p>;
      }
    },
    {
      title: language == "ar" ? "عرض " : "Show",
      key: "show",
      render: (_, record) => {
        /* record.will_av_for */
        return (
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowEditForm(true);
              handlesearchproduct(record.products[0].title);
              setcopiedrecord(record);
              setcopiedproducttitle(record.products[0].title);
              setcopiedproductid(record.products[0].id);
              setcopiedpossibilities(record.products[0].possibilities);
            }}
          >
            {language == "ar" ? "عرض" : "show"}
          </button>
        );
      }
    },
    {
      title: language == "ar" ? "إيقاف العرض" : "Stop The Offer",
      key: "stop",
      render: (_, record) => {
        return (
          <div>
            <button
              className="btn btn-success"
              onClick={() => {
                setrecord(record);
                setshowconfstop(true);
              }}
            >
              {language == "ar" ? "إيقاف" : "Stop"}
            </button>
          </div>
        );
      }
    },
    {
      title: language == "ar" ? "أرشفة" : "Archive The Offer",
      key: "stop",
      render: (_, record) => {
        return (
          <div>
            <button
              className="btn btn-success"
              onClick={() => {
                setrecord(record);
                setshowconfarchive(true);
              }}
            >
              {language == "ar" ? "أرشفة" : "Archive"}
            </button>
          </div>
        );
      }
    },
    {
      title: language == "ar" ? "أوامر" : "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              rowGap: "4px",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap"
            }}
          >
            {/* <img
              onClick={() => {
                setrecord(record);
                // console.log(record)
                setpossibilities(record.products[0].possibilities);
                setselectedproduct(record.product_id);
                setselectedcolor(record.color_id);
                setselectedprop(record.prop_id);
                setselectedpropvalue(record.prop_value_id);
                setShowEditForm(true);
              }}
              style={{ width: '30px', cursor: 'pointer' }}
              src={require("../../assets/images/edit.png")}
              alt=""
            /> */}
            <img
              onClick={() => {
                setshowcopy(true);
                // setrecord(record)
                handlesearchproduct(record.products[0].title);
                setcopiedrecord(record);
                setcopiedproducttitle(record.products[0].title);
                setcopiedproductid(record.products[0].id);
                setcopiedpossibilities(record.products[0].possibilities);
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/copy.png")}
              alt=""
            />
          </div>
        );
      }
    }
  ];

  const [itemHidden, setItemHidden] = useState();

  useEffect(() => {
    setItem_s(item);
    setItemHidden(item?.item_hidden === "yes");
  }, [item]);
  const [products, setproducts] = useState([]);
  const [query, setQuery] = useState(false);
  const [body, setBody] = useState(false);
  // useEffect(() => {
  //   selectProducts({ setBody, query });
  // }, [selectProducts, query]);

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
  const [searchedProudts, setsearchedProudts] = useState([]);
  const [ColorArr, setColorArr] = useState([]);
  const [tenderEndTime, setTenderEndTime] = useState(1);
  const [offers, setoffers] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [removeModel, setRemoveModel] = useState(false);
  const [selectedproduct, setselectedproduct] = useState("");
  const [selectedcolor, setselectedcolor] = useState("");
  const [props, setprops] = useState([]);
  const [selectedprop, setselectedprop] = useState("");
  const [propvalues, setpropvalues] = useState([]);
  const [selectedpropvalue, setselectedpropvalue] = useState("");
  const [store, setstore] = useState("uae");
  const [will_av_after, setwill_av_after] = useState("");
  const [will_av_for, setwill_av_for] = useState("");
  const [cost, setCost] = useState(0);
  const [rate_time, setRateTime] = useState(0);
  const [showcopy, setshowcopy] = useState(false);
  const [filteredstore, setfilteredstore] = useState("all");
  const [getoriginlaoffers, setgetoriginlaoffers] = useState([]);
  const [datefilter, setdatefilter] = useState("");
  const [searchTxt, setSearchTxt] = useState("");
  const [possibilities_en, setpossibilities_en] = useState([]);
  const [isTendered, setIsTendered] = useState(false);
  const [maximunJoiners, setMaximunJoiners] = useState(0);
  const [copiedrecord, setcopiedrecord] = useState({});
  const [copiedpossibilities, setcopiedpossibilities] = useState([]);
  const [status, setstatus] = useState();
  const [stoploading, setstoploading] = useState(false);
  const [showconfarchive, setshowconfarchive] = useState(false);
  // setshowconfarchive
  const closeModels = () => {
    setShowEditForm(false);
    setRemoveModel(false);
  };
  // const [statics, setStatics] = useState(false);
  // useEffect(() => {
  //   getStatic({ setStatics });
  // }, []);
  const [filters, setFilters] = useState({
    archived: false,
    success: false,
    stopped: false,
    available: true,
    startDate: "",
    endDate: ""
  });

  const getoffers = () => {
    setpageloading(true);
    const data_send = {
      type: "admin"
    };
    axios
      .post("https://api.manjam.shop/v3/offers/select_offers", data_send)
      .then((res) => {
        // console.log(res.data.message);
        if (Array.isArray(res.data.message)) {
          let filteredOffers = res.data.message;

          // Filter based on the 'archived', 'success', 'stopped', and 'available' flags
          if (filters.archived)
            filteredOffers = filteredOffers.filter(
              (offer) => offer.archive === 1
            );
          if (filters.success)
            filteredOffers = filteredOffers.filter(
              (offer) => offer.success === 1
            );
          if (filters.stopped)
            filteredOffers = filteredOffers.filter(
              (offer) => offer.stopped === 1
            );

          // Filter based on the date range
          if (filters.startDate) {
            filteredOffers = filteredOffers.filter(
              (offer) =>
                new Date(offer.createdAt) >= new Date(filters.startDate)
            );
          }
          if (filters.endDate)
            filteredOffers = filteredOffers.filter(
              (offer) => new Date(offer.createdAt) <= new Date(filters.endDate)
            );

          setoffers(filteredOffers);
          // setoffers(res.data.message);
          setgetoriginlaoffers(res.data.message);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setpageloading(false);
      });
  };

  const getproducts = () => {
    axios
      .get("https://api.manjam.shop/v3/product/getAll?type=admin")
      .then((res) => {
        if (Array.isArray(res.data.message)) {
          setproducts(res.data.message);
          setselectedproduct(res?.data?.message[0]?.id);
        }
      });
  };

  const getprops = () => {
    let pusehdcolors = colors?.filter((item) => item.id == selectedcolor);
    setprops(pusehdcolors[0]?.props || []);
    // console.log(pusehdcolors[0]?.props)
    let allcolors = [...ColorArr];
    setselectedprop(pusehdcolors[0]?.props[0]?.id);
  };
  useEffect(() => {
    getprops();
  }, [selectedcolor]);

  useEffect(() => {
    getoffers();
    getproducts();
  }, []);
  useEffect(() => {
    getoffers();
  }, [filters]);
  const handlefilterdate = () => {
    let alldata = [...getoriginlaoffers];
    setoffers(
      alldata.filter(
        (item) =>
          moment(item.createdAt).format("L") >= moment(datefilter).format("L")
      )
    );
  };

  useEffect(() => {
    handlefilterdate();
  }, [datefilter]);

  // useEffect(()=>{

  // },[selectedproduct])

  useEffect(() => {
    // console.log(selectedproduct);
    // let allproducts=[...searchedProudts];
    let filteredproduct = searchedProudts.filter(
      (item) => item.id == selsearchprod
    );
    if (Array.isArray(filteredproduct[0]?.possibilities)) {
      let allpossibilities = [...filteredproduct[0]?.possibilities];
      for (let i = 0; i < allpossibilities.length; i++) {
        allpossibilities[i]["quantity"] = "";
        allpossibilities[i]["old_price"] = "";
        allpossibilities[i]["new_price"] = "";
      }
      setpossibilities_en(allpossibilities);
    }
  }, [selsearchprod]);

  // useEffect(()=>{
  //   let filteredproduct=searchedProudts.filter(item=>item.id==copiedproductid);
  //   if(Array.isArray(filteredproduct[0]?.possibilities)){
  //     let allpossibilities=[...filteredproduct[0]?.possibilities];
  //     setcopiedpossibilities(allpossibilities);
  //   }
  // },[copiedproductid])
  const getpropsvalues = () => {
    let pushedprops = props?.filter((item, index) => item.id == selectedprop);
    // console.log(pushedprops)
    setpropvalues(pushedprops[0]?.values);
    setselectedpropvalue(pushedprops[0]?.values[0]?.id);
  };
  useEffect(() => {
    getpropsvalues();
  }, [selectedprop]);

  const handleaddoffer = () => {
    let allpossibilities = [...possibilities_en];
    let varients = "";
    for (let i = 0; i < allpossibilities.length; i++) {
      if (i == 0) {
        if (allpossibilities[i].quantity * 1 > 0) {
          varients +=
            allpossibilities[i].color_id +
            "*" +
            allpossibilities[i].prop_id +
            "*" +
            allpossibilities[i].prop_value_id +
            "*" +
            allpossibilities[i].quantity +
            "*" +
            allpossibilities[i].old_price +
            "*" +
            allpossibilities[i].new_price +
            "*" +
            allpossibilities[i].min_price +
            "*" +
            allpossibilities[i].rate_price;
        }
      } else {
        if (allpossibilities[i].quantity * 1 > 0) {
          varients +=
            "***" +
            allpossibilities[i].color_id +
            "*" +
            allpossibilities[i].prop_id +
            "*" +
            allpossibilities[i].prop_value_id +
            "*" +
            allpossibilities[i].quantity +
            "*" +
            allpossibilities[i].old_price +
            "*" +
            allpossibilities[i].new_price +
            "*" +
            allpossibilities[i].min_price +
            "*" +
            allpossibilities[i].rate_price;
        }
      }
    }
    const data_send = {
      varients,
      product_id: selsearchprod,
      store,
      will_av_after,
      will_av_for,
      shippingStatus,
      isTendered,
      maximunJoiners,
      cost,
      tenderEndTime,
      rate_time
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/offers/make", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          setshowaddoffer(false);
          getoffers();

          setselsearchprod("");
          setpossibilities_en([]);
          setsearchedProudts([]);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const hanldecopy = () => {
    let allpossibilities = [...copiedpossibilities];
    let varients = "";
    for (let i = 0; i < allpossibilities.length; i++) {
      if (i == 0) {
        if (allpossibilities[i].stock * 1 > 0) {
          varients +=
            allpossibilities[i].color_id +
            "*" +
            allpossibilities[i].prop_id +
            "*" +
            allpossibilities[i].prop_value_id +
            "*" +
            allpossibilities[i].stock +
            "*" +
            allpossibilities[i].old_price +
            "*" +
            allpossibilities[i].new_price;
        }
      } else {
        if (allpossibilities[i].stock * 1 > 0) {
          varients +=
            "***" +
            allpossibilities[i].color_id +
            "*" +
            allpossibilities[i].prop_id +
            "*" +
            allpossibilities[i].prop_value_id +
            "*" +
            allpossibilities[i].stock +
            "*" +
            allpossibilities[i].old_price +
            "*" +
            allpossibilities[i].new_price;
        }
      }
    }
    const data_send = {
      varients,
      product_id: copiedproductid,
      will_av_after: copiedrecord.will_av_after,
      will_av_for: copiedrecord.will_av_for,
      store: copiedrecord.store,
      offer_id: copiedrecord.id,
      same: !status ? 1 : 0
    };
    axios
      .post("https://api.manjam.shop/v3/offers/copy", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          setshowcopy(false);
          getoffers();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };
  const handlehandlefilterstore = () => {
    let alldata = [...getoriginlaoffers];
    if (filteredstore == "all") {
      setoffers(getoriginlaoffers);
    } else {
      setoffers(alldata.filter((item) => item.store == filteredstore));
    }
  };
  useEffect(() => {
    handlehandlefilterstore();
  }, [filteredstore]);

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getoriginlaoffers, (item) => {
      return contains(item, formattedQuery);
    });
    setoffers(filteredData);
  }
  const contains = (items, query) => {
    const { products, id } = items;
    if (
      products[0].title?.toLowerCase().includes(query) ||
      products[0].title_ar?.toLowerCase().includes(query) ||
      products[0].model_number?.toLowerCase().includes(query) ||
      id == query
    ) {
      return true;
    }

    return false;
  };

  useEffect(() => {
    let alldata = [...getoriginlaoffers];
    if (timefilter == "" && todate == "") {
      setoffers(alldata);
    } else if (timefilter == "" && todate !== "") {
      setoffers(
        alldata.filter(
          (item) =>
            moment(item.createdAt).format("L") <= moment(todate).format("L")
        )
      );
    } else if (timefilter !== "" && todate == "") {
      setoffers(
        alldata.filter(
          (item) =>
            moment(item.createdAt).format("L") >= moment(timefilter).format("L")
        )
      );
    } else if (timefilter !== "" && todate != "") {
      // console.log("ew")
      setoffers(
        alldata.filter(
          (item) =>
            moment(item.createdAt).format("L") >=
              moment(timefilter).format("L") &&
            moment(item.createdAt).format("L") <= moment(todate).format("L")
        )
      );
    }
  }, [timefilter, todate]);

  const handlesearchproduct = (txt) => {
    const data_send = {
      token: txt
    };
    axios
      .post(
        `https://api.manjam.shop/v3/product/searchProduct?token=${txt}`,
        data_send
      )
      .then((res) => {
        // console.log(res)
        if (Array.isArray(res.data.message)) {
          setsearchedProudts(res.data.message);
        }
        setselsearchprod(res?.data?.message[0]?.id);
        if (Array.isArray(res?.data?.message[0]?.possibilities)) {
          let allpossibilities = [...res?.data?.message[0]?.possibilities];
          for (let i = 0; i < allpossibilities.length; i++) {
            allpossibilities[i]["quantity"] = "";
            allpossibilities[i]["old_price"] = "";
            allpossibilities[i]["new_price"] = "";
          }
          setpossibilities_en(allpossibilities);
          // setcopiedpossibilities(allpossibilities)
        }
      });
  };

  // useEffect(()=>{
  //   handlesearchproduct(copiedrecord?.products[0]?.title)
  // },[copiedrecord?.products[0]?.title])
  const [filterIsTendered, setFilterIsTendered] = useState(false);

  const hadlechangedata = (item, index, e) => {
    let allpossibilities = [...possibilities_en];
    // allpossibilities[e]
    allpossibilities[index][e.target.name] = e.target.value;
    setpossibilities_en(allpossibilities);
  };

  const handlechangecopieddata = (item, index, e) => {
    let allpossibilities = [...copiedpossibilities];
    allpossibilities[index][e.target.name] = e.target.value;
    setcopiedpossibilities(allpossibilities);
  };

  // if (
  //   removeModel ||
  //   showaddoffer ||
  //   showcopy ||
  //   showEditForm ||
  //   showconfstop ||
  //   show
  // ) {
  //   document.body.style.overflow = "hidden";
  // } else {
  //   document.body.style.overflow = "visible";
  // }

  const handlestopoffer = () => {
    setstoploading(true);
    const data_send = {
      offer_id: record.id
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/offers/stop", data_send)
      .then((res) => {
        // console.log(res.data);
        getoffers();
        if (res.data.status == 1) {
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Somethig Went Error");
        }
      })
      .finally(() => {
        setshowconfstop(false);
        setstoploading(false);
      })
      .catch((err) => console.log(err));
  };
  const handleArchiveOffer = () => {
    setstoploading(true);
    const data_send = {
      offer_id: record?.id,
      archive: 1,
      success: 0,
      notes: ""
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/offers/archive", data_send)
      .then((res) => {
        // console.log(res.data);
        getoffers();
        if (res.data.status == 1) {
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Somethig Went Error");
        }
      })
      .finally(() => {
        setshowconfarchive(false);
        setstoploading(false);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    let alldata = [...getoriginlaoffers];
    if (filterIsTendered) {
      setoffers(getoriginlaoffers.filter((item) => item?.isTendered));
    } else {
      setoffers(getoriginlaoffers.filter((item) => !item?.isTendered));
    }
  }, [filterIsTendered, filters]);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav head={language == "ar" ? "العروض" : "Offers"} />
            {/* <Ratios statics={statics} /> */}
            {/* <Filter /> */}
            {/* <SearchBox setQuery={setQuery} placeholder={"ابحث ف المنتجات"} /> */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <h4>{language == "ar" ? "إضافه" : "Add"}</h4>
              <AiOutlinePlus
                onClick={() => {
                  setshowaddoffer(true);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "22px",
                  color: "#198754"
                }}
              />
            </div>
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
                  language == "ar" ? "بحث فى العروض" : "Search In Offers"
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
              {/* <button onClick={()=>{
                handleexport1()
              }} className="btn btn-primary">{language=='ar'?"تصدير":"Export"}</button> */}
            </div>
            <div className="filters-container">
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.stopped}
                    name="offer_status"
                    onChange={(e) =>
                      setFilters({
                        stopped: e.target.checked,
                        archived: false, // Ensure other options are set to false
                        success: false
                      })
                    }
                  />
                  <h4>{language === "ar" ? "متوقفه" : "Stopped"}</h4>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.archived}
                    name="offer_status"
                    onChange={(e) =>
                      setFilters({
                        stopped: false, // Ensure other options are set to false
                        archived: e.target.checked,
                        success: false
                      })
                    }
                  />
                  <h4>{language === "ar" ? "مؤرشفة" : "Archived"}</h4>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={filters.success}
                    name="offer_status"
                    onChange={(e) =>
                      setFilters({
                        stopped: false, // Ensure other options are set to false
                        archived: false,
                        success: e.target.checked
                      })
                    }
                  />
                  <h4>{language === "ar" ? "نجحت" : "Successed"}</h4>
                </label>

                {/* Repeat for other filters */}
              </div>

              <div className="date-group">
                <label className="date-label">
                  <h4>{language == "ar" ? "من" : "From"}</h4>
                  <input
                    type="date"
                    className="date-input"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                  />
                </label>
                <label className="date-label">
                  <h4>{language == "ar" ? "إلى" : "To"}</h4>
                  <input
                    type="date"
                    className="date-input"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                  />
                </label>
              </div>

              {/* <button className="apply-button" onClick={getoffers}>
                Apply Filters
              </button> */}
            </div>

            <div
              style={{
                margin: "20px 0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap"
              }}
            >
              <Select
                value={filteredstore}
                style={{
                  width: "200px"
                }}
                onChange={(e) => {
                  setfilteredstore(e);
                }}
                options={[
                  {
                    value: "all",
                    label: "All"
                  },
                  {
                    value: "ksa",
                    label: "Saudi Aribia"
                  },
                  {
                    value: "uae",
                    label: "uae"
                  }
                ]}
              />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={filterIsTendered}
                  onChange={(e) => setFilterIsTendered(e.target.checked)}
                />
                {language === "ar"
                  ? "العروض ضمن المناقصة"
                  : "Offers are Tendered"}
              </label>
            </div>

            {/* <div
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
                    outline: "none",
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
                    outline: "none",
                  }}
                  onChange={(e) => {
                    settodate(e.target.value);
                  }}
                  type="date"
                />
              </div>
            </div> */}
            {pageloading ? (
              [1, 2, 3].map((x) => (
                <Col xs={24} md={24} lg={24} key={x}>
                  <Card loading minHeight={200} />
                </Col>
              ))
            ) : (
              <Table dataSource={offers} columns={columns} />
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
                () => selectProducts({ setBody, query }),
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
      {showaddoffer ? (
        <div className="edit_model add_model from_Shipping_div">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setshowaddoffer(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleaddoffer();
            }}
            className="formaddproduct offerformproduct"
          >
            <label htmlFor="">
              {language == "ar"
                ? "المتجر المتاح فيه العرض"
                : "The store where the offer is available"}
            </label>
            <select
              value={store}
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              onChange={(e) => {
                // console.log(e)
                setstore(e.target.value);
              }}
            >
              {[
                {
                  value: "uae",
                  label: language == "ar" ? "الامارات" : "The UAE"
                },
                {
                  value: "ksa",
                  label: language == "ar" ? "السعوديه" : "Saudi Aribia"
                },
                {
                  value: "uae***ksa",
                  label:
                    language == "ar"
                      ? "الامارات و السعوديه"
                      : "The UAE and Saudi Aribia"
                }
              ].map((item) => {
                return <option value={item.value}>{item.label}</option>;
              })}
            </select>
            <label htmlFor="">
              {language == "ar" ? "البحث فى العروض" : "Search in Offers"}
            </label>

            <input
              placeholder={
                language == "ar"
                  ? "إذا بحثت برقم المنتج أضف علامة # قبلها"
                  : "If you search by product number, add a # sign before it"
              }
              type="text"
              onChange={(e) => {
                if (e.target.value.length >= 2) {
                  handlesearchproduct(e.target.value);
                }
              }}
            />
            <label htmlFor="shippingstatus">
              {language == "ar" ? "ضمن المناقصة" : "Is Tendered"}
            </label>
            <input
              type="checkbox"
              name="shippingstatus"
              id="shippingstatus"
              onChange={(e) => {
                setIsTendered(e.target.checked);
              }}
            />
            {isTendered ? (
              <>
                <label htmlFor="">
                  {language == "ar" ? "المعدل الزمني" : "Time Rate"}
                </label>
                <input
                  name="quantity"
                  onChange={(e) => {
                    setRateTime(e.target.value);
                  }}
                  type="text"
                  placeholder={language == "ar" ? "المعدل الزمني" : "Time Rate"}
                />{" "}
                <label htmlFor="">
                  {language == "ar"
                    ? "أقصي عدد من الملتحقين"
                    : "Maximum Joiners"}
                </label>
                <input
                  name="quantity"
                  onChange={(e) => {
                    setMaximunJoiners(e.target.value);
                  }}
                  type="text"
                  placeholder={
                    language == "ar"
                      ? "أقصي عدد من الملتحقين"
                      : "Maximum Joiners"
                  }
                />
                <label htmlFor="">
                  {language == "ar" ? "سعر الالتحاق" : "Join Cost"}
                </label>
                <input
                  name="quantity"
                  onChange={(e) => {
                    setCost(e.target.value);
                  }}
                  type="text"
                  placeholder={language == "ar" ? "سعر الالتحاق" : "Join Cost"}
                />{" "}
                <label htmlFor="">
                  {language == "ar"
                    ? "مدة انتهاء المناقصة (دقايق)"
                    : "Tender End Time (Minutes)"}
                </label>
                <input
                  name="quantity"
                  onChange={(e) => {
                    setTenderEndTime(e.target.value);
                  }}
                  type="text"
                  placeholder={
                    language == "ar"
                      ? "مدة انتهاء المناقصة (دقايق)"
                      : "Tender End Time (Minutes)"
                  }
                />
              </>
            ) : null}
            <label htmlFor="">
              {language == "ar" ? "المنتجات الناتجه" : "The resulting products"}
            </label>
            <Select
              value={selsearchprod}
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              onChange={(e) => {
                // console.log(e)
                setselectedproduct(e);
                setselsearchprod(e);
              }}
              options={searchedProudts?.map((item, index) => {
                // console.log(item)
                return { label: item.title, value: item.id };
              })}
            />
            <div className="possibilities">
              {possibilities_en.map((item, index) => {
                // console.log(item)
                return (
                  <div>
                    <h4>
                      {language == "ar"
                        ? item.color_label_ar
                        : item.color_label}
                    </h4>
                    <p>
                      {language == "ar"
                        ? item.prop_value_label_ar
                        : item.prop_value_label}
                    </p>
                    <label htmlFor="">
                      {language == "ar" ? "الكميه" : "Quantity"}
                    </label>
                    <input
                      name="quantity"
                      onChange={(e) => {
                        hadlechangedata(item, index, e);
                      }}
                      value={item.quantity}
                      type="text"
                      placeholder={language == "ar" ? "الكميه" : "quantity"}
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر القديم" : "Old Price"}
                    </label>
                    <input
                      name="old_price"
                      onChange={(e) => {
                        hadlechangedata(item, index, e);
                      }}
                      value={item.old_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر القديم" : "Old Price"
                      }
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر الجديد" : "New Price"}
                    </label>
                    <input
                      name="new_price"
                      onChange={(e) => {
                        hadlechangedata(item, index, e);
                      }}
                      value={item.new_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر الجديد" : "New Price"
                      }
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر النهائي" : "Maximum Price"}
                    </label>
                    <input
                      name="min_price"
                      onChange={(e) => {
                        hadlechangedata(item, index, e);
                      }}
                      value={item.min_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر النهائي" : "Maximum Price"
                      }
                    />

                    <label htmlFor="">
                      {language == "ar" ? "معدل النقصان " : "Price Rate"}
                    </label>
                    <input
                      name="rate_price"
                      onChange={(e) => {
                        hadlechangedata(item, index, e);
                      }}
                      value={item.rate_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "معدل النقصان" : "Price Rate"
                      }
                    />
                  </div>
                );
              })}
            </div>
            <label htmlFor="shippingstatus">
              {language == "ar" ? "جعل التوصيل مجاني" : "Make Free Shipping"}
            </label>
            <input
              type="checkbox"
              name="shippingstatus"
              id="shippingstatus"
              onChange={(e) => {
                setShippingStatus(e.target.checked);
              }}
            />

            <label htmlFor="">
              {language == "ar"
                ? "سوف يتم توفيره فى وقت"
                : "Will Avilable After"}
            </label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker onChange={(e) => setwill_av_after(e?._d)} />
            </LocalizationProvider>
            <label htmlFor="">
              {language == "ar" ? "سوف يتم توفيره لوقت" : "Will Avilable For"}
            </label>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker onChange={(e) => setwill_av_for(e?._d)} />
            </LocalizationProvider>
            <button>
              {addloading ? <Loader /> : language == "ar" ? "إضافه" : "Add"}
            </button>
          </form>
        </div>
      ) : null}
      {showcopy ? (
        <div className="edit_model copy_modal add_model from_Shipping_div">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setshowcopy(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              hanldecopy();
            }}
            className="formaddproduct offerformproduct"
          >
            <div
              style={{
                display: "flex",
                gap: "4px",
                alignItems: "center",
                width: "fit-content",
                justifyContent: "center"
              }}
            >
              <p style={{ width: "fit-content" }}>
                {language == "ar" ? "نفس العرض" : "the same"}
              </p>
              <Switch
                style={{ width: "6px" }}
                checked={status}
                onChange={() => {
                  setstatus(!status);
                }}
              />
              <p style={{ width: "fit-content" }}>
                {language == "ar" ? "جديد" : "new"}
              </p>
            </div>
            <label htmlFor="">{language == "ar" ? "المخزن" : "Store"}</label>
            <select
              value={copiedrecord.store}
              style={{
                width: "100%",
                marginBottom: "10px"
              }}
              onChange={(e) => {
                setcopiedrecord({ ...copiedrecord, store: e.target.value });
              }}
            >
              {[
                {
                  value: "uae",
                  label: language == "ar" ? "الامارات" : "The UAE"
                },
                {
                  value: "ksa",
                  label: language == "ar" ? "السعوديه" : "Saudi Aribia"
                }
                // {
                //   value: 'uae***ksa',
                //   label:
                //     language == 'ar'
                //       ? "الامارات و السعوديه"
                //       : "The UAE and Saudi Aribia"
                // }
              ].map((item) => {
                return <option value={item.value}>{item.label}</option>;
              })}
            </select>
            <label htmlFor="">
              {language == "ar" ? "المنتج" : "The Product"}
            </label>
            <input
              disabled={true}
              value={copiedproducttitle}
              style={{ marginBottom: "10px" }}
              placeholder={
                language == "ar"
                  ? "إذا بحثت برقم المنتج أضف علامة # قبلها"
                  : "If you search by product number, add a # sign before it"
              }
              type="text"
              onChange={(e) => {
                setcopiedproducttitle(e.target.value);
                if (e.target.value.length >= 2) {
                  handlesearchproduct(e.target.value);
                  // console.log(e.target.value)
                }
              }}
            />

            <div className="possibilities">
              {copiedpossibilities?.map((item, index) => {
                return (
                  <div>
                    <h4>
                      {language == "ar"
                        ? item.color_label_ar
                        : item.color_label}
                    </h4>
                    <p>
                      {language == "ar"
                        ? item.prop_value_label_ar
                        : item.prop_value_label}
                    </p>
                    <label htmlFor="">
                      {language == "ar" ? "الكميه" : "Quantity"}
                    </label>
                    <input
                      disabled={!status}
                      name="stock"
                      onChange={(e) => {
                        handlechangecopieddata(item, index, e);
                      }}
                      value={item.stock}
                      type="text"
                      placeholder={language == "ar" ? "الكميه" : "quantity"}
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر القديم" : "Old Price"}
                    </label>
                    <input
                      name="old_price"
                      onChange={(e) => {
                        handlechangecopieddata(item, index, e);
                      }}
                      value={item.old_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر القديم" : "Old Price"
                      }
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر الجديد" : "New Price"}
                    </label>
                    <input
                      name="new_price"
                      onChange={(e) => {
                        handlechangecopieddata(item, index, e);
                      }}
                      value={item.new_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر الجديد" : "New Price"
                      }
                    />
                  </div>
                );
              })}
            </div>
            <label htmlFor="shippingstatus">
              {language == "ar" ? "جعل التوصيل مجاني" : "Make Free Shipping"}
            </label>
            <input
              type="checkbox"
              name="shippingstatus"
              id="shippingstatus"
              onChange={(e) => {
                setcopiedrecord({
                  ...copiedrecord,
                  shippingstatus: e?.target?.checked
                });
              }}
            />
            <label htmlFor="">
              {language == "ar" ? "متوفر من" : "avilable after"}
            </label>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                disabled={!status}
                onChange={(e) => {
                  setcopiedrecord({
                    ...copiedrecord,
                    will_av_after: e?._d
                  });
                }}
              />
            </LocalizationProvider>
            <label htmlFor="">
              {language == "ar" ? "متوفر لوقت" : "avilable for"}
            </label>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateTimePicker
                disabled={!status}
                onChange={(e) => {
                  setcopiedrecord({
                    ...copiedrecord,
                    will_av_for: e?._d
                  });
                }}
              />
            </LocalizationProvider>
            <button>
              {addloading ? <Loader /> : language == "ar" ? "نسخ" : "Copy"}
            </button>
          </form>
        </div>
      ) : null}
      {showEditForm ? (
        <div className="edit_model add_model from_Shipping_div">
          <div
            style={{ cursor: "pointer", fontSize: "24px" }}
            className="closeModel"
            onClick={() => {
              setShowEditForm(false);
            }}
          >
            <Icon icon="line-md:close-small" />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="formaddproduct offerformproduct"
          >
            <label htmlFor="">{language == "ar" ? "المخزن" : "Store"}</label>
            <Select
              value={copiedrecord.store}
              disabled
              style={{
                width: "100%",
                marginBottom: "10px",
                color: "white"
              }}
            />
            <label htmlFor="">
              {language == "ar" ? "المنتج" : "The Product"}
            </label>
            <input
              disabled={true}
              value={copiedproducttitle}
              style={{ marginBottom: "10px" }}
              placeholder={
                language == "ar"
                  ? "إذا بحثت برقم المنتج أضف علامة # قبلها"
                  : "If you search by product number, add a # sign before it"
              }
              type="text"
            />

            <div className="possibilities">
              {copiedpossibilities?.map((item, index) => {
                return (
                  <div>
                    <h4>
                      {language == "ar"
                        ? item.color_label_ar
                        : item.color_label}
                    </h4>
                    <p>
                      {language == "ar"
                        ? item.prop_value_label_ar
                        : item.prop_value_label}
                    </p>
                    <label htmlFor="">
                      {language == "ar" ? "الكميه" : "Quantity"}
                    </label>
                    <input
                      disabled
                      name="stock"
                      value={item.stock}
                      type="text"
                      placeholder={language == "ar" ? "الكميه" : "quantity"}
                    />
                    <label htmlFor="">
                      {language == "ar"
                        ? " الكمية المتبقية"
                        : "ٌRemainig Quantity"}
                    </label>
                    <input
                      disabled
                      name="stock"
                      value={item.remainig_stock}
                      type="text"
                      placeholder={language == "ar" ? "الكميه" : "quantity"}
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر القديم" : "Old Price"}
                    </label>
                    <input
                      name="old_price"
                      value={item.old_price}
                      disabled
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر القديم" : "Old Price"
                      }
                    />
                    <label htmlFor="">
                      {language == "ar" ? "السعر الجديد" : "New Price"}
                    </label>
                    <input
                      disabled
                      name="new_price"
                      value={item.new_price}
                      type="text"
                      placeholder={
                        language == "ar" ? "السعر الجديد" : "New Price"
                      }
                    />
                  </div>
                );
              })}
            </div>
            {/* <label htmlFor="">
              {language == 'ar' ? "متوفر من" : "avilable after"}
            </label>
            <input
              disabled
              style={{ minHeight: '50px' }}
              type="date"
              value={item.will_av_after}
            />
            <label htmlFor="">
              {language == 'ar' ? "متوفر لوقت" : "avilable for"}
            </label>
            <input
              disabled
              style={{ minHeight: '50px' }}
              value={item.will_av_for}
              type="date"
            /> */}
          </form>
        </div>
      ) : null}
      {showconfstop ? (
        <div className="confstop">
          <p>
            {language == "ar"
              ? "هل تريد حقا إيقاف هذا العرض"
              : "Do you really want to stop this offer?"}
          </p>
          <div className="actions">
            <button
              disabled={stoploading}
              onClick={() => {
                handlestopoffer();
              }}
              className="btn btn-primary"
            >
              {stoploading ? <Loader /> : language == "ar" ? "نعم" : "Yes"}
            </button>
            <button
              onClick={() => {
                setshowconfstop(false);
              }}
              className="btn btn-danger"
            >
              لا
            </button>
          </div>
        </div>
      ) : null}

      {showconfarchive ? (
        <div className="confstop">
          <p>
            {language == "ar"
              ? "هل تريد حقا أرشفة هذا العرض"
              : "Do you really want to Archive this offer?"}
          </p>
          <div className="actions">
            <button
              disabled={stoploading}
              onClick={() => {
                handleArchiveOffer();
              }}
              className="btn btn-primary"
            >
              {stoploading ? <Loader /> : language == "ar" ? "نعم" : "Yes"}
            </button>
            <button
              onClick={() => {
                setshowconfarchive(false);
              }}
              className="btn btn-danger"
            >
              {stoploading ? <Loader /> : language == "ar" ? "لا" : "No"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OfferProducts;
