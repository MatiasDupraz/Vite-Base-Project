import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import { useData } from "./context/dataContext.jsx";

import MainPage from "./pages/MainPage.jsx";

//For all pages
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import ChatButton from "./components/ChatButton.jsx";

//Filters and detail
import TextFilteredProducts from "./pages/TextFilteredProducts.jsx";
import CategoryFilteredProducts from "./pages/CategoryFilteredProducts.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

//User Pages
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

//Cart and Purchase Pages
import CartResume from "./pages/Purchase/CartResume.jsx";
import ShoppingCart from "./pages/ShoppingCart.jsx";
import ShippingInfo from "./pages/Purchase/ShippingInfo.jsx";
import ContactInfo from "./pages/Purchase/ContactInfo.jsx";
import PaymentMethods from "./pages/Purchase/PaymentMethods.jsx";
import Promotions from "./pages/Purchase/Promotions.jsx";
import PurchaseResume from "./pages/Purchase/PurchaseResume.jsx";
import PurchaseResumes from "./pages/PurchaseResumes.jsx";
import UserOrders from "./pages/UserOrders";
import AOS from "aos";
import "aos/dist/aos.css";
import ModoCheckout from "./components/MODO/ModoCheckout.jsx";

function App() {
  const [categories, setCategories] = useState([]);
  const dataContext = useData();

  useEffect(() => {
    // Fetch products data from backend when component mounts

    dataContext ? setCategories(dataContext.categories) : setCategories([]);
  }, [dataContext]); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    AOS.init({ duration: 1200 });
  });

  return (
    <Router>
      <Toaster position="top-center" />

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/search" element={<TextFilteredProducts />} />
        <Route path="/categories" element={<CategoryFilteredProducts />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resume" element={<CartResume />} />
        <Route path="/shipping" element={<ShippingInfo />} />
        <Route path="/contact" element={<ContactInfo />} />
        <Route path="/payment" element={<PaymentMethods />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/order" element={<PurchaseResume />} />
        <Route path="/orderH" element={<PurchaseResumes />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/pruebas" element={<ModoCheckout />} />
      </Routes>
      <ChatButton />
      <Footer />
    </Router>
  );
}

export default App;
