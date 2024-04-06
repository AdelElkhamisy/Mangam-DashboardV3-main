import axios from "axios";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { toast } from "react-toastify";

export const chooseDep = (setChoice, { choice }) => {
  setChoice(choice);
};

export const choices = [
  {
    label: "إضافه منتج",
    label_en: "Add Product",
    data: "product"
  },
  {
    label: "إضافة صنف",
    label_en: "Add Category",
    data: "category"
  },
  {
    label: "إضافة بانر",
    label_en: "Add Banner",
    data: "banner"
  }
  // {
  //   label: "إضافة مستخدم",
  //   data: "adduser",
  // },
  // {
  //   label: "إضافة معلومات التواصل",
  //   data: "contact",
  // },
];

// export const changeFunction = (id) => id;
let contName = "المنتج";
export const nameMont = (name) => console.log(name);

export const classification_input = (changeFunction, id) => [
  {
    label: "category",
    label_ar: "الفئه",
    id: "category_id",
    name: "category_id",
    type: "selectCategory",
    changeFunction: changeFunction
  },
  {
    label: `Product Name`,
    label_ar: `إسم المنتج`,
    id: "title",
    type: "text",
    name: "title",
    placeholder: `Product Name`,
    placeholder_ar: `إسم المنتج`
  },
  {
    label: `Arabic Product Name`,
    label_ar: `إسم المنتج بالعربيه`,
    id: "title_ar",
    type: "text",
    name: "title_ar",
    placeholder: `Arabic Product Name`,
    placeholder_ar: `إسم المنتج بالعربيه`
  },
  {
    label: `Product Description`,
    label_ar: `وصف المنتج`,
    id: "description",
    type: "textarea",
    name: "description",
    placeholder: "Product Description ",
    placeholder_ar: "وصف المنتج"
  },
  {
    label: `Arabic Product Description`,
    label_ar: `وصف المنتج بالعربيه`,
    id: "description_ar",
    type: "textarea",
    name: "description_ar",
    placeholder: "Arabic Product Description ",
    placeholder_ar: "وصف المنتج بالعربيه"
  },
  {
    label: `Model Number`,
    label_ar: `رقم النموذج`,
    id: "model_number",
    type: "textarea",
    name: "model_number",
    placeholder: "Model Number",
    placeholder_ar: "رقم النموذج"
  },
  {
    label: `Producting Company`,
    label_ar: `إسم الشركه`,
    id: "producing_company",
    type: "text",
    name: "producing_company",
    placeholder: "Product Company",
    placeholder_ar: "إسم الشركه"
  },
  {
    label: "Will Avilable After",
    label_ar: "الوقت المتوفر عنده",
    id: "will_av_after",
    name: "will_av_after",
    type: "date",
    input_min: true
  },
  {
    label: "Will Avilable For",
    label_ar: "متوفر لوقت",
    id: "will_av_for",
    name: "will_av_for",
    type: "date",
    min: "true",
    min_for: 8
  },
  // {
  //   label:'Status',
  //   id:'hidden',
  //   name:'hidden',
  //   type:'switch',
  // },
  {
    label: "conditions",
    label_ar: "الشروط بالانجليزيه",
    id: "conditions",
    name: "conditions",
    type: "textarea"
  },
  {
    label: "arabic conditions",
    label_ar: "الشروط بالعربيه",
    id: "conditions_ar",
    name: "conditions_ar",
    type: "textarea"
  }
];

export const categories_input = [
  {
    label: "category name",
    label_ar: "إسم الفئه بالانجليزيه",
    id: "title",
    type: "text",
    name: "title",
    placeholder: "Add Category Name",
    placeholder_ar: "أضف اسم الفئه"
  },
  {
    label: "arabic category name",
    label_ar: "إسم الفئه بالعربيه",
    id: "title_ar",
    type: "text",
    name: "title_ar",
    placeholder: "Add Category Name in arabic",
    placeholder_ar: "أضف اسم الفئه"
  },
  {
    label: "Category Image",
    label_ar: "صوره الفئه",
    id: "image_url",
    type: "file",
    name: "image_url",
    placeholder: "Add Category Image",
    placeholder_ar: "أضف صوره الفئه",
    show: false
  }
];

export const add_class = (e, images, category_id) => {
  const handleClassification = {};
  classification_input().forEach((item) => {
    handleClassification[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  // let myimages = [...images];
  // let imagestxt = "";
  // for (let i = 0; i < myimages.length; i++) {
  //   if (i == 0) {
  //     imagestxt = myimages[i];
  //   } else {
  //     imagestxt = imagestxt + "**roma**" + myimages[i];
  //   }
  // }
  console.log(handleClassification);
  const data_send = {
    title: handleClassification.title,
    title_ar: handleClassification.title_ar,
    description: handleClassification.description,
    description_ar: handleClassification.description_ar,
    model_number: handleClassification.model_number,
    producing_company: handleClassification.producing_company,
    will_av_after: handleClassification.will_av_after,
    will_av_for: handleClassification.will_av_for,
    category_id,
    // title_ar:handleClassification.title_ar,
    // hidden:0,
    conditions: handleClassification.conditions,
    conditions_ar: handleClassification.conditions_ar
  };
  // console.log(data_send)
  axios
    .post("https://api.manjam.shop/v3/product/add_product", data_send)
    .then((res) => {
      // console.log(res.data)
      if (res.data.status === 1) {
        toast.success(res.data.message);
        // window.location.href = "/products";
        window.location.reload();
      } else if (res.data.status === 0) {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    })
    .catch((err) => console.log(err));
};

export const offer_input = [
  {
    label: "عنوان العرض",
    id: "offer",
    type: "text",
    name: "offer_title",
    placeholder: "اكتب عنوان العرض"
  },
  {
    label: "تفاصيل العرض",
    id: "details",
    type: "textarea",
    name: "offer_details",
    placeholder: "اكتب سعر"
  },
  {
    label: "تحميل صورة",
    id: "offer_img",
    type: "file",
    name: "offer_img",
    placeholder: "اختر صورة من جهازك أو قم بالسحب هنا"
  }
];

export const add_offer = (e) => {
  const formData = new FormData(e.currentTarget);
};

export const add_category = (e) => {
  // console.log("rerere")
  const handleCategories = {};
  categories_input.forEach((item) => {
    handleCategories[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });

  const formdata = new FormData();

  formdata.append("image", e.currentTarget["image_url"]?.files[0]);
  // console.log(formdata)
  axios
    .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
    .then((res) => {
      // console.log(res.data.imgUrl)
      const data_send = {
        title: handleCategories.title,
        title_ar: handleCategories.title_ar,
        image_url: res.data.imgUrl
      };
      // console.log(data_send)
      axios
        .post("https://api.manjam.shop/v3/category/add", data_send)
        .then((res) => {
          // console.log(res)
          if (res.data.status === 1) {
            toast.success(res.data.message);
            window.location.reload();
          } else if (res.data.status === 0) {
            toast.error(res.data.message);
          } else {
            toast.error("Something Went Error");
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      console.log(err);
    });
};
export const getOrders = async () => {
  const data = await axios
    .post("https://api.manjam.shop/v3/order/getAll?type=admin")
    .catch((err) => console.log(err));
  // console.log(data.data)
  return data;
};

export const address_input = [
  {
    label: "اسم الفرع",
    id: "name",
    type: "text",
    name: "far3_title",
    placeholder: "اكتب اسم الفرع"
  },
  {
    label: "عنوان الفرع",
    id: "address",
    type: "text",
    name: "far3_address",
    placeholder: "اكتب عنوان الفرع"
  },
  {
    label: "رقم التليفون",
    id: "offer",
    type: "number",
    name: "far3_title",
    placeholder: "اكتب رقم التليفون"
  }
];
let rData = false;
export let contact_input = false;
(async function getData() {
  const data_r = await axios.get(
    "https://roma-cosmetic.com/api/v1/user/home/select_company_data.php"
  );
  rData = data_r.data.message;
  // console.log(rData);
  contact_input = [
    {
      label: " عنوان الشركة",
      id: "offer",
      type: "text",
      name: "address",
      placeholder: " عنوان الشركة",
      value: rData.address
    },
    {
      label: " اسم الشركة",
      id: "offer",
      type: "text",
      name: "title",
      placeholder: " اسم الشركة",
      value: rData.title
    },
    {
      label: " رقم التليفون",
      id: "details",
      type: "text",
      name: "phone",
      placeholder: "اكتب رقم تليفون",
      value: rData.phone
    },
    {
      label: "البريد الالكتروني",
      id: "details",
      type: "text",
      name: "email",
      placeholder: "اكتب البريد الالكتروني ",
      value: rData.email
    },
    {
      label: "أيام العمل",
      id: "details",
      type: "text",
      name: "work_days",
      placeholder: "اكتب عدد أيام العمل",
      value: rData.work_days
    },
    {
      label: "معلومات عن الشركة",
      id: "description",
      type: "textarea",
      name: "description",
      placeholder: "معلومات عن الشركة",
      required: false,
      value: rData.des
      // des
    },
    {
      label: "latitude",
      id: "details",
      type: "text",
      name: "latitude",
      placeholder: "اكتب latitude",
      value: rData.latitude
    },
    {
      label: "longitude",
      id: "details",
      type: "text",
      name: "longitude",
      placeholder: "اكتب longitude",
      value: rData.longitude
    }
  ];
})();
// export const contact_input = [
//   {
//     label: "عنوان العرض",
//     id: "offer",
//     type: "text",
//     name: "address",
//     placeholder: "اكتب عنوان",
//   },
//   {
//     label: " رقم التليفون",
//     id: "details",
//     type: "text",
//     name: "phone",
//     placeholder: "اكتب رقم تليفون",
//   },
//   {
//     label: "البريد الالكتروني",
//     id: "details",
//     type: "text",
//     name: "email",
//     placeholder: "اكتب البريد الالكتروني ",
//   },
//   {
//     label: "أيام العمل",
//     id: "details",
//     type: "text",
//     name: "work_days",
//     placeholder: "اكتب عدد أيام العمل",
//   },
//   {
//     label: "latitude",
//     id: "details",
//     type: "text",
//     name: "latitude",
//     placeholder: "اكتب latitude",
//   },
//   {
//     label: "longitude",
//     id: "details",
//     type: "text",
//     name: "longitude",
//     placeholder: "اكتب longitude",
//   },
// ];

export const add_contact = (e) => {
  const handleCategories = {};
  contact_input.forEach((item) => {
    handleCategories[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });

  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/home/add_company_data.php",
      handleCategories
    )
    .then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        window.location.reload();
      } else if (res.data.status === "erroe") {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    })
    .catch((err) => console.log(err));
};

export const user_input = [
  {
    label: "البريد الإلكتروني",
    id: "user_email",
    type: "email",
    name: "user_email",
    placeholder: "أدخل البريد الإلكتروني"
  },
  {
    label: "كلمة المرور",
    id: "password",
    type: "password",
    name: "password",
    placeholder: "أدخل كلمة المرور"
  },
  {
    label: "اسم المستخدم",
    id: "user_name",
    type: "text",
    name: "user_name",
    placeholder: "أدخل اسم المستخدم"
  },

  {
    label: "نوع المستخدم",
    id: "type",
    name: "type",
    type: "children",
    children: () => {
      return (
        <div className="inputField" key={"type"}>
          <label htmlFor={"type"}>{"نوع المستخدم"}</label>
          <CreatableSelect
            isClearable
            name="type"
            styles={{ width: "100% !important" }}
            options={[
              {
                value: "admin",
                label: "admin"
              },
              {
                value: "reception",
                label: "reception"
              }
            ]}
          />
        </div>
      );
    }
  },
  {
    label: "رقم الهاتف",
    id: "phone",
    type: "text",
    name: "phone",
    placeholder: "أدخل رقم الهاتف"
  }
];

export const add_user = (e) => {
  const handleCategories = {};
  user_input.forEach((item) => {
    handleCategories[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });

  // console.log(handleCategories);
  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/home/crate_acc.php",
      handleCategories
    )
    .then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        window.location.reload();
      } else if (res.data.status === "erroe") {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    })
    .catch((err) => console.log(err));
};
