import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import { Icon } from "@iconify/react";
import axios from "axios";
import { toast } from "react-toastify";
import { Toggle } from "rsuite";
import { useSelector } from "react-redux";
// import DotLoader from "react-spinners/DotLoader";
function Form({ inputs, submitFunction, buttonLabel }) {
  const [choosedSrc, setChoosedSrc] = useState(false);
  const [image, setimage] = useState(null);
  const [images, setimages] = useState([]);
  const [uploadloading, setuploadloading] = useState(false);
  const [category_id, setcategory_id] = useState("");
  const fileRef = useRef();
  const language = useSelector((state) => state.language.lang);
  const handleuploadimage = ({ getLink }) => {
    if (image == null) {
      toast.warn("أختر صوره");
      return;
    }
    setuploadloading(true);
    const formData = new FormData();
    formData.append("image", image);
    axios
      .post(
        "https://roma-cosmetic.com/api/v1/admin/home/img_uploader.php",
        formData
      )
      .then((res) => {
        if (res.data.status === "success") {
          toast.success("تم الرفع بنجاح");
          setimages([...images, res.data.message]);
          if (getLink) {
            getLink(res.data.message);
          }
          setimage(null);
          setChoosedSrc(false);
        }
      })
      .finally(() => {
        setuploadloading(false);
      })
      .catch((err) => console.log(err));
  };

  const [categories, setcategories] = useState([]);
  const getcategories = async () => {
    await axios
      .get("https://api.manjam.shop/v3/category/getAll?type=admin")
      .then((res) => {
        // console.log(res.data)
        setcategories(res.data);
        // setcategory_id(res.data?.message[0]?.categoryId);
      });
  };
  useEffect(() => {
    getcategories();
  }, []);

  return (
    <form
      id="type_1"
      action="#"
      onSubmit={(e) => {
        e.preventDefault();
        return submitFunction ? submitFunction(e, images, category_id) : null;
      }}
    >
      {inputs
        ? inputs.map((item, index) => {
            if (item.type == "textarea") {
              return (
                <div className="inputField" key={index}>
                  <label htmlFor={item.id}>
                    {language == "ar" ? item?.label_ar : item?.label}
                  </label>
                  <textarea
                    required={item.required ? true : false}
                    type={item.type}
                    id={item.id}
                    name={item.name}
                    placeholder={
                      language == "ar"
                        ? item?.placeholder_ar
                        : item?.placeholder
                    }
                  />
                </div>
              );
            } else if (item.type == "file") {
              return (
                <div className="inputField file" key={index}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <label htmlFor={item.id}>
                      {language == "ar" ? item?.label_ar : item?.label}
                    </label>
                    {uploadloading ? (
                      <div>
                        <h4>loading...</h4>
                        {/* <DotLoader color="#36d7b7" /> */}
                      </div>
                    ) : item.show ? (
                      <Icon
                        onClick={() => {
                          item.handleuploadimage
                            ? item.handleuploadimage()
                            : handleuploadimage({ getLink: item?.getLink });
                        }}
                        className=""
                        style={{ fontSize: "30px", cursor: "pointer" }}
                        icon="line-md:cloud-upload-loop"
                      />
                    ) : null}
                  </div>
                  <label htmlFor={item.id} className="filefield">
                    <img
                      src="https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689237813/My%20Folder/public/gallery-export_ql8pxa.svg"
                      alt=""
                    />
                    <label htmlFor={item.id}>
                      {language == "ar"
                        ? item?.placeholder_ar
                        : item.placeholder}
                    </label>

                    <input
                      required={item.required ? true : false}
                      type={item.type}
                      id={item.id}
                      name={item.name}
                      ref={fileRef}
                      placeholder={
                        language == "ar"
                          ? item.placeholder
                          : item?.placeholder_ar
                      }
                      onChange={(e) => {
                        setimage(e.target.files[0]);

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
              );
            } else if (item.type == "selectCategory") {
              return (
                <div className="inputField" key={index}>
                  <label htmlFor={item.id}>
                    {language == "ar" ? item?.label_ar : item?.label}
                  </label>
                  <select
                    required={item.required ? true : false}
                    value={category_id}
                    onChange={(e) => {
                      setcategory_id(e.target.value);
                      if (item.changeFunction) {
                        item.changeFunction(e.target.value);
                      }
                    }}
                    id={item.id}
                    name={item.name}
                    placeholder={
                      language == "ar" ? item.placeholder : item?.placeholder_ar
                    }
                  >
                    {categories && categories.length
                      ? categories?.map((it, index) => {
                          return (
                            <option value={it.id} key={index}>
                              {it.title}
                            </option>
                          );
                        })
                      : null}
                  </select>
                </div>
              );
            } else if (item.type == "children") {
              return <div className="formChildren"> {item.children()}</div>;
            } else if (item.type == "switch") {
              return (
                <div className="inputField" key={index}>
                  <label htmlFor={item.id}>
                    {language == "ar" ? item?.label_ar : item.label}
                  </label>
                  <Toggle defaultChecked />
                </div>
              );
            } else {
              return (
                <div className="inputField" key={index}>
                  <label htmlFor={item.id}>
                    {language == "ar" ? item?.label_ar : item?.label}
                  </label>
                  <input
                    defaultValue={item?.value}
                    type={item.type}
                    disabled={item?.disable}
                    id={item.id}
                    name={item.name}
                    min={item?.min == true ? inputs?.inputs[7]?.value : ""}
                    placeholder={
                      language == "ar"
                        ? item?.placeholder_ar
                        : item?.placeholder
                    }
                    required={item.required ? true : false}
                  />
                </div>
              );
            }
          })
        : null}
      <button>
        {buttonLabel ? buttonLabel : language == "ar" ? "إضافة" : "Add"}
      </button>
    </form>
  );
}

export default Form;
