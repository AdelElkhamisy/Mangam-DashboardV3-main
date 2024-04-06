import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import Switches from "../../components/switches";
import { choices, chooseDep } from "./functions";
import Table from "../../components/table";
import GridTable from "@nadavshaar/react-grid-table";
import DataTable from "react-data-table-component";
const Entrance = () => {
  const [choice, setChoice] = useState("bank");

  useEffect(() => {
    // console.log(choice);
  }, [choice]);

  const headers = [
    {
      id: 1,
      name: "رقم الطلب",
      selector: (row) => row["or_num"],
    },
    {
      id: 2,
      name: "رقم الهاتف",
      selector: (row) => row["ph_num"],
    },
    {
      id: 3,
      name: "الدفع",
      selector: (row) => row["pay"],
      // type: "img",
    },
    {
      id: 4,
      name: "الطلب",
      selector: (row) => row["order"],
    },
    {
      id: 5,
      name: "التاريخ",
      selector: (row) => row["date"],
    },
    {
      id: 6,
      name: "السعر",
      selector: (row) => row["price"],
    },
  ];

  const body = [
    {
      or_num: "33",
      ph_num: "1171275345",
      src: require("../../assets/images/card.png"),
      order: "عينة ديور LA COLLE NOIREاو دو بارفيوم 7.5 مل",
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      or_num: "33",
      ph_num: "1171275345",
      src: require("../../assets/images/card.png"),
      order: "عينة ديور LA COLLE NOIREاو دو بارفيوم 7.5 مل",
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      or_num: "33",
      ph_num: "1171275345",
      src: require("../../assets/images/card.png"),
      order: "عينة ديور LA COLLE NOIREاو دو بارفيوم 7.5 مل",
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      or_num: "33",
      ph_num: "1171275345",
      src: require("../../assets/images/card.png"),
      order: "عينة ديور LA COLLE NOIREاو دو بارفيوم 7.5 مل",
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      or_num: "33",
      ph_num: "1171275345",
      src: require("../../assets/images/card.png"),
      order: "عينة ديور LA COLLE NOIREاو دو بارفيوم 7.5 مل",
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
  ];
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    // console.log(selected);
  }, [selected]);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="children">
            <ContentNav head={"المدخل"} />
            <Switches
              switches={choices}
              choice={choice}
              chooseFunction={chooseDep}
              setChoice={setChoice}
            />
            <DataTable
              columns={headers}
              data={body}
              selectableRows
              selectableRowSelected={({ row }) => setSelected(row)}
            />{" "}
          </div>
        }
      />
    </div>
  );
};

export default Entrance;
