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
    {
      label: "إجمالى المنتجات",
      value: statics?.items_count,
    },
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

export const selectSocialMedia = async ({ setBody, query,setpageloading }) => {
  const pros = await axios.get(
    "https://roma-cosmetic.com/api/v1/admin/home/select_social_acc.php"
  ).finally(()=>{
    setpageloading(false)
  }).catch(err=>console.log(err))
  setBody(
    query && query.length
      ? pros.data.message.filter((item) => item.name.includes(query))
      : pros.data.message
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
    label: "إسم المنتج",
    id: "item_name",
    type: "text",
    name: "item_name",
    placeholder: " إسم المنتج",
    value: productname,
    disable: true,
  },
];

export const setItem_s = ({ item }) => {


  edit_input[0]["value"] = item?.name;
  edit_input[1]["value"] = item?.link;
  edit_input[2]["value"] = item?.image;
};

let getImageLink = null;
const getLink = (link) => {
  getImageLink = link;

};

export const edit_input = [
  {
    label: "إسم موقع التواصل",
    id: "name",
    type: "text",
    name: "name",
    placeholder: " إسم الموقع",
    required: false,
  },

  {
    label: "رابط الموقع",
    id: "link",
    type: "text",
    name: "link",
    placeholder: " رابط الموقع",
    required: false,
  },

  {
    label: "صورة الموقع",
    id: "images",
    type: "file",
    name: "image",
    placeholder: "صورة الموقع",
    required: false,
    show: true,
    getLink: getLink,
    value: false,
  },
];

export const editProduct = (e, id, reselectedData, { closeModels }) => {
  const handleEdit = {};
  edit_input.forEach((item) => {
    handleEdit[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  handleEdit["account_id"] = id;
  handleEdit["image"] = getImageLink;
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/home/update_social_acc.php",
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

export const deleteSocialMedia = (e, id, reselectedData, { closeModels }) => {
  const handleRemove = {};
  e.preventDefault();
  handleRemove["account_id"] = id;
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/home/delete_social_accs.php",
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
