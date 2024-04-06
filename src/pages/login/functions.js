import axios from "axios";
import { toast } from "react-toastify";

export const checkLoggin = localStorage.getItem("authenticatedUser");
export const auth_inputs = [
  {
    label_ar: "البريد الالكتروني",
    label: "email",
    id: "user_email",
    name: "email",
    placeholder: "اكتب ايميلك",
    type: "email",
  },
  {
    label_ar: "كلمة السر",
    label: "Password",
    id: "user_password",
    name: "password",
    placeholder: "اكتب كلمة السر",
    type: "password",
  },
];

const fakeLogin = {
  user_email: "roma@admin.com",
  user_password: "7410",
};
export const login = (e) => {
  e.preventDefault();
  const handleAuth = {};
  auth_inputs.forEach((item) => {
    handleAuth[item.name] = e.currentTarget[item.name]
      ? e.currentTarget[item.name].value
      : null;
  });
  handleAuth.type = "admin";
  if (handleAuth.password && handleAuth.email) {
    axios
      .post("https://api.manjam.shop/v3/user/login", handleAuth)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          localStorage.setItem(
            "authenticatedUser",
            JSON.stringify(res.data.message)
          );
          toast.success("تم تسجيل الدخول بنجاح");
          window.location.href = "/";
        } else {
          toast.error("الايميل أو كلمة السر خاطئة");
        }
      });
  } else {
    toast.error("أدخل كل البيانات أولا");
  }
};
