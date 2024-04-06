import axios from "axios";
import { toast } from "react-toastify";

export const chooseDep = (setChoice, { choice }) => {
  setChoice(choice);
};

export const choices = [
  {
    label: "شعار الموقع",
    data: "logo",
  },
  {
    label: "مواقع التواصل الاجتماعي",
    data: "social",
  },
  {
    label: "الشركات",
    data: "company",
  },

  {
    label: "مواقع وأرقام",
    data: "contact",
  },
];

export const socialWData = [
  {
    label: "اسم التطبيق",
    id: "name",
    type: "text",
    name: "name",
    placeholder: "اكتب اسم التطبيق",
  },
  {
    label: "لينك الحساب",
    id: "link",
    type: "text",
    name: "link",
    placeholder: "أكتب لينك الحساب",
  },
  {
    label: "صوره الموقع",
    id: "image",
    type: "file",
    name: "image",
    placeholder: "صوره التطبيق",
  },
];

export const editlogo = (
  e,
  setChoosedSrc,
  newlogo,
  { setEditShow, getlogo, fileRef }
) => {
  const formdata = new FormData();
  formdata.append("image", newlogo);
  if (newlogo) {
    axios
      .post(
        "https://roma-cosmetic.com/api/v1/admin/home/update_logo.php",
        formdata
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success(res.data.message);
          setEditShow(false);
          getlogo();
          if (fileRef.current) {
            fileRef.current.value = "";
          }
          setChoosedSrc(false);
        } else if (res.data.status === "error") {
          toast.error(res.data.message);
        } else {
          toast.error("حدث خطأ ما");
        }
      });
  } else {
    toast.error("أضف صورة أولا");
  }
};

export const handlepub = (e) => {
  const handlepub = {};
  socialWData.forEach((item) => {
    handlepub[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  const formdata = new FormData();
  formdata.append("name", e.currentTarget.name.value);
  formdata.append("link", e.currentTarget.link.value);
  formdata.append("image_have", handlepub.image !== "" ? 1 : 0);
  formdata.append("image", e.currentTarget.image.files[0]);

  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/home/add_social_acc.php",
      formdata
    )
    .then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        window.location.href = "/socialmedia";
      } else if (res.data.status === "error") {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    });
};

export const company_input = [
  {
    label: "اسم الشركة",
    id: "name",
    type: "text",
    name: "name",
    placeholder: "اكتب اسم الشركة",
  },
  {
    label: "لينك الشركة",
    id: "link",
    type: "text",
    name: "link",
    placeholder: "أكتب لينك الشركة",
  },
  {
    label: "صوره الشركة",
    id: "image",
    type: "file",
    name: "image",
    placeholder: "صوره الشركة",
  },
];

export const add_company = (e) => {
  const handlepub = {};
  company_input.forEach((item) => {
    handlepub[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  const formdata = new FormData();
  formdata.append("name", e.currentTarget.name.value);
  formdata.append("link", e.currentTarget.link.value);
  formdata.append("image_have", handlepub.image !== "" ? 1 : 0);
  formdata.append("image", e.currentTarget.image.files[0]);

  axios
    .post(
      "https://roma-cosmetic.com/api/v1/admin/home/add_company.php",
      formdata
    )
    .then((res) => {
      if (res.data.status === "success") {
        toast.success(res.data.message);
        window.location.href = "/companies";
      } else if (res.data.status === "error") {
        toast.error(res.data.message);
      } else {
        toast.error("حدث خطأ ما");
      }
    });
};
