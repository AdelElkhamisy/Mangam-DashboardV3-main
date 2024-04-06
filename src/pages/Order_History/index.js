import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
// import Table from "../../components/table";
import "./style.css";
import { getOrder, getOrders } from "../addition/functions";
import OrderModel from "./orderModel";
import lodash from "lodash/lodash";
import "./style.css";
import { Icon } from "@iconify/react";
import { updateStatus } from "./functions";
import DateFilterBox from "../../components/filter";
import SearchBox from "../../components/searchBox";
import { Card, Col, Table } from "antd";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { Loader } from "rsuite";
function Order_History() {
  const [reqcheck, setreqcheck] = useState(false);
  const [data, setData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [showOrderData, setShowOrderData] = useState(false);
  const [showEditOrderData, setShowEditOrderData] = useState(false);
  const [Edditted, setEdditted] = useState(false);
  const [showchangestatus, setshowchangestatus] = useState(false);
  const [showorderdata, setshoworderdata] = useState(false);
  const [timefilter, settimefilter] = useState("");
  const getOrder = ({ item }) => {
    setShowOrderData(true);
    setOrderData(item);
    setShowEditOrderData(false);
  };
  const [query, setQuery] = useState(false);
  const [dateFilter, setDateFilter] = useState(false);
  const [newstatus, setnewstatus] = useState("");
  const [id, setid] = useState("");
  const [getdataOriginal, setgetdataOriginal] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");
  const [recorddata, setrecorddata] = useState({});
  const [filteritem, setfilteritem] = useState("all");
  const [datefilter, setdatefilter] = useState("");
  const [statusfilter, setstatusfilter] = useState("all");
  const [ordersLoading, setOrdersLoading] = useState(false);
  const getorders = async () => {
    setOrdersLoading(true);
    await axios
      .post("https://api.manjam.shop/v3/order/getAll?type=admin")
      .then((res) => {
        console.log(res.data);
        if (Array.isArray(res.data.message)) {
          setData(
            res?.data?.message?.map((item, index) => {
              return { ...item, checked: false };
            })
          );
          res?.data?.message?.map((item) => {
            item.totalPrice =
              item?.orderItems && item?.orderItems?.length
                ? item.orderItems.reduce((acc, currentValue) => {
                    return acc + parseInt(currentValue.single_price);
                  }, 0)
                : 0;
          });
          setData(
            dateFilter || query
              ? res.data.message.filter((item) =>
                  dateFilter && query
                    ? item.date >= dateFilter &&
                      item?.deliveryAddress?.includes(query)
                    : dateFilter || query
                    ? item.date >= dateFilter ||
                      item?.deliveryAddress?.includes(query)
                    : res.data
                )
              : res.data.message
          );
          setgetdataOriginal(
            dateFilter || query
              ? res.data.message.filter((item) =>
                  dateFilter && query
                    ? item.date >= dateFilter &&
                      item?.deliveryAddress?.includes(query)
                    : dateFilter || query
                    ? item.date >= dateFilter ||
                      item?.deliveryAddress?.includes(query)
                    : res.data
                )
              : res.data.message
          );
        }
      })
      .finally(() => {
        setOrdersLoading(false);
      });
  };
  useEffect(() => {
    getorders();
  }, []);
  useEffect(() => {
    getorders();
  }, [Edditted, query, dateFilter]);

  const language = useSelector((state) => state.language.lang);
  // console.log(language)
  const getOrderId = ({ item }) => {
    setShowOrderData(false);
    setShowEditOrderData(true);
    setOrderData(item);
  };

  const handleexport1 = () => {
    const pp = [];
    data.map((item, index) => {
      if (item.checked === true) {
        let newobj = {
          address: item.address || "",
          grand_price: item.grand_price || "",
          grand_price_with_discount: item.grand_price_with_discount || "",
          payment_method: item.payment_method || "",
          // phone: item.phone,
          product_label: item.product_label || "",
          product_price: item.product_price || "",
          product_total_price: item.product_total_price || "",
          createdAt: moment(item.createdAt).format("L") || "",
          status: item.status || "",
          category_name: item.products[0].category_name || "",
          category_name_ar: item.products[0].category_name_ar || "",
          grade: item.products[0].grade || "",
          hidden: item.products[0].hidden || "",
          isReturned: item.products[0].isReturned == 1 ? true : false,
          model_number: item.products[0].model_number || "",
          price: item.products[0].price || "",
          producing_company: item.products[0].producing_company || "",
          store: item.products[0].store || "",
          payementId: item.payementId || "",
          userId: item.userId || "",
        };
        for (let i = 0; i < item.products[0]?.colors.length; i++) {
          newobj[`color${i + 1}`] = item.products[0]?.colors[i].color || "";
          newobj[`color_ar${i + 1}`] =
            item.products[0]?.colors[i].color_ar || "";
          for (let j = 0; j < item.products[0]?.colors[i].images.length; j++) {
            newobj[`images ${j + 1}`] =
              item.products[0]?.colors[i].images[j].link;
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
    // console.log(orderData);
  }, [orderData]);

  const handlechange = (id) => {
    let allOrders = [...data];
    let pusOrders = allOrders.map((item) => {
      if (item.id == id) {
        return { ...item, checked: !item.checked };
      } else {
        return { ...item };
      }
    });
    setData(pusOrders);
  };

  const columns = [
    {
      title: language == "ar" ? "رقم الطلب" : "Id",
      dataIndex: "id",
    },
    // {
    //   title: language=='ar'?"الدرجه":"Grade",
    //   dataIndex: "grade",
    // },
    {
      title: language == "ar" ? "التاريخ" : "Date",
      render: (_, record) => {
        return (
          <span>{moment(record.createdAt).format("YYYY-MM-DD hh:mm:ss")}</span>
        );
      },
    },
    {
      title: language == "ar" ? "وسيلة الدفع" : "Payment Method",
      dataIndex: "payment_method",
    },
    {
      title: language == "ar" ? "رقم عملية الدفع" : "Payment Id",
      dataIndex: "payementId",
    },
    {
      title: language == "ar" ? "معرف المستخدم" : "User Id",
      dataIndex: "userId",
    },
    {
      title: language == "ar" ? "وسيلة الشحن" : "Shipping Method",
      key: "shipping_method",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.shipping?.title}</span>
          </div>
        );
      },
    },
    {
      title: language == "ar" ? "الحاله" : "Status",
      key: "status",
      render: (_, record) => {
        // console.log(record)
        return (
          <p
            className={
              record.status == "pending" || record.status == "Pending"
                ? "status pending"
                : "status on_way"
            }
          >
            {record.status}
          </p>
        );
      },
    },
    {
      title: language == "ar" ? "سعر الطلب" : "Order Price",
      key: "total_price",
      render: (_, record) => {
        return <p>{record.grand_price}$</p>;
      },
    },
    {
      title: language == "ar" ? "عرض" : "Show",
      key: "show",
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              setrecorddata(record);
              setShowOrderData(true);
            }}
            className="btn btn-primary"
          >
            {language == "ar" ? "عرض" : "Show"}
          </button>
        );
      },
    },
    // {
    //   title: language=='ar'?"التخزين":"Storage",
    //   dataIndex: "storage",
    // },
    {
      title: language == "ar" ? "الاوامر" : "actions",
      key: "actions",
      render: (_, record) => {
        return (
          <div>
            <img
              onClick={() => {
                // console.log(record.order_status);
                // const data_send={
                //   id:record.id,
                //   status:record.order_status=="pending"?"on_way":record.order_status=="on_way"?"completed":"null"
                // }
                // console.log(data_send)
                // axios.post("https://api.manjam.shop/v3/order/changeStatus",JSON.stringify(data_send))
                // .then((res)=>{
                //   console.log(res.data)
                // })
                setid(record.id);
                setshowchangestatus(true);
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/chnage.png")}
              alt=""
            />
          </div>
        );
      },
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
    // deliveryAddress
  ];
  const closeEdit = () => {
    setshowchangestatus(false);
    setOrderData(false);
    setshowchangestatus(false);
  };

  function searchType(e) {
    setSearchTxt(e);
    const formattedQuery = e.toLowerCase();
    const filteredData = lodash.filter(getdataOriginal, (item) => {
      return contains(item, formattedQuery);
    });
    setData(filteredData);
  }
  const contains = (items, query) => {
    const { Status, payment_method, order_date, id } = items;
    if (
      Status?.toLowerCase().includes(query) ||
      payment_method?.toLowerCase().includes(query) ||
      order_date?.toLowerCase().includes(query) ||
      id == query
    ) {
      return true;
    }

    return false;
  };

  const filterdata = (item) => {
    // console.log(item)
    if (item == "all") {
      setOrderData(getdataOriginal);
    }
  };
  // const filterdatabydate=()=>{
  //   let pusheddata=[...getdataOriginal];
  //   console.log(pusheddata)
  //   console.log(moment().format())
  //   let newpusheddata=[];
  //   // console.log(moment(data[0].createdAt).format())
  //   newpusheddata=pusheddata.filter((item,index)=>(moment(item.createdAt).format()>=moment().format()))
  //   console.log(newpusheddata)
  //   setData(newpusheddata)
  // }
  // useEffect(()=>{filterdatabydate()},[datefilter])
  // useEffect(()=>{
  //   filterdata(filteritem)
  // },[filteritem])

  const filterstatus = () => {
    // console.log(statusfilter)
    let alldata = [...getdataOriginal];
    // console.log(data);
    if (statusfilter == "all") {
      setData(getdataOriginal);
    } else {
      setData(alldata.filter((item) => item.status == statusfilter));
    }
  };

  useEffect(() => {
    filterstatus();
  }, [statusfilter]);
  const [toDate, settodate] = useState(false);

  const handlefilterbytime = () => {
    // console.log(timefilter)
    let alldata = [...getdataOriginal];
    console.log("alldata", alldata);
    setData(
      alldata.filter(
        (item) =>
          moment(item.createdAt).format("L") >=
            moment(timefilter).format("L") &&
          moment(item.createdAt).format("L") <= moment(toDate).format("L")
      )
    );
  };

  useEffect(() => {
    handlefilterbytime();
  }, [timefilter, toDate]);
  if (showchangestatus) {
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
              head={language == "ar" ? "سجل الطلبات" : "Order List"}
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
            {/* <DateFilterBox
                setDateFilter={setDateFilter}
                label={"ايجاد الداتا حسب التاريخ"}
              /> */}
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
                  language == "ar" ? "بحث فى الطلبات" : "Search In Orders"
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
                margin: "10px 0px",
                justifyContent: "space-between",
                width: "100%",
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
              {/* <div style={{ width: '200px' }}>
                <input
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    outline: 'none'
                  }}
                  type="date"
                  onChange={(e) => {
                    setdatefilter(e.target.value);
                    settimefilter(e.target.value);
                  }}
                />
              </div> */}

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
                  <option value="pending">
                    {language == "ar" ? "فى الانتظار" : "Pending"}
                  </option>
                  {/* <option value="on_way">
                    {language == 'ar' ? "فى الطريق" : "On Way"}
                  </option> */}
                  {/* <option value="completed">
                    {language == 'ar' ? "مكتمل" : "Compeleted"}
                  </option> */}
                  {/* <option value="canceled">
                    {language == 'ar' ? "مرفوض" : "canceled"}
                  </option> */}
                  <option value="in_progress">
                    {language == "ar" ? "تحت الطلب" : "in progress"}
                  </option>
                  <option value="confirmed">
                    {language == "ar" ? "تمت الموافقه" : "confirmed"}
                  </option>
                  <option value="under_shipping">
                    {language == "ar" ? "فى شركة الشحن" : "under shipping"}
                  </option>
                  <option value="out_for_delivery">
                    {language == "ar"
                      ? "خرج من شركه الشحن"
                      : "out for delivery"}
                  </option>
                  <option value="delivered ">
                    {language == "ar" ? "تم التوصيل" : "Delivered"}
                  </option>
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
            {ordersLoading ? (
              [1, 2, 3].map((x) => (
                <Col xs={24} md={24} lg={24} key={x}>
                  <Card loading minHeight={200} />
                </Col>
              ))
            ) : (
              <Table
                columns={columns}
                dataSource={data}
                classess={["table-tc"]}
              />
            )}
            {/* {showOrderData ? (
              <OrderModel
                data={orderData}
                items={orderData.orderItems}
                closeModel={() => {
                  setOrderData(false);
                  setShowOrderData(false);
                }}
              />
            ) : null} */}
            {showchangestatus ? (
              <div className="edit_model">
                <div
                  style={{ cursor: "pointer", fontSize: "24px" }}
                  className="closeModel"
                  onClick={() => (closeEdit ? closeEdit() : null)}
                >
                  <Icon icon="line-md:close-small" />
                </div>
                {language == "ar" ? "تعديل حالة الطلب" : "Edit Order Status"}

                <form
                  id="order-status-form"
                  onSubmit={(e) => {
                    updateStatus(e, orderData.id, id, {
                      setEdditted,
                      Edditted,
                      setShowEditOrderData,
                      setshowchangestatus,
                    });
                  }}
                >
                  <label>
                    <input type="radio" name="status" value="pending" />
                    <span
                      id="pending"
                      onClick={() => {
                        setnewstatus("pending");
                      }}
                    >
                      {" "}
                      Pending
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="status" value="on_way" />
                    <span id="onWay">On Way</span>
                  </label>
                  <label>
                    <input type="radio" name="status" value="completed" />
                    <span id="completed">Confirmed</span>
                  </label>
                  <label>
                    <input type="radio" name="status" value="canceled" />
                    <span id="canceled">Rejected</span>
                  </label>
                  <label>
                    <input type="radio" name="status" value="in_progress" />
                    <span id="inProgress">In Progress</span>
                  </label>
                  {/* <label>
                    <input type="radio" name="status" value="pending" />
                    <span id="pending">Pending</span>
                  </label> */}
                  {/* <label>
                    <input type="radio" name="status" value="confirmed" />
                    <span id="confirmed">Confirmed</span>
                  </label>
                  <label>
                    <input type="radio" name="status" value="reject" />
                    <span id="reject">Reject</span>
                  </label> */}
                  <label>
                    <input type="radio" name="status" value="under_shipping" />
                    <span id="underShipping">Under Shipping</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="status"
                      value="out_for_delivery"
                    />
                    <span id="outForDelivery">Out for Delivery</span>
                  </label>
                  <label>
                    <input type="radio" name="status" value="delivered" />
                    <span id="delivered">Delivered</span>
                  </label>
                  <button type="submit">
                    {language == "ar" ? "تعديل" : "Edit"}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        }
      />
      {showOrderData ? (
        <OrderModel
          data={recorddata}
          items={recorddata}
          closeModel={() => {
            setshoworderdata(false);
            setshoworderdata(false);
            setShowOrderData(false);
          }}
        />
      ) : null}
    </div>
  );
}

export default Order_History;
