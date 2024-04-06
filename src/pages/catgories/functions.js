import axios from "axios";
import { toast } from "react-toastify";
export const RatiosLabels = ({ statics }) => {
  return [
    {
      label: "الفئات",
      value: statics?.category_count
    },

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

export const selectCategories = async ({
  setBody,
  query,
  setgetdataOriginal,
  setpageloading
}) => {
  const pros = await axios
    .get("https://api.manjam.shop/v3/category/getAll?type=admin")
    .finally(() => {
      setpageloading(false);
    })
    .catch((err) => console.log(err));
  if (pros?.data?.message) {
    if (pros?.data?.message) {
      pros?.data?.message.map((item, index) => {
        item.hidden == 1 ? (item.hidden = "hidden") : (item.hidden = "show");
      });
    }
  }
  setBody(
    query && query.length
      ? pros?.data?.message.filter((item) => item.name.includes(query))
      : pros?.data?.message
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

export const setItem_s = ({ item }) => {
  edit_input[0]["value"] = item?.name;
};

let getImageLink = null;
const getLink = (link) => {
  getImageLink = link;
};

export const edit_input = [
  {
    label: "إسم التصنيفات",
    id: "name",
    type: "text",
    name: "category_name",
    placeholder: " إسم التصنيف",
    required: false
  },

  {
    label: "صورة التصنيف",
    id: "images",
    type: "file",
    name: "image",
    placeholder: "صورة التصنيف",
    required: false,
    show: true,
    getLink: getLink,
    value: false
  }
];

export const editProduct = (e, id, reselectedData, { closeModels }) => {
  const handleEdit = {};
  edit_input.forEach((item) => {
    handleEdit[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  handleEdit["category_id"] = id;
  handleEdit["category_image_url"] = getImageLink;
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/categories_product/edit_category.php",
      JSON.stringify(handleEdit)
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

export const deleteCategories = (e, id, reselectedData, { closeModels }) => {
  const handleRemove = {};
  e.preventDefault();
  handleRemove["category_id"] = id;
  handleRemove["category_hidden"] = !e.currentTarget.category_hidden.checked
    ? "no"
    : "yes";
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/categories_product/hide_category.php",
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
