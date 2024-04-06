import React from "react";
import "./style.css";
import { getStatic } from "./functions";
import { useState } from "react";
import { useEffect } from "react";
import HeaderStatic from "./headerStatic";
import Staticsec from "./staticsec";
import axios, { CanceledError } from "axios";
import { useSelector } from "react-redux";
import { Bar, Doughnut, Line, Pie } from "react-chartjs-2";
import { LineChart } from "recharts";
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
  Legend
} from "chart.js";
// import { Line } from 'react-chartjs-2';
import faker from "faker";
function ProfuctsStatic() {
  const [statics, setStatics] = useState(false);
  const [allOrders, setallOrders] = useState({});
  const [completedOrders, setcompletedOrders] = useState({});
  const [canceledOrders, setcanceledOrders] = useState({});
  const [pendingOrders, setpendingOrders] = useState({});
  useEffect(() => {
    getStatic({ setStatics });
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Chart.js Line Chart"
      }
    }
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
  ];

  const [AllNumbers, setAllNumbers] = useState([]);

  const [data2, setdata2] = useState({
    labels: ["allorders", "pending", "COMPLETED", "CANCELED"],
    datasets: [
      {
        label: "# of Votes",
        data: AllNumbers,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)"
        ],
        borderWidth: 1
      }
    ]
  });

  ChartJS.register(ArcElement, Tooltip, Legend);

  const options2 = {
    plugins: {
      legend: true
    },
    scales: {
      y: {}
    }
  };

  useEffect(() => {
    setdata2({
      labels: ["allorders", "pending", "COMPLETED", "CANCELED"],
      datasets: [
        {
          label: "# of items",
          data: AllNumbers,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(25, 206, 86, 1)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(25, 206, 86, 1)"
          ],
          borderWidth: 1
        }
      ]
    });
  }, [AllNumbers]);

  const getstatistics = () => {
    axios
      .get("https://api.manjam.shop/v3/site/info/stats?type=admin")
      .then((res) => {
        // console.log(res.data.message);
        // let alldata=[...res.data.message]
        // for(let i=0;i<alldata;i++){
        //   console.log(alldata[i])
        // }

        let alldata = res.data.message.ordersStats;
        for (const key in alldata) {
          alldata[key]["new_key"] = key;
        }
        // console.log(alldata)
        let alldatacharts = data2;
        // console.log(data2);
        alldatacharts.datasets[0].data[0] = alldata.allOrders.number;
        alldatacharts.datasets[0].data[2] = alldata.canceledOrders.number;
        alldatacharts.datasets[0].data[3] = alldata.pendingOrders.number;
        alldatacharts.datasets[0].data[1] = alldata.completedOrders.number;
        setallOrders(alldata.allOrders);
        setpendingOrders(alldata.pendingOrders);
        setcompletedOrders(alldata.completedOrders);
        setcanceledOrders(alldata.canceledOrders);
        setdata2(alldatacharts);
        setAllNumbers([
          alldata.allOrders.number,
          alldata.pendingOrders.number,
          alldata.completedOrders.number,
          alldata.canceledOrders.number
        ]);
        // console.log(alldatacharts)
      })
      .catch((err) => console.log(err));
  };

  const data = {
    datasets: [
      {
        data: [10, 20, 30],
        backgroundColor: "aqua",
        borderColor: "black",
        pointBorderColor: "aqua"
      }
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: ["Red", "Yellow", "Blue"]
  };

  useEffect(() => {
    getstatistics();
  }, []);
  const language = useSelector((state) => state.language.lang);
  return (
    <div className="ProfuctsStatic static">
      <HeaderStatic
        name={language == "ar" ? "حالات الطلبات" : "orders Stats"}
        src={
          "https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689329639/My%20Folder/public/Bag_sw5h1n.svg"
        }
      />
      <div className="stitics_sc">
        <Staticsec
          name={language == "ar" ? "كل الطلبات" : "All Orders"}
          number={allOrders.number}
          percentage={allOrders?.percentage?.toFixed(2) || 0}
        />
        <Staticsec
          name={language == "ar" ? " الطلبات الملغية" : "Canceled Orders"}
          number={canceledOrders.number}
          percentage={canceledOrders?.percentage?.toFixed(2) || 0}
        />
        <Staticsec
          name={language == "ar" ? " الطلبات المعلقة" : "Canceled Orders"}
          number={pendingOrders.number}
          percentage={pendingOrders?.percentage?.toFixed(2) || 0}
        />

        <Staticsec
          name={language == "ar" ? " الطلبات المكتملة" : "Completed Orders"}
          number={completedOrders.number}
          percentage={completedOrders?.percentage?.toFixed(2) || 0}
        />
      </div>
      {/* <Line data={data} options={options}></Line> */}
      {/* <Pie data={datacharts}/> */}
      <Doughnut data={data2} />
    </div>
  );
}

export default ProfuctsStatic;
