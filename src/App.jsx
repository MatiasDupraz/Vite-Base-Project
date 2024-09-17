import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useData } from "./context/dataContext.jsx";
import AOS from "aos";
import "aos/dist/aos.css";

// Components used in all pages
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import ChatButton from "./components/ChatButton.jsx";

// Lazy load other components
const MainPage = lazy(() => import("./pages/MainPage.jsx"));
const TextFilteredProducts = lazy(() =>
  import("./pages/TextFilteredProducts.jsx")
);
const CategoryFilteredProducts = lazy(() =>
  import("./pages/CategoryFilteredProducts.jsx")
);
const ProductDetail = lazy(() => import("./pages/ProductDetail.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const CartResume = lazy(() => import("./pages/Purchase/CartResume.jsx"));
const ShoppingCart = lazy(() => import("./pages/ShoppingCart.jsx"));
const ShippingInfo = lazy(() => import("./pages/Purchase/ShippingInfo.jsx"));
const ContactInfo = lazy(() => import("./pages/Purchase/ContactInfo.jsx"));
const PaymentMethods = lazy(() =>
  import("./pages/Purchase/PaymentMethods.jsx")
);
const Promotions = lazy(() => import("./pages/Purchase/Promotions.jsx"));
const PurchaseResume = lazy(() =>
  import("./pages/Purchase/PurchaseResume.jsx")
);
const PurchaseResumes = lazy(() => import("./pages/PurchaseResumes.jsx"));
const UserOrders = lazy(() => import("./pages/UserOrders"));
const ModoCheckout = lazy(() => import("./components/MODO/ModoCheckout.jsx"));

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

      {/*<NavBar categories={categories} />*/}
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
