import React, { useEffect, useState } from "react";
import ContentNav from "../../datanavcontent";
import DefaultLayout from "../../layout/defaultlayout";
import axios from "axios";
import "./sitedata.css";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const SiteData = () => {
  const language = useSelector((state) => state.language.lang);
  const [imageloading, setimageloading] = useState(false);
  const handleuploadafteredit = () => {
    setimageloading(true);
    const formdata = new FormData();
    formdata.append("image", image);
    axios
      .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
      .then((res) => {
        // console.log(res)
        if (res.data.imgUrl != "") {
          toast.success("has uploaded");
          setsitedata({ ...sitedata, logo: res.data.imgUrl });
          // setorderData({...orderData,image:res.data.imgUrl});
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
      });
  };
  const [image, setimage] = useState(null);
  const [sitedata, setsitedata] = useState({});
  const getsitedata = () => {
    axios
      .get("https://api.manjam.shop/v3/site/info/getAll")
      .then((res) => {
        // console.log(res.data.message[0]);
        setsitedata(res.data.message[0]);
      })
      .catch((err) => console.log(err));
  };

  const handelupdate = () => {
    const data_send = {
      name: sitedata.name,
      name_ar: sitedata.name_ar,
      logo: sitedata.logo,
      email: sitedata.email,
      address: sitedata.address,
      phone: sitedata.phone,
      tax: sitedata.tax,
      terms: sitedata.terms,
      terms_ar: sitedata.terms_ar,
      conditions: sitedata.conditions,
      conditions_ar: sitedata.conditions_ar,
      policy: sitedata.policy,
      policy_ar: sitedata.policy_ar,
      return_policy_ar: sitedata.return_policy_ar,
      return_policy: sitedata.return_policy,
      about: sitedata.about,
      about_ar: sitedata.about_ar,
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/site/info/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getsitedata();
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error("Something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getsitedata();
  }, []);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs">
            <ContentNav
              head={language == "ar" ? "بيانات الموقع" : "Site data"}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handelupdate();
              }}
              action=""
              className="sitedataform"
            >
              <label htmlFor="">
                {language == "ar" ? "شعار الموقع" : "Site Logo"}
              </label>
              <div className="updiv">
                <input
                  onChange={(e) => {
                    setimage(e.target.files[0]);
                  }}
                  type="file"
                />
                {imageloading ? (
                  <Icon icon="eos-icons:loading" />
                ) : (
                  <button
                    onClick={() => {
                      handleuploadafteredit();
                    }}
                  >
                    {language == "ar" ? "رفع الصورة" : "Upload Image"}
                  </button>
                )}
              </div>
              <label htmlFor="">
                {language == "ar"
                  ? "إسم الموقع بالانجليزيه"
                  : "English Site Name"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, name: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.name}
              />
              <label htmlFor="">
                {language == "ar" ? "إسم الموقع بالعربيه" : "arabic Site Name"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, name_ar: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.name_ar}
              />
              <label htmlFor="">
                {language == "ar" ? "العنوان" : "address"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, address: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.address}
              />
              <label htmlFor="">{language == "ar" ? "الايميل" : "Email"}</label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, email: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.email}
              />
              <label htmlFor="">
                {language == "ar" ? "رقم الهاتف" : "phone"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, phone: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.phone}
              />
              <label htmlFor="">
                {language == "ar" ? "السياسه" : "policy"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, policy: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.policy}
              />
              <label htmlFor="">
                {language == "ar" ? "السياسه بالعربيه" : "arabic policy"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, policy_ar: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.policy_ar}
              />
              <label htmlFor="">
                {language == "ar" ? "الأحكام بالانجليزيه" : "terms"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, terms: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.terms}
              />
              <label htmlFor="">
                {language == "ar" ? "الأحكام بالعربيه" : "terms in arabic"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, terms_ar: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.terms_ar}
              />
              {/* <label htmlFor="">{language == 'ar' ? "الضريبه" : "tax"}</label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, tax: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.tax}
              /> */}
              <label htmlFor="">
                {language == "ar"
                  ? "سياسه الارجاع بالانجليزيه"
                  : "return policy"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, return_policy: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.return_policy}
              />
              <label htmlFor="">
                {language == "ar"
                  ? "سياسة الارجاع بالعربيه"
                  : "arabic return policy"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({
                    ...sitedata,
                    return_policy_ar: e.target.value,
                  });
                }}
                type="text"
                placeholder=""
                value={sitedata.return_policy_ar}
              />
              <label htmlFor="">
                {language == "ar" ? "الشروط بالانجليزيه" : "Conditions"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, conditions: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.conditions}
              />
              <label htmlFor="">
                {language == "ar" ? "الشروط بالعربيه" : "Arabic Conditions"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, conditions_ar: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.conditions_ar}
              />
              <label htmlFor="">
                {language == "ar"
                  ? "عن الموقع بالانجليزيه"
                  : "About The Site In English"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, about: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.about}
              />
              <label htmlFor="">
                {language == "ar"
                  ? "عن الموقع بالعربيه"
                  : "About The Site In Arabic"}
              </label>
              <input
                onChange={(e) => {
                  setsitedata({ ...sitedata, about_ar: e.target.value });
                }}
                type="text"
                placeholder=""
                value={sitedata.about_ar}
              />
              <button>{language == "ar" ? "تعديل" : "Edit"}</button>
            </form>
          </div>
        }
      />
    </div>
  );
};

export default SiteData;
