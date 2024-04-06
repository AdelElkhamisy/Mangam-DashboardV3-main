import React, { useEffect, useState } from "react";
import DefaultLayout from "../../../layout/defaultlayout";
import ContentNav from "../../../datanavcontent";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Loader } from "rsuite";
import "./editproduct.css";
const EditProduct = () => {
  const language = useSelector((state) => state.language.lang);
  const location = useLocation();
  const { record } = location.state;
  // console.log(record)
  const [ColorsArr, setColorsArr] = useState([]);
  const [ProdDaWioutCol, setProdDaWioutCol] = useState({
    product_id: record.id,
    category_id: record.category_id,
    title: record.title,
    title_ar: record.title_ar,
    description: record.description,
    description_ar: record.description_ar,
    model_number: record.model_number,
    producing_company: record.producing_company,
    conditions: record.conditions,
    conditions_ar: record.conditions_ar,
    // grade:record.grade,
    isReturned: record.isReturned,
    return_period: record.return_period,
    store: record.store,
    loading: false
  });
  const [colorDeletedImages, setcolorDeletedImages] = useState([]);
  const [image, setimage] = useState(null);
  const [categories, setcategories] = useState([]);
  const [images, setimages] = useState([]);
  const [addloading, setaddloading] = useState(false);
  const [imageloading2, setimageloading2] = useState(false);
  const getproductbyid = () => {
    axios
      .get(`https://api.manjam.shop/v3/product/getProduct?id=${record.id}`)
      .then((res) => {
        // console.log(res.data);
        let allcolors = [...res.data.message[0]?.colors];
        let pushedcolors = allcolors.map((item, index) => {
          return { ...item, new: false };
        });
        for (let i = 0; i < allcolors.length; i++) {
          let allprops = allcolors[i]?.props;
          for (let j = 0; j < allprops?.length; j++) {
            let allvalues = allprops[j]?.values;
            for (let k = 0; k < allvalues?.length; k++) {
              allcolors[i].props[j].values[k]["new"] = false;
              allcolors[i].props[j].values[k]["loading"] = false;
            }
            allcolors[i].props[j]["new"] = false;
            allcolors[i].props[j]["loading"] = false;
          }
          allcolors[i]["new"] = false;
          allcolors[i]["loading"] = false;
        }
        setColorsArr(allcolors);
      });
  };
  const eqdata = () => {
    setProdDaWioutCol({
      product_id: record.id,
      category_id: record.category_id,
      title: record.title,
      title_ar: record.title_ar,
      description: record.description,
      description_ar: record.description_ar,
      model_number: record.model_number,
      producing_company: record.producing_company,
      conditions: record.conditions,
      conditions_ar: record.conditions_ar,
      // grade:record.grade,
      isReturned: record.isReturned,
      return_period: record.return_period,
      store: record.store
    });
  };
  const getcategories = async () => {
    await axios
      .get("https://api.manjam.shop/v3/category/getAll?type=admin")
      .then((res) => {
        // console.log(res.data.message)
        setcategories(res.data.message);
        // setcategory_id(res?.data[0]?.id)
        setProdDaWioutCol({ ...ProdDaWioutCol, category_id: res.data[0]?.id });
      });
  };
  const handleuploadaftereditcolors = (i) => {
    setimageloading2(true);
    const formdata = new FormData();
    formdata.append("image", image);
    axios
      .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
      .then((res) => {
        // console.log(res)
        if (res.data.imgUrl != "") {
          let allcolorsData = [...ColorsArr];
          toast.success("has uploaded");
          setimages([...images, res.data.imgUrl]);
          let list = [...ColorsArr];
          let obj = {
            id: allcolorsData[i].images.length,
            link: res.data.imgUrl
          };
          allcolorsData[i].images.push(obj);
          // if(list[i]['images']==""){
          //   list[i]['images']+=res.data.imgUrl;
          // }
          // else {
          //   list[i]['images']+="***";
          //   list[i]['images']+=res.data.imgUrl
          // }
          setColorsArr(allcolorsData);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading2(false);
      });
  };
  const handleuploadaftereditcolors2 = (i) => {
    setimageloading2(true);
    const formdata = new FormData();
    formdata.append("image", image);
    axios
      .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
      .then((res) => {
        // console.log(res)
        if (res.data.imgUrl != "") {
          toast.success("has uploaded");
          setimages([...images, res.data.imgUrl]);
          let allcolorsData = [...ColorsArr];
          let obj = {
            id: allcolorsData[i].images.length,
            link: res.data.imgUrl
          };
          ColorsArr[i].images.push(obj);
          setColorsArr(allcolorsData);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading2(false);
      });
  };

  const handlechangecolor = (e, i) => {
    const list = [...ColorsArr];
    list[i][e.target.name] = e.target.value;
    setColorsArr(list);
  };

  const handleaddcolor = (item) => {
    let images = "";
    if (item?.images?.length == 0) {
      toast.warn(
        language == "ar"
          ? "من فضلك إرفع صور للون أولا"
          : "Please Upload Image For color"
      );
      return;
    }
    for (let i = 0; i < item?.images.length; i++) {
      if (i != 0) {
        images += "***" + item?.images[i].link;
      } else {
        images += item?.images[i].link;
      }
    }
    const data_send = {
      product_id: record.id,
      images,
      color: item.color,
      color_ar: item.color_ar,
      // available_quantity:item.available_quantity,
      // price:item.price,
      color_code: item.color_code
    };
    let allcolors = [...ColorsArr];
    axios
      .post("https://api.manjam.shop/v3/color/add", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getproductbyid();
          toast.success(res.data.message);
          let pushedcolors = allcolors.map((it, index) => {
            if (item.color_code == it.color_code) {
              return { ...it, new: true };
            } else return { ...it };
          });
          setColorsArr(pushedcolors);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handlechagepropform = (e, item, index, itProp, indProp) => {
    let allColorsData = [...ColorsArr];
    let list2 = [...ColorsArr[index]?.props];
    list2[indProp][e.target.name] = e.target.value;
    allColorsData[index].ColorProperities = list2;
    setColorsArr(allColorsData);
  };

  const handleaddproperity = (it, item, index, ind) => {
    let allcolors = [...ColorsArr];
    setColorsArr(
      allcolors.map((item, index) => {
        if (item.color_id == it.color_id) {
          return { ...item, loading: true };
        } else return { ...item };
      })
    );
    const data_send = {
      color_id: it.color_id,
      label: it.label,
      label_ar: it.label_ar
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/add", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getproductbyid();
          toast.success(
            language == "ar" ? "تمت الإضافه بنجاح" : "Added Successfully"
          );

          // let allColorsArr=[...ColorsArr];
          // let list2=[...ColorsArr[index].ColorProperities];
          // list2[ind]['Properity_values']=[
          //   {
          //     label:'',
          //     label_ar:'',
          //     plus_price:'',
          //     stock:'',
          //     prop_id:res.data.message,
          //   }
          // ]
          // allColorsArr[index].ColorProperities=list2;
          // setColorsArr(allColorsArr);
        } else if (res.data.status == 0) {
          toast.error(language == "ar" ? "لم تتم الإضافه" : "Not Added");
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        let allcolors = [...ColorsArr];
        setColorsArr(
          allcolors.map((item, index) => {
            if (item.color_id == it.color_id) {
              return { ...item, loading: false };
            } else return { ...item };
          })
        );
      });
  };

  const handleaddPropsValue = (data) => {
    const data_send = {
      label: data.label,
      label_ar: data.label_ar,
      // plus_price:data.plus_price,
      // stock:data.stock,
      prop_id: data.prop_id
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/add_value", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getproductbyid();
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleeditpropvalue = (itPropValue) => {
    console.log(itPropValue);
    let allcolors = [...ColorsArr];
    for (let i = 0; i < allcolors.length; i++) {
      for (let j = 0; j < allcolors[i]?.props?.length; j++) {
        for (let k = 0; k < allcolors[i].props[j]?.values.length; k++) {
          if (allcolors[i].props[j]?.values[k].id == itPropValue.id) {
            allcolors[i].props[j].values[k].loading = true;
          }
        }
      }
    }
    setColorsArr(allcolors);
    const data_send = {
      label: itPropValue.label,
      label_ar: itPropValue.label_ar,
      prop_value_id: itPropValue.id
      // plus_price:itPropValue.plus_price
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/edit_value", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getproductbyid();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setaddloading(false);
      })
      .finally(() => {
        let allcolors = [...ColorsArr];
        for (let i = 0; i < allcolors.length; i++) {
          for (let j = 0; j < allcolors[i]?.props?.length; j++) {
            for (let k = 0; k < allcolors[i].props[j]?.values.length; k++) {
              if (allcolors[i].props[j]?.values[k].id == itPropValue.id) {
                allcolors[i].props[j].values[k].loading = false;
              }
            }
          }
        }
      });
  };

  const handlechangeprpvalue = (e, index, indProp, indPropValue) => {
    let allColorsArrData = [...ColorsArr];
    let list = ColorsArr[index].props[indProp].values[indPropValue];
    list[e.target.name] = e.target.value;
    allColorsArrData[index].props[indProp].values[indPropValue] = list;
    setColorsArr(allColorsArrData);
  };

  const handleeditcolor = (data, i) => {
    let allcolors = [ColorsArr];
    setColorsArr(
      allcolors.map((item, index) => {
        if (i * 1 == index * 1) {
          return { ...item, loading: true };
        } else return { ...item };
      })
    );
    let images = "";
    for (let i = 0; i < data?.images.length; i++) {
      if (i != 0) {
        images += "***" + data?.images[i].link;
      } else {
        images += data?.images[i].link;
      }
    }
    const data_send = {
      product_id: record.id,
      images,
      // price:data.price,
      // newPrice:data.price,
      color_code: data.color_code,
      color: data.color,
      color_id: data.id,
      color_ar: data.color_ar
    };

    axios
      .post("https://api.manjam.shop/v3/color/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getproductbyid();
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        let allcolors = [ColorsArr];
        setColorsArr(
          allcolors.map((item, index) => {
            if (i * 1 == index * 1) {
              return { ...item, loading: false };
            } else return { ...item };
          })
        );
      });
  };

  const handledeletecolorimg = (itimg, index, indimg) => {
    let allcolors = [...ColorsArr];
    let allcolorsimgs = [...ColorsArr[index].images];
    let pushedcolors = allcolorsimgs.filter((item) => item.id != itimg.id);
    allcolors[index].images = pushedcolors;
    setColorsArr(allcolors);
    setcolorDeletedImages(itimg);
  };

  const handleeditprop = (itProp, indProp, index) => {
    console.log(itProp);
    // console.log("ew")
    let allcolors = [...ColorsArr];
    console.log(allcolors);

    for (let i = 0; i < allcolors.length; i++) {
      let allprops = [...allcolors[i].props];
      for (let j = 0; j < allprops.length; j++) {
        if (indProp * 1 == j * 1) {
          allcolors[index].props[j].loading = true;
        }
      }
    }
    setColorsArr(allcolors);
    const data_send = {
      prop_id: itProp.id,
      label: itProp.label,
      label_ar: itProp.label_ar
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/edit", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          getproductbyid();
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        let allcolors = [...ColorsArr];
        console.log(allcolors);

        for (let i = 0; i < allcolors.length; i++) {
          let allprops = [...allcolors[i].props];
          for (let j = 0; j < allprops.length; j++) {
            if (indProp * 1 == j * 1) {
              console.log("ew");
              allcolors[index].props[j].loading = false;
            }
          }
        }
        setColorsArr(allcolors);
      });
  };

  const handleeditproductdata = () => {
    // console.log(ProdDaWioutCol)
    setProdDaWioutCol({ ...ProdDaWioutCol, loading: true });
    const data_send = {
      // category_id:ProdDaWioutCol.category_id,
      product_id: ProdDaWioutCol.product_id,
      title: ProdDaWioutCol.title,
      description: ProdDaWioutCol.description,
      model_number: ProdDaWioutCol.model_number,
      producing_company: ProdDaWioutCol.producing_company,
      conditions: ProdDaWioutCol.conditions,
      title_ar: ProdDaWioutCol.title_ar,
      conditions_ar: ProdDaWioutCol.conditions_ar,
      description_ar: ProdDaWioutCol.description_ar,
      isReturned: ProdDaWioutCol.isReturned,
      return_period: ProdDaWioutCol.return_period,
      store: ProdDaWioutCol.store
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/product/edit_product", data_send)
      .then((res) => {
        // console.log(res.data)
        if (res.data.status == 1) {
          toast.success(res.data.message);
          getproductbyid();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setProdDaWioutCol({ ...ProdDaWioutCol, loading: false });
      });
  };

  useEffect(() => {
    getproductbyid();
    eqdata();
    getcategories();
  }, []);
  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs products_table">
            <ContentNav
              head={
                language == "ar"
                  ? "تعديل المنتج وخصائصه"
                  : "Edit Product And It `s Features"
              }
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleeditproductdata();
              }}
              className="formaddproduct"
            >
              {/* <label htmlFor="">{language=='ar'?"الفئه":"Categoy"}</label>
              <select
              value={ProdDaWioutCol.category_id}
              onChange={(e) => {
                // setcategory_id(e.target.value);
                setProdDaWioutCol({...ProdDaWioutCol,category_id:e.target.value})
              }}
            >


              {categories?.map((it, index) => {
                return (
                  <option value={it.id} key={index}>
                    {it.title}
                  </option>
                );
              })}
              </select> */}
              <label htmlFor="">
                {language == "ar"
                  ? "إسم المنتج بالإنجليزيه"
                  : "Product Name In English"}
              </label>
              <input
                value={ProdDaWioutCol.title}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    title: e.target.value
                  });
                }}
                type="text"
                placeholder={
                  language == "ar"
                    ? "إسم المنتج بالإنجليزيه"
                    : "Product Name In English"
                }
              />
              {/* <label htmlFor="">{language=='ar'?"حالة المنتج":"Grade"}</label>
              <input value={ProdDaWioutCol.grade} onChange={(e)=>{
                setProdDaWioutCol({...ProdDaWioutCol,grade:e.target.value})
              }} type="text" placeholder={language=='ar'?"حالة المنتج":"grade"}/> */}
              <label htmlFor="">
                {language == "ar"
                  ? "إسم المنتج بالعربيه"
                  : "Product Name In Arabic"}
              </label>
              <input
                value={ProdDaWioutCol.title_ar}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    title_ar: e.target.value
                  });
                }}
                type="text"
                placeholder={
                  language == "ar"
                    ? "إسم المنتج بالعربيه"
                    : "Product Name In Arabic"
                }
              />

              <label htmlFor="">
                {language == "ar"
                  ? "وصف المنتج بالإنجليزيه"
                  : "Product Description In English"}
              </label>
              <textarea
                value={ProdDaWioutCol.description}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    description: e.target.value
                  });
                }}
                type="text"
                placeholder={
                  language == "ar"
                    ? "وصف المنتج بالإنجليزيه"
                    : "Product Description In English"
                }
              />

              <label htmlFor="">
                {language == "ar"
                  ? "وصف المنتج بالعربيه"
                  : "Product Description In Arabic"}
              </label>
              <textarea
                value={ProdDaWioutCol.description_ar}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    description_ar: e.target.value
                  });
                }}
                type="text"
                placeholder={
                  language == "ar"
                    ? "وصف المنتج بالعربيه"
                    : "Product Description In Arabic"
                }
              />

              <label htmlFor="">
                {language == "ar" ? "رقم النموذج" : "Model Number"}
              </label>
              <input
                value={ProdDaWioutCol.model_number}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    model_number: e.target.value
                  });
                }}
                type="text"
                placeholder={language == "ar" ? "رقم النموذج" : "Model Number"}
              />

              <label htmlFor="">
                {language == "ar" ? "إسم الشركه" : "Comapny Name"}
              </label>
              <input
                value={ProdDaWioutCol.producing_company}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    producing_company: e.target.value
                  });
                }}
                type="text"
                placeholder={language == "ar" ? "إسم الشركه" : "Company Name"}
              />

              {/* <label htmlFor="">{language=='ar'?"سوف يتم توفيره بدايه من":"Will Avilable After"}</label>
              <input  onChange={(e)=>{
                // console.log(e)
                // console.log(moment(e.target.valueAsNumber).format("YYYY-mm-dd H:m:s"))
                setProdDaWioutCol({...ProdDaWioutCol,will_av_after:e.target.value})
              }} type="date" placeholder={language=='ar'?"سوف يتم توفيره بدايه من":"Will Avilable After"}/>

              <label htmlFor="">{language=='ar'?"سوف يتم توفيره لوقت":"Will Avilable For"}</label>
              <input min={ProdDaWioutCol.will_av_after} onChange={(e)=>{
                setProdDaWioutCol({...ProdDaWioutCol,will_av_for:e.target.value})
              }} type="date" placeholder={language=='ar'?"سوف يتم توفيره لوقت":"Will Avilable For"}/> */}

              <label htmlFor="">
                {language == "ar"
                  ? "الشروط بالانجليزيه"
                  : "Conditions In English"}
              </label>
              <input
                value={ProdDaWioutCol.conditions}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    conditions: e.target.value
                  });
                }}
                type="text"
                placeholder={
                  language == "ar"
                    ? "الشروط بالإنجليزيه"
                    : "Conditions In English"
                }
              />

              <label htmlFor="">
                {language == "ar" ? "الشروط بالعربيه" : "Conditions In Arabic"}
              </label>
              <input
                value={ProdDaWioutCol.conditions_ar}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    conditions_ar: e.target.value
                  });
                }}
                type="text"
                placeholder={
                  language == "ar" ? "الشروط بالعربيه" : "Conditions In Arabic"
                }
              />
              <label htmlFor="">
                {language == "ar" ? "حالة الرجوع" : "Return Status"}
              </label>
              <select
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    isReturned: e.target.value
                  });
                }}
                value={ProdDaWioutCol.isReturned}
                name=""
                id=""
              >
                <option
                  onClick={() => {
                    setProdDaWioutCol({ ...ProdDaWioutCol, isReturned: 1 });
                  }}
                  value="1"
                >
                  {language == "ar" ? "ممكن" : "possible"}
                </option>
                <option
                  onClick={() => {
                    setProdDaWioutCol({ ...ProdDaWioutCol, isReturned: 0 });
                  }}
                  value="0"
                >
                  {language == "ar" ? "غير ممكن" : "immpossible"}
                </option>
              </select>
              <label htmlFor="">
                {language == "ar"
                  ? "المده المسموح فيها الارجاع"
                  : "Return Period"}
              </label>
              <input
                disabled={ProdDaWioutCol.isReturned == 0 ? true : false}
                value={ProdDaWioutCol.return_period}
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    return_period: e.target.value
                  });
                }}
                placeholder={
                  language == "ar"
                    ? "المده المسموح فيها الارجاع"
                    : "Return Period"
                }
                type="number"
              />
              <label htmlFor="">
                {language == "ar" ? "المخزن المتوفر فيه" : "Store"}
              </label>
              <select
                onChange={(e) => {
                  setProdDaWioutCol({
                    ...ProdDaWioutCol,
                    store: e.target.value
                  });
                }}
                value={ProdDaWioutCol.store}
                name=""
                id=""
              >
                <option
                  onClick={(e) => {
                    setProdDaWioutCol({ ...ProdDaWioutCol, store: "ksa" });
                  }}
                  value="ksa"
                >
                  {language == "ar" ? "السعوديه" : "Saudi Aribia"}
                </option>
                <option
                  onClick={(e) => {
                    setProdDaWioutCol({ ...ProdDaWioutCol, store: "uae" });
                  }}
                  value="uae"
                >
                  {language == "ar" ? "الامارات" : "The UAE"}
                </option>
                <option
                  onClick={(e) => {
                    setProdDaWioutCol({
                      ...ProdDaWioutCol,
                      store: "uae***ksa"
                    });
                  }}
                  value="uae***ksa"
                >
                  {language == "ar" ? "الامارات والسعوديه" : "The UAE"}
                </option>
              </select>
              {ProdDaWioutCol.loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px"
                  }}
                >
                  <Loader />
                </div>
              ) : (
                <button>
                  {language == "ar" ? "تعديل المنتج" : "edit the product"}
                </button>
              )}
            </form>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "20px 0px"
              }}
            >
              <h4>{language == "ar" ? "إضافة لون جديد" : "Add New Color"}</h4>
              <h4
                onClick={() => {
                  setColorsArr([
                    ...ColorsArr,
                    {
                      product_id: record?.id,
                      images: [],
                      // price:'',
                      // new_price:'',
                      // available_quantity:'',
                      color_code: "",
                      color: "",
                      color_ar: "",
                      new: true,
                      loading: false,
                      ColorProperities: []
                    }
                  ]);
                }}
              >
                <AiOutlinePlus style={{ cursor: "pointer" }} />
              </h4>
            </div>
            {ColorsArr?.map((item, index) => {
              return (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (item.new) {
                        handleaddcolor(item);
                      } else {
                        handleeditcolor(item, index);
                      }
                    }}
                    className="from_Shipping"
                  >
                    <label htmlFor="">
                      {language == "ar" ? "الصور" : "Images"}
                    </label>
                    <div className="color_images">
                      {/* {console.log(item.images)} */}
                      {
                        //console.log(item)

                        item?.images?.map((itimg, indimg) => {
                          // console.log(itimg)
                          return (
                            <div key={indimg} className="color_img">
                              <img src={itimg.link} alt="" />
                              <div
                                onClick={() => {
                                  handledeletecolorimg(itimg, index, indimg);
                                }}
                                className="img_rem"
                              >
                                <AiOutlineClose />
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    <div className="updiv">
                      <input
                        onChange={(e) => {
                          setimage(e.target.files[0]);
                        }}
                        type="file"
                      />
                      {imageloading2 ? (
                        <Icon icon="eos-icons:loading" />
                      ) : (
                        <button
                          onClick={() => {
                            if (item.new) {
                              handleuploadaftereditcolors2(index);
                            } else {
                              handleuploadaftereditcolors(index);
                            }
                          }}
                        >
                          {language == "ar" ? "رفع الصورة" : "Upload Image"}
                        </button>
                      )}
                    </div>
                    <label htmlFor="">
                      {language == "ar" ? "كود اللون" : "Color Code"}
                    </label>
                    <input
                      value={item.color_code}
                      name="color_code"
                      type="color"
                      placeholder={
                        language == "ar" ? "كود اللون" : "Color Code"
                      }
                      onChange={(e) => {
                        handlechangecolor(e, index);
                      }}
                    />
                    <label htmlFor="">
                      {language == "ar"
                        ? "اللون بالانجليزيه"
                        : "Color Name In English"}
                    </label>
                    <input
                      value={item.color}
                      name="color"
                      type="text"
                      placeholder={
                        language == "ar"
                          ? "إسم اللون بالانجليزيه"
                          : "Color In English"
                      }
                      onChange={(e) => {
                        handlechangecolor(e, index);
                      }}
                    />
                    {/* <label htmlFor="">Color In Arabic</label> */}
                    <label htmlFor="">
                      {language == "ar"
                        ? "اللون بالعربيه"
                        : "Color Name In Arabic"}
                    </label>
                    <input
                      value={item.color_ar}
                      name="color_ar"
                      type="text"
                      placeholder={
                        language == "ar"
                          ? "إسم اللون بالعربيه"
                          : "Color In Arabic"
                      }
                      onChange={(e) => {
                        handlechangecolor(e, index);
                      }}
                    />
                    {item.loading ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "10px"
                        }}
                      >
                        <Loader />
                      </div>
                    ) : item.new == true ? (
                      <button>{language == "ar" ? "إضافه" : "Add"}</button>
                    ) : (
                      <button>{language == "ar" ? "تعديل" : "Edit"}</button>
                    )}
                  </form>
                  {item.new ? null : (
                    <div
                      style={{
                        margin: "20px 0px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}
                    >
                      <h4>
                        {language == "ar"
                          ? "إضافة خاصيه"
                          : "Add Another Property"}
                      </h4>
                      {/* <AiOutlinePlus
                        onClick={()=>{
                          let allColorsData=[...ColorsArr];
                          allColorsData[index].props.push({
                            id:allColorsData[allColorsData.length-1].props?.length+1,
                            color_code:item.color_code,
                            label:'',
                            label_ar:'',
                            // stock:'',
                            loading:false,
                            new:true,
                            color_id:item?.id,
                          });
                          setColorsArr(allColorsData)
                          // setColorsPropeity([...ColorsPropeity,{
                          //   id:ColorsPropeity?.length+1,
                          //   color_code:colorproperty.color_code,
                          //   label:'',
                          //   label_ar:'',
                          //   // stoke:'',
                          //   stock:'',
                          //   color_id:ColorsPropeity[0]?.color_id,
                          // }]);
                        }}
                      style={{ cursor:'pointer',fontSize:'20px' }}/> */}
                    </div>
                  )}
                  {item?.props?.map((itProp, indProp) => {
                    return (
                      <>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          className="from_Shipping colform"
                          action=""
                        >
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "50%",
                              backgroundColor: `${item.color_code}`
                            }}
                          ></div>
                          <label htmlFor="">
                            {language == "ar"
                              ? "إسم الخاصيه بالإنجليزيه"
                              : "Label In English"}
                          </label>
                          <input
                            value={itProp.label}
                            name="label"
                            onChange={(e) => {
                              // setaddobj({...addobj,label:e.target.value})
                              handlechagepropform(
                                e,
                                item,
                                index,
                                itProp,
                                indProp
                              );
                            }}
                            type="text"
                          />
                          <label htmlFor="">
                            {language == "ar"
                              ? "إسم الخاصيه بالعربيه"
                              : "Label In Arabic"}
                          </label>
                          <input
                            value={itProp.label_ar}
                            name="label_ar"
                            onChange={(e) => {
                              // setaddobj({...addobj,label_ar:e.target.value})
                              handlechagepropform(
                                e,
                                item,
                                index,
                                itProp,
                                indProp
                              );
                            }}
                            type="text"
                          />
                          {itProp.new ? (
                            itProp.loading ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  margin: "10px 0px"
                                }}
                              >
                                <Loader />
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  handleaddproperity(itProp);
                                }}
                              >
                                {language == "ar" ? "إضافه" : "Add"}
                              </button>
                            )
                          ) : itProp.loading ? (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "10px 0px"
                              }}
                            >
                              <Loader />
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                                flexWrap: "wrap"
                              }}
                            >
                              <button
                                onClick={() => {
                                  if (itProp.new) {
                                    handleaddproperity(itProp);
                                  } else {
                                    handleeditprop(itProp, indProp, index);
                                  }
                                }}
                              >
                                {language == "ar" ? (
                                  itProp.loading ? (
                                    <Loader />
                                  ) : (
                                    "تعديل"
                                  )
                                ) : (
                                  "Edit"
                                )}
                              </button>
                              <button
                                onClick={() => {
                                  const data_send = {
                                    prop_id: itProp.id
                                  };
                                  axios
                                    .post(
                                      "https://api.manjam.shop/v3/color_props/delete",
                                      data_send
                                    )
                                    .then((res) => {
                                      if (res.data.status == 1) {
                                        toast.success(res.data.message);
                                        getproductbyid();
                                      } else if (res.data.status == 0) {
                                        toast.error(res.data.message);
                                      } else {
                                        toast.error(
                                          language == "ar"
                                            ? "حدث خطأ ما"
                                            : "Something went error"
                                        );
                                      }
                                    })
                                    .catch((err) => console.log(err))
                                    .finally(() => {});
                                }}
                                className="delete btn btn-danger"
                              >
                                {language == "ar" ? "حذف" : "Delete"}
                              </button>
                            </div>
                          )}
                        </form>
                        {itProp.new ? null : (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              margin: "20px 0px"
                            }}
                          >
                            <h4>
                              {language == "ar"
                                ? "إضافة قيمة"
                                : "Add Another Value"}
                            </h4>
                            <AiOutlinePlus
                              onClick={() => {
                                let allColorsArr = [...ColorsArr];
                                let list2 = itProp?.values;
                                list2.push({
                                  label: "",
                                  label_ar: "",
                                  // plus_price:'',
                                  new: true,
                                  // stock:'',
                                  prop_id: itProp.id,
                                  loading: false
                                });
                                allColorsArr[index].props[indProp].values =
                                  list2;
                                setColorsArr(allColorsArr);
                              }}
                              style={{ cursor: "pointer", fontSize: "20px" }}
                            />
                          </div>
                        )}
                        {
                          // console.log(itProp)
                          itProp?.values?.map((itPropValue, indPropValue) => {
                            return (
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                }}
                                style={{ margin: "20px 0px" }}
                                className="from_Shipping"
                              >
                                <label htmlFor="">
                                  {language == "ar"
                                    ? "إسم الخاصيه بالإنجليزيه"
                                    : "Label In English"}
                                </label>
                                <input
                                  value={itPropValue.label}
                                  name="label"
                                  onChange={(e) => {
                                    handlechangeprpvalue(
                                      e,
                                      index,
                                      indProp,
                                      indPropValue
                                    );
                                    // setaddobjpropval({...addobjpropval,label:e.target.value})
                                  }}
                                  type="text"
                                />
                                <label htmlFor="">
                                  {language == "ar"
                                    ? "إسم الخاصيه بالعربيه"
                                    : " Label In Arabic"}
                                </label>
                                <input
                                  value={itPropValue.label_ar}
                                  name="label_ar"
                                  onChange={(e) => {
                                    handlechangeprpvalue(
                                      e,
                                      index,
                                      indProp,
                                      indPropValue
                                    );
                                    // setaddobjpropval({...addobjpropval,label_ar:e.target.value})
                                  }}
                                  type="text"
                                />
                                {/* <label htmlFor="">{language=='ar'?"قيمة الزياده":"Plus value"}</label>
                                      <input value={itPropValue.plus_price} name="plus_price" onChange={(e)=>{
                                        handlechangeprpvalue(e,index,indProp,indPropValue)
                                        // setaddobjpropval({...addobjpropval,plus_price:e.target.value})
                                      }} type="text" /> */}
                                {/* <label htmlFor="">{language=='ar'?"المخزون":"Stock"}</label>
                                      <input value={itPropValue.stock} name="stock" onChange={(e)=>{
                                        handlechangeprpvalue(e,index,indProp,indPropValue)
                                        // setaddobjpropval({...addobjpropval,stock:e.target.value})
                                      }} type="text" /> */}
                                {itPropValue.new ? (
                                  itPropValue.loading ? (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        margin: "10px 0px"
                                      }}
                                    >
                                      <Loader />
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        handleaddPropsValue(itPropValue);
                                      }}
                                    >
                                      {language == "ar" ? "إضافه" : "Add"}
                                    </button>
                                  )
                                ) : itPropValue.loading ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      margin: "10px 0px"
                                    }}
                                  >
                                    <Loader />
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      gap: "4px",
                                      flexWrap: "wrap"
                                    }}
                                  >
                                    <button
                                      onClick={() => {
                                        if (itPropValue.new) {
                                          handleaddPropsValue(itPropValue);
                                        } else {
                                          handleeditpropvalue(itPropValue);
                                        }
                                      }}
                                    >
                                      {language == "ar" ? (
                                        addloading ? (
                                          <Loader />
                                        ) : (
                                          "تعديل"
                                        )
                                      ) : (
                                        "Edit"
                                      )}
                                    </button>
                                    <button
                                      onClick={() => {
                                        const data_send = {
                                          prop_value_id: itPropValue.id
                                        };
                                        axios
                                          .post(
                                            "https://api.manjam.shop/v3/color_props/delete_value",
                                            data_send
                                          )
                                          .then((res) => {
                                            if (res.data.status == 1) {
                                              toast.success(res.data.message);
                                              getproductbyid();
                                            } else if (res.data.status == 0) {
                                              toast.error(res.data.message);
                                            } else {
                                              toast.error(
                                                language == "ar"
                                                  ? "حدث خطأ ما"
                                                  : "Something went error"
                                              );
                                            }
                                          })
                                          .catch((err) => console.log(err))
                                          .finally(() => {});
                                      }}
                                      className="delete btn btn-danger"
                                    >
                                      {language == "ar" ? "حذف" : "Delete"}
                                    </button>
                                  </div>
                                )}
                              </form>
                            );
                          })
                        }
                      </>
                    );
                  })}
                </>
              );
            })}
          </div>
        }
      />
    </div>
  );
};

export default EditProduct;
