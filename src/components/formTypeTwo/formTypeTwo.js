import React, { Fragment, useRef, useState } from "react";
import "./style.css";
import { Icon } from "@iconify/react";
function FormTypeTwo({ submitFunction, socialWData }) {
  const [choosedSrc, setChoosedSrc] = useState(false);
  const fileRef = useRef();
  return (
    <Fragment>
      {socialWData ? (
        socialWData.map((item, index) => {
          return (
            <form action="#" className="formTypeTwo" key={index}>
              <div className="inputfieldtypetwo">
                <label htmlFor="post">
                  <img src={item.logo} alt="" />
                  <span>{item.header_title}</span>
                </label>
                <textarea
                  id="post"
                  name="post"
                  placeholder="ماذا يدور في ذهنك..."
                />
              </div>
              <div className="inputField file">
                <label htmlFor={"post_img"}>
                  {" "}
                  {"تحميل الصورة"}
                </label>
                <label htmlFor={"post_img"} className="filefield">
                  <img
                    src="https://res.cloudinary.com/dtt1sk8xl/image/upload/v1689237813/My%20Folder/public/gallery-export_ql8pxa.svg"
                    alt=""
                  />
                  <label htmlFor={"post_img"}>
                    {"اختر صورة من جهازك او قم بالسحب هنا"}
                  </label>
                  <input
                    type={"file"}
                    id={"post_img"}
                    name={"post_img"}
                    ref={fileRef}
                    onChange={(e) => {


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
              <button className="btn btn-success">انشر الآن</button>
            </form>
          );
        })
      ) : (
        <Fragment></Fragment>
      )}
    </Fragment>
  );
}

export default FormTypeTwo;
