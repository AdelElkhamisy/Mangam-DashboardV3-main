import { toast } from "react-toastify";

export const logOut = () => {
  localStorage.removeItem("authenticatedUser");
  toast.success("تم تسجيل الخروج بنجاح")
  window.location.href = "/login";
};
