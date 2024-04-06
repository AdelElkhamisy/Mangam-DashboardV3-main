import axios from "axios";
import { toast } from "react-toastify";
export const RatiosLabels = ({ statics }) => {
  return [
    {
      label: "الفئات",
      value: statics?.category_count,
    },
    // {
    //   label: "إجمالى العناصر",
    //   value: "260",
    // },
    // {
    //   label: "إنتهى من المخزن",
    //   value: "260",
    // },
    // {
    //   label: "إجمالى البطاقات",
    //   value: statics?.items_count,
    // },
  ];
};

export const FilterCates = [
  {
    lable: "الكل",
    value: "all",
  },
  {
    lable: "طعام",
    value: "food",
  },
  {
    lable: "مشروبات",
    value: "drinks",
  },
];

// export const getCategories = async () => {
//   const cates = await axios.get("");
//   return cates.data.message;
// };

export const FilterByDate = [
  {
    label: "الاحدث",
    value: "latest",
  },
  {
    label: "الاقدم",
    value: "lastes",
  },
];

export const selectCoupons = async ({ setBody, query }) => {
  const pros = await axios.get(
    "https://roma-cosmetic.com/api/v1/admin/categories_product/select_products.php"
  );
  if (pros.data) {
    if (pros?.data?.message) {
      pros?.data?.message.map((item, index) => {
        item.item_hidden == "yes"
          ? (item.hidden = "مخفي")
          : (item.hidden = "ظاهر");
      });
    }
  }
  setBody(
    query && query.length
      ? pros?.data?.message.filter(
          (item) => item.name.includes(query) && item.category_id == 3
        )
      : pros?.data?.message.filter((item) => item.category_id == 3)
  );
  return pros;
};

let oldrprice = "";
let productname = "";

export const equdata = (item) => {
  oldrprice = item.price;
  productname = item.name;
};

export const offer_input = [
  {
    label: "السعر الجديد",
    id: "item_new_price",
    type: "text",
    name: "item_new_price",
    placeholder: "اكتب السعر الجديد",
  },
  {
    label: "السعر الحالى",
    id: "item_old_price",
    type: "text",
    name: "item_old_price",
    placeholder: " السعر الحالى",
    value: oldrprice,
    disable: true,
  },
  {
    label: "إسم البطاقة",
    id: "item_name",
    type: "text",
    name: "item_name",
    placeholder: " إسم البطاقة",
    value: productname,
    disable: true,
  },
];
let IdPro = "";
export const setItem_s = ({ item }) => {
  edit_input[0]["value"] = item?.name;
  edit_input[1]["value"] = item?.oldPrice;
  edit_input[2]["value"] = item?.price;
  edit_input[3]["value"] = item?.description;
  edit_input[4]["value"] = item?.number_of_pieces;
  edit_input[5]["value"] = item?.discount_ratio;
  // discount_ratio
};

export const edit_input = [
  {
    label: "إسم البطاقة",
    id: "item_name",
    type: "text",
    name: "item_name",
    placeholder: " إسم البطاقة",
    required: false,
  },
  {
    label: "سعر البطاقة",
    id: "item_price",
    type: "text",
    name: "item_price",
    placeholder: " سعر البطاقة",
    required: false,
  },
  {
    label: "السعر بعد الخصم",
    id: "price_after_discount",
    name: "price_after_discount",
    type: "number",
    required: false,
  },
  {
    label: "وصف البطاقة",
    id: "item_description",
    type: "text",
    name: "item_description",
    placeholder: " وصف البطاقة",
    required: false,
  },
  {
    label: "العدد المتوفر من البطاقات",
    id: "number_of_pieces",
    type: "text",
    name: "number_of_pieces",
    placeholder: "العدد المتوفر من البطاقات",
    required: false,
  },
  {
    label: "نسبة الخصم",
    id: "discountRate",
    type: "number",
    name: "discount_ratio",
    placeholder: "نسبة الخصم",
    required: false,
  },
];

export const editCoupon = (e, id, reselectedData, { closeModels }) => {
  const handleEdit = {};
  edit_input.forEach((item) => {
    handleEdit[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  handleEdit["item_id"] = id;
  handleEdit["category_id"] = 3;
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/categories_product/edit_product.php",
      handleEdit
    )
    .then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        reselectedData();
        closeModels();
      } else if (res.data.status === "error") {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    });
};

export const hideShowCoupon = (e, id, reselectedData, { closeModels }) => {
  const handleRemove = {};
  e.preventDefault();
  handleRemove["item_id"] = id;
  handleRemove["item_hidden"] = e.currentTarget.status.checked ? "yes" : "no";
  // item_hidden
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/categories_product/hide_product.php",
      handleRemove
    )
    .then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        reselectedData();
        closeModels();
      } else if (res.data.status === "error") {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    });
};
