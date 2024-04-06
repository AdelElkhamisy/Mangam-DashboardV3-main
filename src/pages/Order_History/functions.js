import { toast } from "react-toastify";
import axios from "axios";
import { getOrders } from "../addition/functions";
export const updateStatus = (
  e,
  id,
  orderId,
  { setEdditted, setshowchangestatus, Edditted, setShowEditOrderData }
) => {
  // console.log(orderId)
  // console.log(e)
  e.preventDefault();
  const data_send = {
    status: e.currentTarget["status"].value,
    id: orderId,
  };

  console.log(data_send);

  if (data_send.status) {
    axios
      .post("https://api.manjam.shop/v3/order/changeStatus", data_send)
      .then((res) => {
        console.log(res);
        if (res.data.status) {
          toast.success(`Has Edited to ${data_send.status} successfully`);
          setEdditted(!Edditted);
          getOrders();
          setshowchangestatus(false);
        } else {
          toast.error(res.data.message);
        }
      });
  } else {
    toast.error("Choose One Status");
  }
};
