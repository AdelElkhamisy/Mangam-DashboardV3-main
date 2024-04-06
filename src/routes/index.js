import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";
import Order_History from "../pages/Order_History";
import Addition from "../pages/addition";
import Amendment from "../pages/amendment";
import Entrance from "../pages/entrance";
import Outcomes from "../pages/outcomes";
import Products from "../pages/products";
import Invoices from "../pages/invoices";
import Login from "../pages/login";
import PrintPage from "../pages/Order_History/printPage";
import SocialMedia from "../pages/socialmedia";
import Codes from "../pages/codes";
import Categories from "../pages/catgories";
import Addresses from "../pages/addresses";
import Coupons from "../pages/copouns";
import Slider from "../pages/slider";
import Company from "../pages/companies";
import ReturnItems from "../pages/ReturnItems/ReturnItems";
import Shipping from "../pages/Shipping/Shipping";
import SiteData from "../pages/SiteData/SiteData";
import ProductColors from "../pages/ProductColors/ProductColors";
import Reasons from "../pages/Reasons/Reasons";
import ColorFeatures from "../pages/ColorFeatures/ColorFeatures";
import PropertyValues from "../pages/PropertyValues/PropertyValues";
import Banner from "../pages/Banners/Banner";
import OfferProducts from "../pages/Offers/OfferProducts";
import OfferProductColors from "../pages/OfferProductsColors/OfferProductsColors";
import EditProduct from "../pages/products/EditProduct.js/EditProduct";
import Reports from "../pages/reports";

function RouteComponent() {
  return (
    <Routes>
      <Route path="/">
        <Route path="" element={<Home />} />
        <Route path="Order-history" element={<Order_History />} />
        <Route path="addition" element={<Addition />} />
        <Route path="amendment" element={<Amendment />} />
        <Route path="entrance" element={<Entrance />} />
        {
          // <Route path="Exchange" element={<Outcomes />} />
          // <Route path="addressess" element={<Addresses />} />
        }
        <Route path="products" element={<Products />} />
        <Route path="Invoices" element={<Invoices />} />

        <Route path="printPage" element={<PrintPage />} />
        <Route path="socialmedia" element={<SocialMedia />} />
        <Route path="codes" element={<Codes />} />
        <Route path="categories" element={<Categories />} />
        <Route path="copouns" element={<Coupons />} />
        <Route path="slider" element={<Slider />} />
        <Route path="companies" element={<Company />} />
        <Route path="/returnitems" element={<ReturnItems />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/reports" element={<Reports />} />
        {/* Reports */}
        <Route path="/sitedata" element={<SiteData />} />
        <Route path="/productfeatures" element={<ProductColors />} />
        <Route path="/reason" element={<Reasons />} />
        <Route path="/colorfeature" element={<ColorFeatures />} />
        <Route path="/propertyvalues" element={<PropertyValues />} />
        <Route path="/banners" element={<Banner />} />
        <Route path="/offerproduct" element={<OfferProducts />} />
        <Route path="/offerproductcolros" element={<OfferProductColors />} />
        <Route path="/editproduct" element={<EditProduct />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default RouteComponent;
