import axios from "axios";
import { toast } from "react-toastify";
export const RatiosLabels = ({ statics }) => {
  return [
    {
      label: "الفئات",
      value: statics?.category_count
    },
    // {
    //   label: "إجمالى العناصر",
    //   value: "260",
    // },
    // {
    //   label: "إنتهى من المخزن",
    //   value: "260",
    // },
    {
      label: "إجمالى المنتجات",
      value: statics?.items_count
    }
  ];
};

export const FilterCates = [
  {
    lable: "الكل",
    value: "all"
  },
  {
    lable: "طعام",
    value: "food"
  },
  {
    lable: "مشروبات",
    value: "drinks"
  }
];

// export const getCategories = async () => {
//   const cates = await axios.get("");
//   return cates.data.message;
// };

export const FilterByDate = [
  {
    label: "الاحدث",
    value: "latest"
  },
  {
    label: "الاقدم",
    value: "lastes"
  }
];

export const selectProducts = async ({
  setBody,
  query,
  setgetdataOriginal,
  setpageloading
}) => {
  const pros = await axios
    .get("https://api.manjam.shop/v3/product/getAll?type=admin")
    .finally(() => {
      setpageloading(false);
    })
    .catch((err) => console.log(err));
  // console.log(pros.data)
  if (pros.data.message) {
    if (pros.data.message) {
      pros.data.message.map((item, index) => {
        // console.log(item.hidden)
        item.hidden == 1 ? (item.hidden = "hidden") : (item.hidden = "show");
      });
      pros.data.message.map((item) => {
        item.checked = false;
      });
    }
  }
  setBody(
    query && query.length
      ? pros.data.message.filter(
          (item) => item.name.includes(query) && item.category_id != 3
        )
      : pros.data.message.filter((item) => item.category_id != 3)
  );
  setgetdataOriginal(
    query && query.length
      ? pros.data.message.filter(
          (item) => item.name.includes(query) && item.category_id != 3
        )
      : pros.data.message.filter((item) => item.category_id != 3)
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
    placeholder: "اكتب السعر الجديد"
  },
  {
    label: "السعر الحالى",
    id: "item_old_price",
    type: "text",
    name: "item_old_price",
    placeholder: " السعر الحالى",
    value: oldrprice,
    disable: true
  },
  {
    label: "إسم المنتج",
    id: "item_name",
    type: "text",
    name: "item_name",
    placeholder: " إسم المنتج",
    value: productname,
    disable: true
  }
];
let IdPro = "";
export const setItem_s = ({ item }) => {
  edit_input[0]["value"] = item?.name;
  edit_input[1]["value"] = item?.oldPrice;
  edit_input[2]["value"] = item?.price;
  edit_input[3]["value"] = item?.description;
  edit_input[4]["value"] = item?.number_of_pieces;
};

export const edit_input = [
  {
    label: "إسم المنتج",
    id: "item_name",
    type: "text",
    name: "item_name",
    placeholder: " إسم المنتج",
    required: false
  },
  {
    label: "سعر المنتج",
    id: "item_price",
    type: "text",
    name: "item_price",
    placeholder: " سعر المنتج",
    required: false
  },
  {
    label: "السعر بعد الخصم",
    id: "price_after_discount",
    name: "price_after_discount",
    type: "number",
    required: false
  },
  {
    label: "وصف المنتج",
    id: "item_description",
    type: "text",
    name: "item_description",
    placeholder: " وصف المنتج",
    required: false
  },
  {
    label: "العدد المتوفر من المنتج",
    id: "number_of_pieces",
    type: "text",
    name: "number_of_pieces",
    placeholder: "العدد المتوفر من المنتج",
    required: false
  },
  {
    label: "أسم الصنف",
    id: "category_id",
    name: "category_id",
    type: "selectCategory"
  }
];

export const editProduct = (e, id, reselectedData, { closeModels }) => {
  const handleEdit = {};
  edit_input.forEach((item) => {
    handleEdit[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  handleEdit["item_id"] = id;
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

export const hideShowProduct = (e, id, reselectedData, { closeModels }) => {
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
