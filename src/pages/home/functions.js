import axios from "axios";
export const getStatic = async ({ setStatics }) => {
  const statics = await axios.get("https://roma-cosmetic.com/api/v1/admin/home/select_statistic.php");
  setStatics(statics.data.message);
  return statics;
};
