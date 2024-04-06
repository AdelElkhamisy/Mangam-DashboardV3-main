import React, { useEffect, useState } from "react";
import DefaultLayout from "../../layout/defaultlayout";
import ContentNav from "../../datanavcontent";
import "./style.css";
import Switches from "../../components/switches";
import {
  add_category,
  add_class,
  add_contact,
  add_offer,
  add_user,
  address_input,
  categories_input,
  changeFunction,
  choices,
  chooseDep,
  classification_input,
  contact_input,
  nameMont,
  offer_input,
  user_input
} from "./functions";
import Form from "../../components/form";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { Icon } from "@iconify/react";
import { Loader } from "rsuite";
import { AiOutlinePlus } from "react-icons/ai";
function Addition() {
  const language = useSelector((state) => state.language.lang);
  const [choice, setChoice] = useState("product");
  const [categoryId, setCategoryId] = useState(false);
  const [image, setimage] = useState(null);
  const [categories, setcategories] = useState([]);
  const [category_id, setcategory_id] = useState([]);
  const [showcorlorform, setshowcorlorform] = useState(false);

  const [ColorsPropeity, setColorsPropeity] = useState([]);

  const [colorproperty, setcolorproperty] = useState({
    product_id: "",
    images: "",
    // price:'',
    // new_price:'',
    // discount:'',
    available_quantity: "",
    color_code: "",
    color: "",
    color_ar: ""
  });

  const [addedproduct, setaddedproduct] = useState({
    category_id: "",
    title: "",
    title_ar: "",
    description: "",
    grade: "new",
    description_ar: "",
    model_number: "",
    producing_company: "",
    // will_av_after:'',
    // will_av_for:'',
    conditions: "",
    conditions_ar: "",
    isReturned: "1",
    return_period: "0",
    store: "ksa"
  });
  const [addedcategory, setaddedcategory] = useState({
    title: "",
    title_ar: "",
    image_url: ""
  });
  const [productloading, setproductloading] = useState(false);
  const [ColorId, setColorId] = useState("");
  const [images, setimages] = useState([]);
  const [imagecategory, setimagecategory] = useState(null);
  const [imageloading, setimageloading] = useState(false);
  const [imageloading2, setimageloading2] = useState(false);
  const [addloading, setaddloading] = useState(false);
  const [AddedProductId, setAddedProductId] = useState("");

  const [ColorsArr, setColorsArr] = useState([
    {
      product_id: "",
      images: "",
      available_quantity: "",
      color_code: "",
      color: "",
      color_ar: "",
      ColorProperities: [],
      colloading: false
    }
  ]);

  const [addobj, setaddobj] = useState({
    label: "",
    label_ar: ""
    // stoke:'',
  });
  const [addobjpropval, setaddobjpropval] = useState({
    label: "",
    label_ar: ""
    // plus_price:'',
    // stock:'',
  });
  const [bannerdata, setbannerdata] = useState({
    title: "",
    title_ar: "",
    text: "",
    text_ar: "",
    imageLink: "",
    link: ""
  });
  const getcategories = async () => {
    await axios
      .get("https://api.manjam.shop/v3/category/getAll?type=admin")
      .then((res) => {
        // console.log(res.data.message)
        setcategories(res.data.message);
        setcategory_id(res?.data.message[0]?.id);
        // setaddedproduct({...addedproduct,category_id})
        setaddedproduct({
          ...addedproduct,
          category_id: res.data.message[0]?.id
        });
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
          toast.success("has uploaded");
          setimages([...images, res.data.imgUrl]);
          let list = [...ColorsArr];
          if (list[i]["images"] == "") {
            list[i]["images"] += res.data.imgUrl;
            // console.log("one");
          } else {
            list[i]["images"] += "***";
            list[i]["images"] += res.data.imgUrl;
            // console.log("two");
            // console.log(list[i]['images']);
          }
          // console.log(list)
          setColorsArr(list);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading2(false);
      });
  };

  const addProduct = () => {
    if (
      addedproduct.title == "" ||
      addedproduct.title_ar == "" ||
      addedproduct.grade == "" ||
      addedproduct.description == "" ||
      addedproduct.description_ar == "" ||
      addedproduct.model_number == "" ||
      addedproduct.producing_company == "" ||
      addedproduct.conditions == "" ||
      addedproduct.conditions_ar == "" ||
      addedproduct.isReturned == "" ||
      addedproduct.store == ""
    ) {
      toast.warn(language == "ar" ? "أكمل بقية البيانات" : "Complete The Data");
      return;
    }
    setproductloading(true);

    const data_send = {
      ...addedproduct
    };
    axios
      .post("https://api.manjam.shop/v3/product/add_product", data_send)
      .then((res) => {
        // console.log(res.data)
        if (res.data.status === 1) {
          toast.success(res.data.message);
          setcolorproperty({ ...colorproperty, product_id: res.data.message });
          // window.location.reload();
          setshowcorlorform(true);
          setAddedProductId(res.data.message);
        } else if (res.data.status === 0) {
          toast.error(res.data.message);
        } else {
          toast.error("حدث خطأ ما");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setproductloading(false);
      });
  };

  const handlechangecolor = (e, i) => {
    // console.log(e);
    // console.log(i);
    const list = [...ColorsArr];
    list[i][e.target.name] = e.target.value;
    setColorsArr(list);
  };

  useEffect(() => {
    getcategories();
  }, []);
  useEffect(() => {
    // console.log(choice);
  }, [choice]);
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
          setbannerdata({ ...bannerdata, imageLink: res.data.imgUrl });
          // setorderData({...orderData,image:res.data.imgUrl});
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
      });
  };
  const handleaddbanner = () => {
    setaddloading(true);
    const data_send = {
      ...bannerdata
    };
    // console.log(data_send)
    axios
      .post("https://api.manjam.shop/v3/banner/add_banner", data_send)
      .then((res) => {
        // console.log(res)
        if (res.data.status == 1) {
          toast.success(res.data.message);
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدذ خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setaddloading(false);
      });
  };
  const handleuploadimage = () => {
    setimageloading(true);
    const formdata = new FormData();
    formdata.append("image", image);
    axios
      .post("https://image-uploader-ochre.vercel.app/image/upload", formdata)
      .then((res) => {
        // console.log(res.data)
        if (res.data.imgUrl != "") {
          toast.success("has uploaded");
          setaddedcategory({ ...addedcategory, image_url: res.data.imgUrl });
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setimageloading(false);
      });
  };
  const handleaddcategory = () => {
    const data_send = {
      ...addedcategory
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/category/add", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          window.location.reload();
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleaddcolor = (item, i) => {
    // console.log(item)
    if (item.color == "" || item.color_ar == "" || item.color_code == "") {
      toast.warn(language == "ar" ? "أكمل البيانات" : "Complete Data");
      return;
    }
    let allColorsArr = [...ColorsArr];
    setColorsArr(
      allColorsArr.map((it, index) => {
        if (index * 1 == i * 1) {
          return { ...it, colloading: true };
        } else return { ...it };
      })
    );
    // console.log(item)
    // console.log(colorproperty)
    let imagesarr = [...images];
    let imagesstr = imagesarr.join("***");
    const data_send = {
      product_id: AddedProductId,
      images: item.images,
      color: item.color,
      color_ar: item.color_ar,
      color_code: item.color_code
    };
    // console.log(data_send);
    axios
      .post("https://api.manjam.shop/v3/color/add", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(res.data.message);
          setColorId(res.data.message);
          setColorsPropeity([
            ...ColorsPropeity,
            {
              id: ColorsPropeity?.length + 1,
              color_code: colorproperty.color_code,
              label: "",
              label_ar: "",
              // stoke:'',
              // stock:'',
              color_id: res.data.message
            }
          ]);
          let allColorsData = [...ColorsArr];
          // console.log(allColorsData)
          let pushedcolors = allColorsData.map((item, index) => {
            if (index * 1 == i * 1) {
              return {
                ...item,
                colloading: false,
                ColorProperities: [
                  {
                    id:
                      allColorsData[allColorsData.length - 1].ColorProperities
                        ?.length + 1,
                    color_code: colorproperty.color_code,
                    label: "",
                    label_ar: "",
                    color_id: res.data.message,
                    proploading: false
                  }
                ]
              };
            } else {
              return { ...item };
            }
          });
          setColorsArr(pushedcolors);
          // console.log(pushedcolors)
          // allColorsData[allColorsData.length-1]['ColorProperities']=[
          //   {
          //     id:allColorsData[allColorsData.length-1].ColorProperities?.length+1,
          //     color_code:colorproperty.color_code,
          //     label:'',
          //     label_ar:'',
          //     color_id:res.data.message,
          //   }
          // ]

          // let SelectedColor=allColorsData.filter(item=>item.)
        } else if (res.data.status == 0) {
          toast.error(res.data.message);
          let allColorsArr2 = [...ColorsArr];
          setColorsArr(
            allColorsArr2.map((it, index) => {
              if (index * 1 == i * 1) {
                return { ...it, colloading: false };
              } else return { ...it };
            })
          );
        } else {
          let allColorsArr2 = [...ColorsArr];
          setColorsArr(
            allColorsArr2.map((it, index) => {
              if (index * 1 == i * 1) {
                return { ...it, colloading: false };
              } else return { ...it };
            })
          );
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something went error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        // let allColorsArr2=[...ColorsArr];
        // setColorsArr(allColorsArr2.map((it,index)=>{
        //   if(index*1==i*1){
        //     return {...it,colloading:false}
        //   }
        //   else return{...it}
        // }))
      });
  };

  const handlechagepropform = (e, i, index) => {
    // console.log(e);
    // console.log(i);
    let list = [...ColorsPropeity];
    list[i][e.target.name] = e.target.value;

    // console.log(list)
    setColorsPropeity(list);
    let allColorsData = [...ColorsArr];
    // console.log(allColorsData)
    let list2 = [...ColorsArr[index].ColorProperities];
    list2[i][e.target.name] = e.target.value;
    // console.log(list2)
    allColorsData[index].ColorProperities = list2;
    setColorsArr(allColorsData);
    // console.log(allColorsData)
    // let pushedarr=[];
    // for(let k=0;k<allColorsData?.ColorProperities?.length;k++){
    //   if(i+1==list2[i]){

    //   }
    // }
  };

  const handleaddproperity = (it, item, index, ind) => {
    if (it.label == "" || it.label_ar == "") {
      toast.warn(language == "ar" ? "أكمل البيانات" : "Complete Data");
      return;
    }
    let allColorsArr = [...ColorsArr];
    let list2 = [...ColorsArr[index].ColorProperities];
    let list3 = list2.map((ite, inde) => {
      if (ind * 1 == inde * 1) {
        return { ...ite, proploading: true };
      } else return { ...ite };
    });
    allColorsArr[index].ColorProperities = list3;
    setColorsArr(allColorsArr);
    const data_send = {
      color_id: it.color_id,
      label: it.label,
      label_ar: it.label_ar
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/add", data_send)
      .then((res) => {
        if (res.data.status == 1) {
          toast.success(
            language == "ar" ? "تمت الإضافه بنجاح" : "Added Successfully"
          );
          let allColorsArr = [...ColorsArr];
          let list2 = [...ColorsArr[index].ColorProperities];
          list2[ind]["Properity_values"] = [
            {
              label: "",
              label_ar: "",
              // plus_price:'',
              // stock:'',
              prop_id: res.data.message,
              propvalloading: false
            }
          ];
          allColorsArr[index].ColorProperities = list2;
          setColorsArr(allColorsArr);
        } else if (res.data.status == 0) {
          toast.error(language == "ar" ? "لم تتم الإضافه" : "Not Added");
        } else {
          toast.error(language == "ar" ? "حدث خطأ ما" : "Something Went Error");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        let allColorsArr = [...ColorsArr];
        let list2 = [...ColorsArr[index].ColorProperities];
        let list3 = list2.map((ite, inde) => {
          if (ind * 1 == inde * 1) {
            return { ...ite, proploading: false };
          } else return { ...ite };
        });
        allColorsArr[index].ColorProperities = list3;
        setColorsArr(allColorsArr);
      });
  };

  const handlechangeprpvalue = (e, item, index, it, ind, itprop, indpro) => {
    let allColorsArrData = [...ColorsArr];
    let list = ColorsArr[index].ColorProperities[ind].Properity_values[indpro];
    // console.log(list)
    list[e.target.name] = e.target.value;
    allColorsArrData[index].ColorProperities[ind].Properity_values[indpro] =
      list;
    setColorsArr(allColorsArrData);
  };

  const handleaddPropsValue = (item, index, it, ind, itprop, indpro) => {
    if (itprop.label == "" || itprop.label_ar == "") {
      toast.warn(language == "ar" ? "أكمل البيانات" : "Compelete Data");
      return;
    }
    let allcolors = [...ColorsArr];
    // let listProps=allcolors[index];
    let list = allcolors[index].ColorProperities[ind].Properity_values[indpro];
    list.propvalloading = true;

    for (let i = 0; i < allcolors?.length; i++) {
      let allprops = [...allcolors[i].ColorProperities];
      for (let j = 0; j < allprops?.length; j++) {
        let allpropvalues = [...allprops[j].Properity_values];
        for (let k = 0; k < allpropvalues?.length; k++) {
          let objval = { ...allpropvalues[k] };
          if (indpro * 1 == k * 1) {
            // objval.propvalloading=true;
            allcolors[index].ColorProperities[ind].Properity_values[
              indpro
            ].propvalloading = true;
          }
        }
        // allprops[j].Properity_values=allpropvalues;
      }
    }

    // for(let i=0;i<allcolors?.length;i++){
    //   let allprops=[...allcolors[i].ColorProperities];
    //   for(let j=0;j<allprops?.length;j++){
    //     let allpropvalues=[...allprops[j].Properity_values];
    //     for(let k=0;k<allpropvalues?.length;k++){
    //       let objval={...allpropvalues[k]};
    //       if(indpro*1==k*1){
    //         objval.propvalloading=true;
    //       }
    //     }
    //     allprops[j].Properity_values=allpropvalues;
    //   }
    //   allcolors[i].ColorProperities=allprops;
    // }
    setColorsArr(allcolors);

    const data_send = {
      ...itprop
    };
    axios
      .post("https://api.manjam.shop/v3/color_props/add_value", data_send)
      .then((res) => {
        if (res.data.status == 1) {
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
        for (let i = 0; i < allcolors?.length; i++) {
          let allprops = [...allcolors[i].ColorProperities];
          for (let j = 0; j < allprops?.length; j++) {
            let allpropvalues = [...allprops[j].Properity_values];
            for (let k = 0; k < allpropvalues?.length; k++) {
              let objval = { ...allpropvalues[k] };
              if (indpro * 1 == k * 1) {
                // objval.propvalloading=true;
                allcolors[index].ColorProperities[ind].Properity_values[
                  indpro
                ].propvalloading = false;
              }
            }
            // allprops[j].Properity_values=allpropvalues;
          }
        }
        setColorsArr(allcolors);
      });
  };

  return (
    <div className="h-container con-h">
      <DefaultLayout
        children={
          <div className="childs">
            <ContentNav head={language == "ar" ? "إضافة" : "Add"} />
            <div className="table-t common-cl">
              <Switches
                switches={choices}
                choice={choice}
                chooseFunction={chooseDep}
                setChoice={setChoice}
              />

              {choice == "product" ? (
                <>
                  {/* <Form
                    inputs={classification_input((id) => {
                      setCategoryId(id);
                    }, categoryId)}
                    submitFunction={add_class}
                  /> */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addProduct();
                    }}
                    className="formaddproduct"
                  >
                    <label htmlFor="">
                      {language == "ar" ? "الفئه" : "Categoy"}
                    </label>
                    <select
                      value={addedproduct.category_id}
                      onChange={(e) => {
                        setcategory_id(e.target.value);
                        setaddedproduct({
                          ...addedproduct,
                          category_id: e.target.value
                        });
                      }}
                    >
                      {/* {console.log(categories.length)} */}
                      {categories &&
                      categories.length &&
                      categories != "no category"
                        ? categories?.map((it, index) => {
                            return (
                              <option value={it.id} key={index}>
                                {it.title}
                              </option>
                            );
                          })
                        : null}
                    </select>
                    <label htmlFor="">
                      {language == "ar"
                        ? "إسم المنتج بالإنجليزيه"
                        : "Product Name In English"}
                    </label>
                    <input
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
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
                    <label htmlFor="">
                      {language == "ar"
                        ? "إسم المنتج بالعربيه"
                        : "Product Name In Arabic"}
                    </label>
                    <input
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
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
                      {language == "ar" ? "حالة المنتج" : "Grade"}
                    </label>
                    <select
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
                          grade: e.target.value
                        });
                      }}
                      value={addedproduct.grade}
                    >
                      <option value="used">
                        {language == "ar" ? "مستخدم" : "used"}
                      </option>
                      <option value="new">
                        {language == "ar" ? "جديد" : "new"}
                      </option>
                    </select>
                    {/* <input onChange={(e)=>{
                    setaddedproduct({...addedproduct,grade:e.target.value})
                  }} type="text" placeholder={language=='ar'?"حالة المنتج":"grade"}/> */}

                    <label htmlFor="">
                      {language == "ar"
                        ? "وصف المنتج بالإنجليزيه"
                        : "Product Description In English"}
                    </label>
                    <textarea
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
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
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
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
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
                          model_number: e.target.value
                        });
                      }}
                      type="text"
                      placeholder={
                        language == "ar" ? "رقم النموذج" : "Model Number"
                      }
                    />

                    <label htmlFor="">
                      {language == "ar" ? "إسم الشركه" : "Comapny Name"}
                    </label>
                    <input
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
                          producing_company: e.target.value
                        });
                      }}
                      type="text"
                      placeholder={
                        language == "ar" ? "إسم الشركه" : "Company Name"
                      }
                    />

                    {/* <label htmlFor="">{language=='ar'?"سوف يتم توفيره بدايه من":"Will Avilable After"}</label>
                  <input onChange={(e)=>{
                    // console.log(e)
                    // console.log(moment(e.target.valueAsNumber).format("YYYY-mm-dd H:m:s"))
                    setaddedproduct({...addedproduct,will_av_after:e.target.value})
                  }} type="date" placeholder={language=='ar'?"سوف يتم توفيره بدايه من":"Will Avilable After"}/>

                  <label htmlFor="">{language=='ar'?"سوف يتم توفيره لوقت":"Will Avilable For"}</label>
                  <input min={addedproduct.will_av_after} onChange={(e)=>{
                    setaddedproduct({...addedproduct,will_av_for:e.target.value})
                  }} type="date" placeholder={language=='ar'?"سوف يتم توفيره لوقت":"Will Avilable For"}/> */}

                    <label htmlFor="">
                      {language == "ar"
                        ? "الشروط بالانجليزيه"
                        : "Conditions In English"}
                    </label>
                    <input
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
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
                      {language == "ar"
                        ? "الشروط بالعربيه"
                        : "Conditions In Arabic"}
                    </label>
                    <input
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
                          conditions_ar: e.target.value
                        });
                      }}
                      type="text"
                      placeholder={
                        language == "ar"
                          ? "الشروط بالعربيه"
                          : "Conditions In Arabic"
                      }
                    />
                    <label htmlFor="">
                      {language == "ar" ? "حالة الرجوع" : "Return Status"}
                    </label>
                    <select name="" id="">
                      <option
                        onClick={() => {
                          setaddedproduct({ ...addedproduct, isReturned: 1 });
                        }}
                        value="1"
                      >
                        {language == "ar" ? "ممكن" : "possible"}
                      </option>
                      <option
                        onClick={() => {
                          setaddedproduct({ ...addedproduct, isReturned: 0 });
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
                      disabled={addedproduct.isReturned == 0 ? true : false}
                      onChange={(e) => {
                        setaddedproduct({
                          ...addedproduct,
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
                    <select name="" id="">
                      <option
                        onClick={(e) => {
                          setaddedproduct({ ...addedproduct, store: "ksa" });
                        }}
                        value=""
                      >
                        {language == "ar" ? "السعوديه" : "Saudi Aribia"}
                      </option>
                      <option
                        onClick={(e) => {
                          setaddedproduct({ ...addedproduct, store: "uae" });
                        }}
                        value=""
                      >
                        {language == "ar" ? "الامارات" : "The UAE"}
                      </option>
                      <option
                        onClick={(e) => {
                          setaddedproduct({
                            ...addedproduct,
                            store: "uae***ksa"
                          });
                        }}
                        value=""
                      >
                        {language == "ar"
                          ? "الامارات والسعوديه"
                          : "The UAE and Saudi Aribia"}
                      </option>
                    </select>
                    {productloading ? (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "10px"
                        }}
                      >
                        <Loader />
                      </div>
                    ) : (
                      <button>
                        {language == "ar" ? "أضف المنتج" : "add the product"}
                      </button>
                    )}
                  </form>
                  {showcorlorform ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "20px 0px"
                      }}
                    >
                      <h4>
                        {language == "ar" ? "إضافة لون جديد" : "Add New Color"}
                      </h4>
                      <h4
                        onClick={() => {
                          // setColorsArr([]);
                          setColorsArr([
                            ...ColorsArr,
                            {
                              product_id: AddedProductId,
                              images: "",
                              // price:'',
                              // new_price:'',
                              // discount:'',
                              available_quantity: "",
                              color_code: "",
                              color: "",
                              color_ar: "",
                              ColorProperities: [],
                              colloading: false
                            }
                          ]);
                        }}
                      >
                        <AiOutlinePlus style={{ cursor: "pointer" }} />
                      </h4>
                    </div>
                  ) : null}
                  {showcorlorform
                    ? ColorsArr?.map((item, index) => {
                        // console.log(item)
                        // console.log(ColorsArr.length)
                        return (
                          <>
                            <form
                              key={index}
                              onSubmit={(e) => {
                                e.preventDefault();
                                // handleedit();
                                handleaddcolor(item, index);
                                // setshowadd(false)
                              }}
                              className="from_Shipping"
                              action=""
                            >
                              <label htmlFor="">
                                {language == "ar" ? "الصور" : "Images"}
                              </label>
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
                                      handleuploadaftereditcolors(index);
                                    }}
                                  >
                                    {language == "ar"
                                      ? "رفع الصورة"
                                      : "Upload Image"}
                                  </button>
                                )}
                              </div>
                              {/* <label htmlFor="">{language=='ar'?'سعر المنتج':'Product Price'}</label>
                          <input name="price" type="number" placeholder={language=='ar'?'سعر المنتج':'Product Price'} onChange={(e)=>{
                            handlechangecolor(e,index)
                            setcolorproperty({...colorproperty,price:e.target.value})
                          }}/> */}
                              {/* <input name="new_price" type="number" placeholder={language=='ar'?'سعر المنتج':'Product Price'} onChange={(e)=>{
                            handlechangecolor(e,index)
                            setcolorproperty({...colorproperty,new_price:e.target.value})
                          }}/> */}
                              {/* <label htmlFor="">product Price</label> */}
                              {/* <input name="discount" type="number" max={100} placeholder={language=='ar'?'قيمة الخصم':'Product discount'} onChange={(e)=>{
                            handlechangecolor(e,index)
                            setcolorproperty({...colorproperty,discount:e.target.value})
                          }}/> */}
                              {/* <label htmlFor="">product Quantity</label> */}
                              {/* <input name="available_quantity" type="text" placeholder={language=='ar'?'كمية المنتج':'product Quantity'} onChange={(e)=>{
                            setcolorproperty({...colorproperty,available_quantity:e.target.value})
                            handlechangecolor(e,index)
                          }}/> */}
                              <label htmlFor="">
                                {language == "ar" ? "كود اللون" : "Color Code"}
                              </label>
                              <input
                                name="color_code"
                                type="color"
                                placeholder={
                                  language == "ar" ? "كود اللون" : "Color Code"
                                }
                                onChange={(e) => {
                                  handlechangecolor(e, index);
                                  setcolorproperty({
                                    ...colorproperty,
                                    color_code: e.target.value
                                  });
                                }}
                              />
                              <label htmlFor="">
                                {language == "ar"
                                  ? "إسم اللون بالانجليزيه"
                                  : "Color In English"}
                              </label>
                              <input
                                name="color"
                                type="text"
                                placeholder={
                                  language == "ar"
                                    ? "إسم اللون بالانجليزيه"
                                    : "Color In English"
                                }
                                onChange={(e) => {
                                  handlechangecolor(e, index);
                                  setcolorproperty({
                                    ...colorproperty,
                                    color: e.target.value
                                  });
                                }}
                              />
                              <label htmlFor="">
                                {language == "ar"
                                  ? "إسم اللون بالعربيه"
                                  : "Color In Arabic"}
                              </label>
                              <input
                                name="color_ar"
                                type="text"
                                placeholder={
                                  language == "ar"
                                    ? "إسم اللون بالعربيه"
                                    : "Color In Arabic"
                                }
                                onChange={(e) => {
                                  handlechangecolor(e, index);
                                  setcolorproperty({
                                    ...colorproperty,
                                    color_ar: e.target.value
                                  });
                                }}
                              />
                              {item.colloading ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                  }}
                                >
                                  <Loader />
                                </div>
                              ) : (
                                <button>
                                  {language == "ar" ? "إضافه" : "Add"}
                                </button>
                              )}
                            </form>
                            {/* {item?.ColorProperities?.length > 0 ? (
                              <div
                                style={{
                                  margin: '20px 0px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between'
                                }}
                              >
                                <h4>
                                  {language == 'ar'
                                    ? "إضافة خاصيه أخرى"
                                    : "Add Another Property"}
                                </h4>
                                <AiOutlinePlus
                                  onClick={() => {
                                    let allColorsData = [...ColorsArr];
                                      allColorsData[index].ColorProperities.push({
                                      id:
                                        allColorsData[allColorsData.length - 1]
                                          .ColorProperities?.length + 1,
                                      color_code: colorproperty.color_code,
                                      label: '',
                                      label_ar: '',
                                      // stock:'',
                                      color_id:
                                        allColorsData[allColorsData.length - 1]
                                          ?.ColorProperities[0]?.color_id,
                                      proploading:false,
                                    });
                                    setColorsPropeity([
                                      ...ColorsPropeity,
                                      {
                                        id: ColorsPropeity?.length + 1,
                                        color_code: colorproperty.color_code,
                                        label: '',
                                        label_ar: '',
                                        // stoke:'',
                                        // stock:'',
                                        color_id: ColorsPropeity[0]?.color_id
                                      }
                                    ]);
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    fontSize: '20px'
                                  }}
                                />
                              </div>
                            ) : null} */}
                            {/* {
                            ColorsPropeity?.length>0?(

                            ):(null)
                          } */}
                            {item?.ColorProperities?.map((it, ind) => {
                              return (
                                <>
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      // handleaddprop()
                                      // setshowadd(false)
                                      handleaddproperity(it, item, index, ind);
                                    }}
                                    className="from_Shipping"
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
                                      name="label"
                                      onChange={(e) => {
                                        setaddobj({
                                          ...addobj,
                                          label: e.target.value
                                        });
                                        handlechagepropform(e, ind, index);
                                      }}
                                      type="text"
                                    />
                                    <label htmlFor="">
                                      {language == "ar"
                                        ? "إسم الخاصيه بالعربيه"
                                        : "Label In Arabic"}
                                    </label>
                                    <input
                                      name="label_ar"
                                      onChange={(e) => {
                                        setaddobj({
                                          ...addobj,
                                          label_ar: e.target.value
                                        });
                                        handlechagepropform(e, ind, index);
                                      }}
                                      type="text"
                                    />
                                    {/* <label htmlFor="">{language=='ar'?"المخزون":"stock"}</label>
                          <input name="stock" onChange={(e)=>{
                            setaddobj({...addobj,stock:e.target.value})
                            handlechagepropform(e,ind,index);
                          }} type="text" /> */}
                                    {it.proploading ? (
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          marginTop: "20px"
                                        }}
                                      >
                                        <Loader />
                                      </div>
                                    ) : (
                                      <button>
                                        {language == "ar" ? (
                                          addloading ? (
                                            <Loader />
                                          ) : (
                                            "إضافه"
                                          )
                                        ) : (
                                          "Add"
                                        )}
                                      </button>
                                    )}
                                  </form>
                                  {it?.Properity_values?.length > 0 ? (
                                    <>
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
                                            ? "إضافة قيمة للخاصية"
                                            : "Add propery value"}
                                        </h4>
                                        <AiOutlinePlus
                                          onClick={() => {
                                            let allColorsArr = [...ColorsArr];
                                            let list2 = it?.Properity_values;

                                            list2.push({
                                              label: "",
                                              label_ar: "",
                                              prop_id: list2[0]?.prop_id,
                                              propvalloading: false
                                            });
                                            allColorsArr[
                                              index
                                            ].ColorProperities[
                                              ind
                                            ].Properity_values = list2;
                                            setColorsArr(allColorsArr);
                                          }}
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "20px"
                                          }}
                                        />
                                      </div>
                                      {it?.Properity_values?.map(
                                        (itprop, indpro) => {
                                          return (
                                            <form
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                handleaddPropsValue(
                                                  item,
                                                  index,
                                                  it,
                                                  ind,
                                                  itprop,
                                                  indpro
                                                );
                                              }}
                                              style={{ margin: "20px 0px" }}
                                              className="from_Shipping"
                                            >
                                              <label htmlFor="">
                                                {language == "ar"
                                                  ? "قيمة الخاصية بالانجليزية"
                                                  : "Property Value In English"}
                                              </label>
                                              <input
                                                name="label"
                                                onChange={(e) => {
                                                  handlechangeprpvalue(
                                                    e,
                                                    item,
                                                    index,
                                                    it,
                                                    ind,
                                                    itprop,
                                                    indpro
                                                  );
                                                  setaddobjpropval({
                                                    ...addobjpropval,
                                                    label: e.target.value
                                                  });
                                                }}
                                                placeholder="example: storage 256"
                                                type="text"
                                              />
                                              <label htmlFor="">
                                                {language == "ar"
                                                  ? "قيمة الخاصية بالعربية"
                                                  : "Property Value In arabic"}
                                              </label>
                                              <input
                                                name="label_ar"
                                                onChange={(e) => {
                                                  handlechangeprpvalue(
                                                    e,
                                                    item,
                                                    index,
                                                    it,
                                                    ind,
                                                    itprop,
                                                    indpro
                                                  );
                                                  setaddobjpropval({
                                                    ...addobjpropval,
                                                    label_ar: e.target.value
                                                  });
                                                }}
                                                placeholder="example: التخزين 256"
                                                type="text"
                                              />
                                              {/* <label htmlFor="">{language=='ar'?"قيمة الزياده":"Plus value"}</label>
                                      <input name="plus_price" onChange={(e)=>{
                                        handlechangeprpvalue(e,item,index,it,ind,itprop,indpro)
                                        setaddobjpropval({...addobjpropval,plus_price:e.target.value})
                                      }} type="text" />
                                      <label htmlFor="">{language=='ar'?"المخزون":"Stock"}</label>
                                      <input name="stock" onChange={(e)=>{
                                        handlechangeprpvalue(e,item,index,it,ind,itprop,indpro)
                                        setaddobjpropval({...addobjpropval,stock:e.target.value})
                                      }} type="text" /> */}
                                              {itprop.propvalloading ? (
                                                <div
                                                  style={{
                                                    marginTop: "10px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                  }}
                                                >
                                                  <Loader />
                                                </div>
                                              ) : (
                                                <button>
                                                  {language == "ar" ? (
                                                    addloading ? (
                                                      <Loader />
                                                    ) : (
                                                      "إضافه"
                                                    )
                                                  ) : (
                                                    "Add"
                                                  )}
                                                </button>
                                              )}
                                            </form>
                                          );
                                        }
                                      )}
                                    </>
                                  ) : null}
                                </>
                              );
                            })}
                          </>
                        );
                      })
                    : null}
                </>
              ) : choice == "adduser" ? (
                <Form inputs={user_input} submitFunction={add_user} />
              ) : choice == "address" ? (
                <Form inputs={address_input} submitFunction={add_offer} />
              ) : choice == "category" ? (
                // <Form inputs={categories_input} submitFunction={add_category} />
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleaddcategory();
                  }}
                  className="formaddproduct"
                  action=""
                >
                  <label htmlFor="">
                    {language == "ar"
                      ? "إسم الفئه بالانجليزيه"
                      : "Category Name In English"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddedcategory({
                        ...addedcategory,
                        title: e.target.value
                      });
                    }}
                    type="text"
                    placeholder={
                      language == "ar"
                        ? "إسم الفئه بالانجليزيه"
                        : "Category Name In English"
                    }
                  />
                  <label htmlFor="">
                    {language == "ar"
                      ? "إسم الفئه بالعربيه"
                      : "Category Name In Arabic"}
                  </label>
                  <input
                    onChange={(e) => {
                      setaddedcategory({
                        ...addedcategory,
                        title_ar: e.target.value
                      });
                    }}
                    type="text"
                    placeholder={
                      language == "ar"
                        ? "إسم الفئه بالعربيه"
                        : "Category Name In Arabic"
                    }
                  />
                  <label htmlFor="">
                    {language == "ar" ? "الصور" : "Images"}
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
                          handleuploadimage();
                        }}
                      >
                        {language == "ar" ? "رفع الصورة" : "Upload Image"}
                      </button>
                    )}
                  </div>
                  <button>{language == "ar" ? "أضف" : "Add"}</button>
                </form>
              ) : choice == "social" ? (
                <Form inputs={categories_input} submitFunction={add_category} />
              ) : choice == "contact" ? (
                <Form inputs={contact_input} submitFunction={add_contact} />
              ) : choice == "banner" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleaddbanner();
                  }}
                  className="formaddproduct"
                >
                  <label htmlFor="">
                    {language == "ar"
                      ? "الاسم بالانجليزيه"
                      : "title In English"}
                  </label>
                  <input
                    onChange={(e) => {
                      setbannerdata({ ...bannerdata, title: e.target.value });
                    }}
                    type="text"
                    placeholder={
                      language == "ar"
                        ? "الإسم بالإنجليزيه"
                        : "title In English"
                    }
                  />
                  <label htmlFor="">
                    {language == "ar" ? "الاسم بالعربيه" : "title In Arabic"}
                  </label>
                  <input
                    onChange={(e) => {
                      setbannerdata({
                        ...bannerdata,
                        title_ar: e.target.value
                      });
                    }}
                    type="text"
                    placeholder={
                      language == "ar" ? "الإسم بالعربيه" : "title In arabic"
                    }
                  />
                  <label htmlFor="">
                    {language == "ar" ? "النص بالإنجليزيه" : "text In English"}
                  </label>
                  <input
                    onChange={(e) => {
                      setbannerdata({ ...bannerdata, text: e.target.value });
                    }}
                    type="text"
                    placeholder={
                      language == "ar" ? "النص بالإنجليزيه" : "text In English"
                    }
                  />
                  <label htmlFor="">
                    {language == "ar" ? "النص بالعربيه" : "text In arabic"}
                  </label>
                  <input
                    onChange={(e) => {
                      setbannerdata({ ...bannerdata, text_ar: e.target.value });
                    }}
                    type="text"
                    placeholder={
                      language == "ar" ? "النص بالعربيه" : "text In arabic"
                    }
                  />
                  <label htmlFor="">
                    {language == "ar" ? "الصوره" : "image"}
                  </label>
                  <div className={language == "ar" ? "updiv rtl" : "updiv"}>
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
                    {language == "ar" ? "اللينك" : "Link"}
                  </label>
                  <input
                    onChange={(e) => {
                      setbannerdata({ ...bannerdata, link: e.target.value });
                    }}
                    type="text"
                    placeholder={language == "ar" ? "اللينك" : "Link"}
                  />
                  <button>
                    {addloading ? <Loader /> : language == "ar" ? "أضف" : "Add"}
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Addition;
