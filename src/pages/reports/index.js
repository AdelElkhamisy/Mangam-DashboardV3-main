import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
// import Table from "../../components/table";
import "./style.css";
import { getReport, getReports } from "../addition/functions";
import ReportModel from "./orderModel";
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
import PopUp from "./popup";
function Reports() {
  const [reqcheck, setreqcheck] = useState(false);
  const [data, setData] = useState([]);
  const [orderData, setReportData] = useState([]);
  const [showReportData, setShowReportData] = useState(false);
  const [showEditReportData, setShowEditReportData] = useState(false);
  const [Edditted, setEdditted] = useState(false);
  const [showchangestatus, setshowchangestatus] = useState(false);
  const [showorderdata, setshoworderdata] = useState(false);
  const [timefilter, settimefilter] = useState("");
  const getReport = ({ item }) => {
    setShowReportData(true);
    setReportData(item);
    setShowEditReportData(false);
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
  const [ordersLoading, setReportsLoading] = useState(false);
  const getorders = async () => {
    setReportsLoading(true);
    await axios
      .get("https://api.manjam.shop/v3/order/getAllReports")
      .then((res) => {
        setData(res?.data?.message);
      })
      .finally(() => {
        setReportsLoading(false);
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
  const getReportId = ({ item }) => {
    setShowReportData(false);
    setShowEditReportData(true);
    setReportData(item);
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
          userId: item.userId || ""
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

  const relpy = (id) => {
    axios
      .post("https://api.manjam.shop/v3/order/replyReport", {
        report_id: showchangestatus
      })
      .then((res) => {
        if (res.data.status) {
          alert("Changed");
          setshowchangestatus(false);
          setEdditted(!Edditted);
          getorders();
          setshowchangestatus(false);
        } else {
          alert(res.data.message);
        }
      });
  };

  const columns = [
    {
      title: language == "ar" ? "رقم الشكوى" : "Id",
      dataIndex: "id"
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
      }
    },
    {
      title: language == "ar" ? "رقم التليفون " : "User Phone",
      key: "user_phone",
      render: (_, record) => {
        // console.log(record)
        return <a href={"tel:" + record?.user_phone}>{record?.user_phone}</a>;
      }
    },

    {
      title: language == "ar" ? "اسم الشخص" : "User Name",
      key: "user_name",
      render: (_, record) => {
        // console.log(record)
        return <a href={"#"}>{record?.user_name}</a>;
      }
    },

    {
      title: language == "ar" ? "البريد الالكتروني" : "User Email",
      key: "user_email",
      render: (_, record) => {
        // console.log(record)
        return <a href={"mailto:" + record?.user_emai}>{record?.user_email}</a>;
      }
    },

    {
      title: language == "ar" ? "معرف المستخدم" : "User Id",
      dataIndex: "user_id"
    },

    {
      title: language == "ar" ? "الحاله" : "Status",
      key: "status",
      render: (_, record) => {
        // console.log(record)
        return (
          <p className={record.reed ? "تم الرد" : "لم يتم الرد"}>
            {record.reed ? "تم الرد" : "لم يتم الرد"}
          </p>
        );
      }
    },

    {
      title: language == "ar" ? "عرض" : "Show",
      key: "show",
      render: (_, record) => {
        return (
          <button
            onClick={() => {
              setrecorddata(
                (prev) =>
                  record?.order && record?.order?.length && record?.order[0]
              );
              setShowReportData(record);
            }}
            className="btn btn-primary"
          >
            {language == "ar" ? "عرض" : "Show"}
          </button>
        );
      }
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
                setshowchangestatus(record.id);
              }}
              style={{ width: "30px", cursor: "pointer" }}
              src={require("../../assets/images/chnage.png")}
              alt=""
            />
          </div>
        );
      }
    }

    // deliveryAddress
  ];
  const closeEdit = () => {
    setshowchangestatus(false);
    setReportData(false);
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
      setReportData(getdataOriginal);
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
              head={language == "ar" ? "سجل الشكاوي" : "Report List"}
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
                justifyContent: "space-between"
              }}
            >
              <input
                type="text"
                placeholder={
                  language == "ar" ? "بحث فى الشكاوي" : "Search In Reports"
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
              {/* <button
                onClick={() => {
                  handleexport1();
                }}
                className="btn btn-primary"
              >
                {language == "ar" ? "تصدير" : "Export"}
              </button> */}
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px",
                justifyContent: "space-between",
                width: "100%"
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
            <PopUp
              open={showchangestatus}
              setOpen={() => null}
              title={language == "ar" ? "الرد على الشكوى" : "Reply On Report"}
            >
              <h2>{language == "ar" ? "تم الرد " : "Answered"}</h2>
              <button onClick={() => relpy()} className="btn btn-success">
                {language == "ar" ? "تأكيد" : "Confirm"}
              </button>
            </PopUp>
          </div>
        }
      />
      {console.log(recorddata)}
      {showReportData ? (
        <ReportModel
          data={recorddata}
          items={recorddata}
          showReportData={showReportData}
          closeModel={() => {
            setshoworderdata(false);
            setshoworderdata(false);
            setShowReportData(false);
          }}
        />
      ) : null}
    </div>
  );
}

export default Reports;
