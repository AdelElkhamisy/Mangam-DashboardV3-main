import React, { useRef } from "react";
import "./style.css";
import { Icon } from "@iconify/react";
import { useReactToPrint } from "react-to-print";
// import Table from "../../components/table";
import { item_headers, order_headers } from "./consts";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import { useSelector } from "react-redux";
function ProductModel({ data, items, closeModel }) {
  console.log(data);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });
  const language = useSelector((state) => state.language.lang);
  const navigate = useNavigate();
  const handlePrint_2 = () => {
    // Create a new element that contains a copy of the .printable element
    const printableCopy = document.createElement('div');
    printableCopy.innerHTML = document.querySelector('.printable').innerHTML;
    navigate('/printPage', {
      state: document.querySelector('.printable').innerHTML
    });
  };

  const columns = [
    {
      title: language == 'ar' ? "رقم الطلب" : "Id",
      dataIndex: "id",
      key: 'id'
    },
    {
      title: language == 'ar' ? "العنوان" : "Address",
      dataIndex: "address",
      key: 'address'
    },
    {
      title: language == 'ar' ? "وسيلة الدفع" : "Payment Method",
      dataIndex: "payment_method",
      key: 'payment_method'
    },
    {
      title: language == 'ar' ? "طريقة التوصيل" : "Shipping Method",
      key: 'ship_title',
      render: (_, record) => {
        return (
          <p>
            {language == 'ar'
              ? record.shipping[0].shipping_title_ar
              : record.shipping[0].shipping_title}
          </p>
        );
      }
    },
    {
      title: language == 'ar' ? "سعر التوصيل" : "Shipping Price",
      key: 'shipprice',
      render: (_, record) => {
        return <p>{record.shipping_price}</p>;
      }
    },
    {
      title: language == 'ar' ? "الحاله" : "status",
      dataIndex: "status",
      key: 'status'
    },
    {
      title:
        language == "ar" ? "سعر الطلب بالخصم" : "Order Price With Discount",
      dataIndex: "grand_price",
      key: "grand_price"
    },
    {
      title:
        language == "ar"
          ? "سعر الطلب بدون الخصم"
          : "Order Price Without Discount",
      dataIndex: "grand_price",
      key: "grand_price"
    },
    {
      title: language == "ar" ? "سعر الخاصيه" : "Props Price",
      dataIndex: "props_price",
      key: "props_price"
    },
    {
      title: language == "ar" ? "سعر المنتج" : "Product Price",
      key: "props_price",
      render: (_, record) => {
        return <p>{record.products[0].price}</p>;
      }
    },
    {
      title: language == 'ar' ? "رقم الهاتف" : "Phone",
      key: 'phone',
      render: (_, record) => {
        return <p>{record.userData.phone}</p>;
      }
    }
  ];

  const productcoumns = [
    {
      title: language == 'ar' ? 'رقم المنتج' : "Id",
      key: 'id',
      dataIndex: 'id'
    },
    {
      title: language == 'ar' ? 'إسم المنتج' : "Product Name",
      key: 'name',
      render: (_, record) => {
        return <p>{language == 'ar' ? record.title_ar : record.title}</p>;
      }
    },
    {
      title: language == 'ar' ? 'إسم الفئه' : "Category Name",
      key: 'category_name',
      render: (_, record) => {
        return (
          <p>
            {language == 'ar' ? record.category_name_ar : record.category_name}
          </p>
        );
      }
    },
    {
      title: language == 'ar' ? 'حالة المنتج' : "Grade",
      key: 'grade',
      dataIndex: 'grade'
    },
    {
      title: language == 'ar' ? 'وصف المنتج' : "Product description",
      key: 'description',
      render: (_, record) => {
        return (
          <p>{language == 'ar' ? record.description_ar : record.description}</p>
        );
      }
    },
    {
      title: language == 'ar' ? 'حالة' : "Status",
      key: 'hidden',
      render: (_, record) => {
        return (
          <p className={record.hidden == 0 ? "show status" : "hidden status"}>
            {record.hidden == 0
              ? language == 'ar'
                ? "ظاهر"
                : "Show"
              : language == 'ar'
              ? "مخفى"
              : "Hidden"}
          </p>
        );
      }
    },
    {
      title: language == 'ar' ? 'اللون' : "Color",
      key: 'color',
      render: (_, record) => {
        return (
          <p>
            {language == 'ar'
              ? record.colors[0].color_ar
              : record.colors[0].color}
          </p>
        );
      }
    },
    {
      title: language == 'ar' ? 'كود اللون' : "Color Code",
      key: 'color code',
      render: (_, record) => {
        return <p>{record.colors[0].color_code}</p>;
      }
    },
    {
      title: language == 'ar' ? 'رقم النموذج' : "Model Number",
      key: 'model_number',
      dataIndex: 'model_number'
    }
  ];

  return (
    <div className="OrderModel">
      <div
        style={{
          cursor: "pointer",
          fontSize: "24px",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px"
        }}
        className="closeModel"
      >
        <Icon
          icon="line-md:close-small"
          onClick={() => (closeModel ? closeModel() : null)}
        />
        {/* <button className="btn btn-primary" onClick={() => handlePrint_2()}>
          طباعة
        </button> */}
      </div>
      <div
        className="printable"
        ref={componentRef}
        style={{
          padding: "10px"
        }}
      >
        <h3
          style={{
            textAlign: "center",
            width: "fit-content",
            padding: "10px 15px",
            borderBottom: "0.1px solid rgb(217, 217, 217)",
            margin: "10px auto"
          }}
        >
          {language == "ar" ? "تفاصيل الطلب" : "Order Details"}
        </h3>
        <Table columns={columns} dataSource={[data]} />
        <div
          className="items"
          style={{
            padding: "10px"
          }}
        >
          <h3
            style={{
              textAlign: "center",
              width: "fit-content",
              padding: "10px 15px",
              borderBottom: "0.1px solid rgb(217, 217, 217)",
              margin: "10px auto"
            }}
          >
            {language == "ar" ? "المنتجات" : "Products"}
          </h3>
          <div className="orders_i">
            {items.length ? (
              <Table columns={productcoumns} dataSource={items} />
            ) : (
              <h2
                style={{
                  textAlign: "center",
                  width: "fit-content",
                  margin: "auto",
                  padding: "10px 15px"
                }}
              >
                لا توجد منتجات
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModel;
