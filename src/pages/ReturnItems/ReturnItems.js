import React, { useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import DateFilterBox from "../../components/filter";
import SearchBox from "../../components/searchBox";
import { Card, Col, Table } from "antd";
import axios from "axios";
import moment from "moment";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Icon } from "@iconify/react";
import lodash from "lodash/lodash";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import "./returnitems.css";
import * as XLSX from "xlsx";
import OrderModel from "../Order_History/orderModel";
const ReturnItems = () => {
  const language = useSelector((state) => state.language.lang);
  const [data, setData] = useState([]);
  const [recorddata, setrecorddata] = useState({});
  const [showOrderData, setshowOrderData] = useState(false);
  const [query, setQuery] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [showmodel, setshowmodel] = useState(false);
  const [orderData, setorderData] = useState({});
  const [newstatus, setnewstatus] = useState("");
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const [statusfilter, setstatusfilter] = useState("all");
  const [timefilter, settimefilter] = useState("");
  const [todate, settodate] = useState("");

  const handlechange = (id) => {
    let allOrders = [...returnItems];
    for (let i = 0; i < allOrders?.length; i++) {
      if (allOrders[i].id == id) {
        allOrders[i].checked = !allOrders[i].checked;
      } else {
        allOrders[i].checked = allOrders[i].checked;
      }
      // else {
      //   allOrders[i].order.checked=false;
      // }
    }
    setReturnItems(allOrders);
  };

  const columns = [
    {
      title: language == "ar" ? "*" : "Id",
      dataIndex: "id",
    },
    {
      title: language == "ar" ? "إسم المنتج" : "Product Name",
      key: "product_label",
      render: (_, record) => {
        // console.log(record?.order?.product_label);
        return <p>{record?.order?.product_label}</p>;
      },
    },
    {
      title: language == "ar" ? "التاريخ" : "Date",
      render: (_, record) => {
        // console.log(record);
        return (
          <span>
            {moment(record?.order?.createdAt).format("YYYY-MM-DD hh:mm:ss")}
          </span>
        );
      },
    },
    {
      title: language == "ar" ? "وسيلة الشحن" : "Shipping Method",
      key: "Shipping_type",
      render: (_, record) => {
        return <p>{record?.order?.shipping[0]?.shipping_title}</p>;
      },
    },
    {
      title: language == "ar" ? "وسيلة الدفع" : "Payment Method",
      key: "Shipping_type",
      render: (_, record) => {
        return <p>{record?.order?.payment_method}</p>;
      },
    },
    {
      title: language == "ar" ? "الكمية المسترجعة" : "Returned Quantity",
      key: "returned_quantity",
      render: (_, record) => {
        return <p>{record?.quantity}</p>;
      },
    },
    {
      title: language == "ar" ? "السعر الكلى" : "Total Price",
      key: "total_price",
      render: (_, record) => {
        return <p>{record?.price}</p>;
      },
    },
    {
      title: language == "ar" ? "سبب الارجاع" : "return reason",
      key: "reason",
      dataIndex: "reason",
    },
    {
      title: language == "ar" ? "صورة" : "image",
      key: "image",
      render: (_, record) => {
        return <img src={record?.imageLink} height={"50px"} />;
      },
    },
    {
      title: language == "ar" ? "الحالة" : "Status",
      key: "status",
      render: (_, record) => {
        return (
          <p
            className={
              record.status == "return requested"
                ? "itemstatus status pending"
                : record.status == "Return Confirmed"
                ? "approved itemstatus"
                : record.status == "underchacking"
                ? "itemstatus status underchacking"
                : record.status == "captain on the way"
                ? "itemstatus status on_way"
                : "rejected itemstatus"
            }
          >
            {record.status}
          </p>
        );
      },
    },
    {
      title: language == "ar" ? "أوامر" : "Actions",
      key: "actions",
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              setshowmodel(true);
              setorderData(record);
            }}
            className="btn btn-primary"
          >
            {updateloading ? <Loader /> : language == "ar" ? "تغيير" : "change"}
          </button>
        );
      },
    },
    // {
    //   title: language == 'ar' ? "عرض" : "Show",
    //   key: 'Show',
    //   render: (_, record) => {
    //     return (
    //       <button
    //         onClick={() => {
    //           setrecorddata(record.order);
    //           setshowOrderData(true);
    //         }}
    //         className="btn btn-primary"
    //       >
    //         {language == 'ar' ? "عرض" : "Show"}
    //       </button>
    //     );
    //   }
    // },
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
              cursor: "pointer",
            }}
            checked={record.checked}
            type="checkbox"
            name=""
            id=""
          />
        );
      },
    },
    // {
    //   title: "Storage",
    //   dataIndex: "storage",
    // },
    // {
    //   title: language=='ar'?"الأوامر":"actions",
    //   key:"actions",
    //   render:(_,record)=>{
    //     return(
    //       <div>
    //         <img onClick={()=>{

    //         }} style={{ width:'30px' ,cursor:'pointer'}} src={require("../../assets/images/chnage.png")} alt="" />
    //       </div>
    //     )
    //   }
    // },
    // deliveryAddress
  ];
  const [reqcheck, setreqcheck] = useState(false);
  const [updateloading, setupdateloading] = useState(false);
  const [searchTxt, setSearchTxt] = useState("");

  const handlechangestatus = () => {
    // console.log(orderData)
    setupdateloading(true);
    const data_send = {
      order_id: orderData.order.id,
      user_id: "11",
      status: newstatus,
      return_id: orderData.id,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/return/updateStatus", data_send)
      .then((res) => {
        // console.log(res.data.message);
        if (res.data.status == 1) {
          toast.success("Updated");
          getreturneditems();
          setshowmodel(false);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setupdateloading(false);
      });
  };

  const [returnItems, setReturnItems] = useState([]);
  const [returnLoading, setReaturnLoading] = useState(false);
  const getreturneditems = async () => {
    setReaturnLoading(true);
    await axios
      .post(
        "https://api.manjam.shop/v3/return/getReturns",
        {
          type: "admin",
        },
        { timeout: 8989898989 }
      )
      .then((res) => {
        // console.log(res.data.message);
        let alldata = [...res.data.message];
        let newdata = [];
        newdata = alldata.map((item, index) => {
          item.checked = false;
          // console.log(item);
        });
        for (let i = 0; i < alldata?.length; i++) {
          alldata[i].checked = false;
        }
        if (Array.isArray(res.data.message)) {
          setReturnItems(res.data.message);
          setReturnItems(alldata);
        }
        setgetdataOriginal(res.data.message);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setReaturnLoading(false);
      });
  };

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setReturnItems(filteredData);
  }
  const contains = (items, query) => {
    const { order, order_date, status, id } = items;
    if (
      order.product_label?.toLowerCase().includes(query) ||
      order_date?.toLowerCase().includes(query) ||
      order?.payment_method?.toLowerCase().includes(query) ||
      status?.toLowerCase().includes(query) ||
      id == query
    ) {
      return true;
    }
    return false;
  };

  const handleexport1 = () => {
    const pp = [];
    returnItems.map((item, index) => {
      // console.log(item)
      if (item.order.checked === true) {
        let newobj = {
          id: item.id || "",
          address: item.order.address || "",
          title: item.order.products[0].title || "",
          title_ar: item.order.products[0].title_ar || "",
          return_Price: item.price || "",
          quantity: item.quantity || "",
          return_date: moment(item.createdAt).format("L") || "",
          status: item.status || "",
          Reason: item.reason || "",
          Reason_image: item.imageLink || "",
        };
        for (let i = 0; i < item.order.products[0]?.colors.length; i++) {
          newobj[`color${i + 1}`] =
            item.order.products[0]?.colors[i].color || "";
          newobj[`color_ar${i + 1}`] =
            item.order.products[0]?.colors[i].color_ar || "";
          for (
            let j = 0;
            j < item.order.products[0]?.colors[i].images.length;
            j++
          ) {
            newobj[`images ${j + 1}`] =
              item.order.products[0]?.colors[i].images[j].link;
            // console.log(item?.colors[i].images[j].link)
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

  useEffect(() => {
    getreturneditems();
  }, []);
  const filterstatus = () => {
    // console.log(statusfilter)
    let alldata = [...getdataOriginal];
    // console.log(data);
    if (statusfilter == "all") {
      setReturnItems(getdataOriginal);
    } else {
      setReturnItems(alldata.filter((item) => item.status == statusfilter));
    }
  };

  // const filterbydate=()=>{
  //   let alldata=[...getdataOriginal];
  //   setReturnItems(alldata.filter(item=>moment(item.createdAt).format("L")>=moment(timefilter).format("L")))
  // }
  // useEffect(()=>{
  //   filterbydate();
  // },[timefilter])

  useEffect(() => {
    filterstatus();
  }, [statusfilter]);

  // useEffect(()=>{
  //   console.log("timefilter")
  //   let alldata=[...getdataOriginal];
  //   if(timefilter==""){
  //     console.log("timefilter is empty")
  //     if(todate==""){
  //     console.log("todate is empty")
  //       setReturnItems(getdataOriginal)
  //     }
  //     else {
  //     console.log("timefilter is not empty")
  //       setReturnItems(alldata.filter(item=>moment(item.createdAt).format("L")<=moment(todate).format("L")))
  //     }
  //   }
  //   else {
  //     console.log("timefilter is not empty")
  //     if(todate==""){
  //     console.log("todate is empty")
  //       setReturnItems(alldata.filter(item=>moment(item.createdAt).format("L")>=moment(timefilter).format("L")))
  //     }
  //     else {
  //     console.log("todate is not empty")
  //     setReturnItems(alldata.filter(item=>(item=>moment(item.createdAt).format("L")<=moment(todate).format("L"))&&(item=>moment(item.createdAt).format("L")>=moment(timefilter).format("L"))))
  //     }
  //   }
  // },[timefilter])

  // useEffect(()=>{
  //   console.log("todate")
  //   let alldata=[...getdataOriginal];
  //   if(todate==""){
  //     console.log("todate is empty")
  //     if(timefilter==""){
  //     console.log("timefilter is empty")
  //       setReturnItems(getdataOriginal)
  //     }
  //     else {
  //     console.log("timefilter is not empty")
  //       setReturnItems(alldata.filter(item=>moment(item.createdAt).format("L")>=moment(timefilter).format("L")))
  //     }
  //   }
  //   else{
  //     console.log("todate is not empty")
  //     if(timefilter==""){
  //     console.log("timefilter is empty")
  //       setReturnItems(alldata.filter(item=>moment(item.createdAt).format("L")<=moment(todate).format("L")))
  //     }
  //     else {
  //     console.log("timefilter is not empty")
  //     setReturnItems(alldata.filter(item=>((item=>moment(item.createdAt).format("L")<=moment(todate).format("L"))&&(item=>moment(item.createdAt).format("L")>=moment(timefilter).format("L")))))
  //     }
  //   }
  // },[todate])

  useEffect(() => {
    let alldata = [...getdataOriginal];
    if (timefilter == "" && todate == "") {
      setReturnItems(alldata);
    } else if (timefilter == "" && todate !== "") {
      setReturnItems(
        alldata.filter(
          (item) =>
            moment(item.order.createdAt).format("L") <=
            moment(todate).format("L")
        )
      );
    } else if (timefilter !== "" && todate == "") {
      setReturnItems(
        alldata.filter(
          (item) =>
            moment(item.order.createdAt).format("L") >=
            moment(timefilter).format("L")
        )
      );
    } else if (timefilter !== "" && todate != "") {
      // console.log("ew");
      setReturnItems(
        alldata.filter(
          (item) =>
            moment(item.order.createdAt).format("L") >=
              moment(timefilter).format("L") &&
            moment(item.createdAt).format("L") <= moment(todate).format("L")
        )
      );
    }
  }, [timefilter, todate]);
  if (showmodel) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "visible";
  }
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs">
            <ContentNav
              head={language == "ar" ? "المنتجات المرتجعة" : "Returned Items"}
            />
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
                gap: "10px",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <input
                type="text"
                placeholder={
                  language == "ar" ? "بحث فى المسترحعات" : "Search In Returns"
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
                  outline: "none",
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
                margin: "10px 0px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setreqcheck(!reqcheck);
                    if (reqcheck == true) {
                      setData(
                        data.map((item) => {
                          return { ...item, checked: false };
                        })
                      );
                    } else {
                      setData(
                        data.map((item) => {
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
              <div style={{ width: "200px" }}>
                <select
                  onChange={(e) => {
                    setstatusfilter(e.target.value);
                  }}
                  name=""
                  id=""
                >
                  <option value="all">
                    {language == "ar" ? "الكل" : "All"}
                  </option>
                  <option value="return requested">
                    {language == "ar" ? "تم طلب الارجاع" : "return requested"}
                  </option>
                  <option value="underchacking">
                    {language == "ar" ? "تحت الفحص" : "underchacking"}
                  </option>
                  <option value="Return Confirmed">
                    {language == "ar" ? "تمت الموافقه" : "Return Confirmed"}
                  </option>
                  <option value="out for delivery">
                    {language == "ar" ? "مرفوض" : "out for delivery"}
                  </option>
                  {/* <option value="canceled">{language=='ar'?"مرفوض":"canceled"}</option> */}
                </select>
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
            </div>

            {!returnLoading ? (
              <Table
                columns={columns}
                dataSource={returnItems}
                classess={["table-tc"]}
              />
            ) : (
              [1, 2, 3].map((x) => (
                <Col xs={24} md={24} lg={24} key={x}>
                  <Card loading minHeight={200} />
                </Col>
              ))
            )}
            {showmodel ? (
              <div className="edit_model">
                <div
                  style={{ cursor: "pointer", fontSize: "24px" }}
                  className="closeModel"
                  onClick={() => {
                    setshowmodel(false);
                  }}
                >
                  <Icon icon="line-md:close-small" />
                </div>
                {language == "ar"
                  ? "تعديل حالة طلب الاسترجاع "
                  : "Edit Return Status"}{" "}
                <form
                  id="order-status-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlechangestatus();
                  }}
                >
                  <label
                    onClick={() => {
                      setnewstatus("return requested");
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="return requested"
                    />
                    <span
                      id="pending"
                      onClick={() => {
                        // setnewstatus("pending")
                      }}
                    >
                      {" "}
                      return requested
                    </span>
                  </label>
                  <label
                    onClick={() => {
                      setnewstatus("captain on the way");
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="captain on the way"
                    />
                    <span id="onWay"> captain on the way</span>
                  </label>
                  <label
                    onClick={() => {
                      setnewstatus("underchacking");
                    }}
                  >
                    <input type="radio" name="status" value="underchacking" />
                    <span id="underchacking"> underchacking</span>
                  </label>
                  <label
                    onClick={() => {
                      setnewstatus("out for delivery");
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="out for delivery"
                    />
                    <span id="out_for_delivery"> Return Rejected</span>
                  </label>
                  <label
                    onClick={() => {
                      setnewstatus("Return Confirmed");
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="Return Confirmed"
                    />
                    <span id="Return_Confirmed"> Return Confirmed</span>
                  </label>

                  <button type="submit">
                    {updateloading ? (
                      <Loader />
                    ) : language == "ar" ? (
                      "تعديل"
                    ) : (
                      "Edit"
                    )}
                  </button>
                </form>
              </div>
            ) : null}
            {/* {showOrderData ? (
              <OrderModel
                data={recorddata.order}
                items={recorddata.order}
                closeModel={() => {
                  setshowOrderData(false);
                }}
              />
            ) : null} */}
          </div>
        }
      />
    </div>
  );
};

export default ReturnItems;
