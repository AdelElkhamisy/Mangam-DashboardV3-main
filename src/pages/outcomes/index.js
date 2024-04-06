import React from 'react'
import DefaultLayout from '../../layout/defaultlayout'
import ContentNav from '../../datanavcontent'
import Table from '../../components/table'
import './style.css'
const Outcomes = () => {
  const headers = [
    {
      label: "الطلب",
      dataIndex: "order",
    },
    {
      label: "التاريخ",
      dataIndex: "date",
    },
    {
      label: "السعر",
      dataIndex: "price",
    },
  ];

  const body = [
    {
      order: `
      عينة ديور LA COLLE NOIREاو
  دو بارفيوم 7.5 مل
      `,
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      order: `
      عينة ديور LA COLLE NOIREاو
  دو بارفيوم 7.5 مل
      `,
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      order: `
      عينة ديور LA COLLE NOIREاو
  دو بارفيوم 7.5 مل
      `,
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      order: `
      عينة ديور LA COLLE NOIREاو
  دو بارفيوم 7.5 مل
      `,
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
    {
      order: `
      عينة ديور LA COLLE NOIREاو
  دو بارفيوم 7.5 مل
      `,
      date: "٢٥ ديسمبر ٢٠٢٢",
      price: "٥٠ ر.س",
    },
  ];

  return (
    <div className='h-container con-h'>
      <DefaultLayout
        children={
          <div className='childs outcometabel'>
            <ContentNav head={"الصرف"}/>
            <Table headers={headers} body={body} />
          </div>
        }
      />
    </div>
  )
}

export default Outcomes
