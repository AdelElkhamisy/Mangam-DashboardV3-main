import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import axios from "axios";
import { editlogo } from "../functions";
import { toast } from "react-toastify";
function EditLogo() {
  const noimage = "../../../assets/images/noimage.png";

  const initialSrc =
    "https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689192038/My%20Folder/public/WhatsApp_Image_2023-04-09_at_12.13_2_vegrtp.png";
  const [choosedSrc, setChoosedSrc] = useState(false);
  const [imageloading, setimageloading] = useState(false);
  const fileRef = useRef();
  const [editShow, setEditShow] = useState(false);
  const [removeShow, setRemoveShow] = useState(false);

  const [logo, setlogo] = useState("");
  const [newlogo, setnewlogo] = useState(false);

  const getlogo = () => {
    axios
      .get("https://roma-cosmetic.com/api/v1/admin/home/select_logo.php")
      .then((res) => {
        if (res.data.status === "success") {
          setlogo(res.data.message.logo);
        }
      });
  };
  const imageRef = useRef();

  const handlechangelogo = () => {
    setimageloading(true);
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
            toast.success("تمت الاضافة بنجاح");
            getlogo();
            setRemoveShow(false);
            if (fileRef.current) {
              fileRef.current.value = "";
            }
            setChoosedSrc(false);
            if (imageRef.current) {
              imageRef.current.value = "";
            }
          } else if (res.data.status == "error") {
            toast.error(res.data.message);
          } else {
            toast.error("حدث خطأ ما");
          }
        });
    } else {
      toast.error("أضف صورة أولا");
    }
    setimageloading(false);
  };

  useEffect(() => {
    getlogo();
  }, []);

  return (
    <div className="edit_logo">
      <div className="input_file_field_logo">
        <div className="choosenimages">
          <img src={logo} alt="" />
        </div>
        {editShow ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editlogo(e, setChoosedSrc, newlogo, {
                setEditShow,
                getlogo,
                fileRef,
              });
            }}
            className="input_file_field_logo edit_logo_form"
          >
            <span
              className="return_c _b_c"
              onClick={() => {
                setChoosedSrc(false);
                setEditShow(false);
              }}
            >
              <Icon icon="iwwa:delete" />
            </span>
            <div className="inputField file">
              <label htmlFor={"r_logo"}>{"شعار الموقع"}</label>
              <label htmlFor={"r_logo"} className="filefield">
                <img
                  src="https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689237813/My%20Folder/public/gallery-export_ql8pxa.svg"
                  alt=""
                />
                <label htmlFor={"r_logo"}>{"اختر صورة من جهازك"}</label>
                <input
                  type={"file"}
                  id={"r_logo"}
                  name={"r_logo"}
                  ref={fileRef}
                  onChange={(e) => {
                    setnewlogo(e.target.files[0]);

                    return setChoosedSrc(
                      e.currentTarget.files.length
                        ? e.currentTarget.files[0]
                          ? URL.createObjectURL(e.currentTarget.files[0])
                          : false
                        : false
                    );
                  }}
                />
              </label>
              {choosedSrc ? (
                <div className="choosenimages">
                  <span
                    className="return_c"
                    onClick={() => {
                      fileRef.current.value = "";
                      fileRef.current.files = null;
                      setChoosedSrc(false);
                    }}
                  >
                    <Icon icon="iwwa:delete" />
                  </span>
                  <img src={choosedSrc} alt="" />
                </div>
              ) : null}
            </div>
            <button>{imageloading ? "loading..." : "تعديل"}</button>
          </form>
        ) : null}
        {removeShow ? (
          <div className="input_file_field_logo remove_logo edit_logo_form">
            <span
              className="return_c _b_c r_b_c"
              onClick={() => {
                setEditShow(false);
                setRemoveShow(false);
              }}
            >
              <Icon icon="iwwa:delete" />
            </span>
            <div className="identifier">
              <h4>إزالة الشعار</h4>
              <p>تأكد من إضافة شعار آخر قبل الحذف</p>
            </div>
            <div className="inputField file">
              <label htmlFor={"r_logo"}>{"شعار الموقع"}</label>
              <label htmlFor={"r_logo"} className="filefield">
                <img
                  src="https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689237813/My%20Folder/public/gallery-export_ql8pxa.svg"
                  alt=""
                />
                <label htmlFor={"r_logo"}>{"اختر صورة من جهازك"}</label>
                <input
                  type={"file"}
                  id={"r_logo"}
                  name={"r_logo"}
                  ref={imageRef}
                  onChange={(e) => {
                    setnewlogo(e.target.files[0]);

                    return setChoosedSrc(
                      e.currentTarget.files.length
                        ? e.currentTarget.files[0]
                          ? URL.createObjectURL(e.currentTarget.files[0])
                          : false
                        : false
                    );
                  }}
                />
              </label>
              {choosedSrc ? (
                <div className="choosenimages">
                  <span
                    className="return_c"
                    onClick={() => {
                      fileRef.current.value = "";
                      fileRef.current.files = null;
                      setChoosedSrc(false);
                    }}
                  >
                    <Icon icon="iwwa:delete" />
                  </span>
                  <img src={choosedSrc} alt="" />
                </div>
              ) : null}
            </div>
            <div className="w_btns">
              <button
                onClick={() => {
                  handlechangelogo();
                  // setlogo("../../../assets/images/noimage.png")
                }}
                className="btn btn-danger"
              >
                {imageloading ? "loading..." : "إزالة الشعار"}
              </button>
            </div>
          </div>
        ) : null}
        <div className="w_btns">
          <label
            htmlFor={"w_logo"}
            className="btn btn-success"
            onClick={() => {
              setEditShow(true);
              setRemoveShow(false);
            }}
          >
            تعديل الشعار
          </label>
          <button
            className="btn btn-success"
            onClick={() => {
              setEditShow(false);
              setRemoveShow(true);
            }}
          >
            إزالة الشعار
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditLogo;
