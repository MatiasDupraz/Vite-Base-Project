import { useEffect, useState, lazy } from "react";
import axios from "axios";

const BannerSliderResponsive = lazy(() =>
  import("../components/BannerSliderResponsive")
);
const AutoCardSliderResponsive = lazy(() =>
  import("../components/AutoCardSliderResponsive")
);
const SectionTitle = lazy(() => import("../components/SectionTitle"));

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
