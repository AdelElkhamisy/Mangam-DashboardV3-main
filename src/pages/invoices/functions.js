import axios from "axios";

export const chooseDep = (setChoice, { choice }) => {
  setChoice(choice);
};

export const choices = [
  {
    label: "المدخل عن طريق البنك",
    data: "bacnk",
  },
  {
    label: "المدخل عن طريق الكاش",
    data: "cash",
  },
];

export const invoices = [
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
  {
    icon: require("../../assets/images/invoice.png"),
    name: "إسم الفاتوره",
    showicon: "show",
    printicon: "print",
    deleteicon: "delete",
  },
];

export const getInvoices = async () => {
  const orders = await axios.get(
    "https://roma-cosmetic.com/api/v1/admin/order/select_all_orders.php"
  );
  return orders;
};

export const getInvoice = async (inv, { setLoading }) => {
  const data_send = {
    order_id: inv.order_id,
  };
  setLoading(true);
 const fileDownload = await axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/pdf_data/invoice.php",
      JSON.stringify(data_send)
    )
  setLoading(false);
};
