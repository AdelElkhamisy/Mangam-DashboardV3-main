import React from "react";
import "./style.css";
import { getStatic } from "./functions";
import { useState } from "react";
import { useEffect } from "react";
import HeaderStatic from "./headerStatic";
import Staticsec from "./staticsec";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  ArcElement,
  Filler,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
function ProfuctsStatic2() {
  const [statics, setStatics] = useState(false);
  const [allReturns, setallReturns] = useState({});
  const [approvedReturns, setapprovedReturns] = useState({});
  const [pendingOrders, setpendingOrders] = useState({});
  const [rejectedReturns, setrejectedReturns] = useState({});
  const [dataPrice, setDataPrice] = useState([]);

  ChartJS.register(ArcElement, Tooltip, Legend);
  useEffect(() => {
    getStatic({ setStatics });
  }, []);
  const getstatistics = () => {
    axios
      .get("https://api.manjam.shop/v3/site/info/stats?type=admin")
      .then((res) => {
        // console.log(res.data.message);
        let alldatacharts = data2;
        // console.log(alldatacharts)
        let alldata = res.data.message.returnsStats;
        setallReturns(res.data.message.returnsStats.allReturns);
        setpendingOrders(res.data.message.returnsStats.pendingreturns);
        setapprovedReturns(res.data.message.returnsStats.approvedReturns);
        setrejectedReturns(res.data.message.returnsStats.rejectedReturns);
        alldatacharts.datasets[0].data[0] = alldata.allReturns.number;
        alldatacharts.datasets[0].data[1] = alldata.approvedReturns.number;
        alldatacharts.datasets[0].data[2] = alldata.rejectedReturns.number;
        alldatacharts.datasets[0].data[3] = alldata.pendingreturns.number;
        setDataPrice([
          alldata.allReturns.number,
          alldata.approvedReturns.number,
          alldata.rejectedReturns.number,
          alldata.pendingreturns.number,
        ]);
        setdata2(alldatacharts);
        // console.log(alldatacharts)
      });
  };
  useEffect(() => {
    getstatistics();
  }, []);
  const [data2, setdata2] = useState({
    labels: ["all", "approved", "pending", "rejected"],
    datasets: [
      {
        label: "# of items",
        data: dataPrice,
        backgroundColor: [
          "rgba(25, 206, 86, 1)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(25, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });
  useEffect(() => {
    setdata2({
      labels: ["all", "approved", "rejected", "pending"],
      datasets: [
        {
          label: "# of items",
          data: dataPrice,
          backgroundColor: [
            "rgba(25, 206, 86, 1)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
          ],
          borderColor: [
            "rgba(25, 206, 86, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
          ],
          borderWidth: 1,
        },
      ],
    });
  }, [dataPrice]);
  const language = useSelector((state) => state.language.lang);
  return (
    <div className="ProfuctsStatic static">
      <HeaderStatic
        name={language == "ar" ? "حالات الطلبات المرتجعة" : "Return Stats"}
        src={
          "https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689329639/My%20Folder/public/Bag_sw5h1n.svg"
        }
      />
      <div className="stitics_sc">
        <Staticsec
          name={language == "ar" ? "كل المسترجعات" : "All Returns"}
          number={allReturns.number}
          percentage={allReturns?.percentage?.toFixed(2) || 0}
        />
        <Staticsec
          name={language == "ar" ? " الطلبات المعلقة" : "Canceled Returns"}
          number={pendingOrders.number}
          percentage={pendingOrders?.percentage?.toFixed(2) || 0}
        />
        <Staticsec
          name={language == "ar" ? "الطلبات الموافق عليها" : "Approved Returns"}
          number={approvedReturns.number}
          percentage={approvedReturns?.percentage?.toFixed(2) || 0}
        />
        <Staticsec
          name={language == "ar" ? "الطلبات المرفوضة" : "Rejected Returns"}
          number={rejectedReturns.number}
          percentage={rejectedReturns?.percentage?.toFixed(2) || 0}
        />
      </div>
      <div>
        <Doughnut data={data2} />
      </div>
    </div>
  );
}

export default ProfuctsStatic2;
