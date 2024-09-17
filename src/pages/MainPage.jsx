//library
import React, { useEffect, useState } from "react";

import BannerSliderResponsive from "../components/BannerSliderResponsive";
import axios from "axios";

import AutoCardSliderResponsive from "../components/AutoCardSliderResponsive";
import SectionTitle from "../components/SectionTitle";

function MainPage() {
  window.scrollTo(0, 0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [notebooks, setNotebooks] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);

  useEffect(() => {
    const fetchedFeaturedProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/featured`);
        setFeaturedProducts(response.data[0]);
      } catch (err) {
        console.error(`Error fetching user from database: ${err}`);
      }
    };
    fetchedFeaturedProducts();
  }, []);

  useEffect(() => {
    const fetchedPromoProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/promo`);
        setPromoProducts(response.data[0]);
      } catch (err) {
        console.error(`Error fetching user from database: ${err}`);
      }
    };
    fetchedPromoProducts();
  }, []);

  useEffect(() => {
    const fetchedNotebooks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/featuredCategoryProduct?c=9`
        );
        setNotebooks(response.data[0]);
      } catch (err) {
        console.error(`Error fetching user from database: ${err}`);
      }
    };
    fetchedNotebooks();
  }, []);

  return (
    <div className="pt-[122px]  md:pt-[108px] overflow-x-hidden ">
      <BannerSliderResponsive />
      <SectionTitle text={"productos destacados"} />
      <AutoCardSliderResponsive products={featuredProducts} />
      <SectionTitle text={"encontrá lo que necesitás en notebooks"} />
      <AutoCardSliderResponsive products={notebooks} />
      <SectionTitle text={"ofertas"} />
      <AutoCardSliderResponsive products={promoProducts} />
    </div>
  );
}

export default MainPage;
