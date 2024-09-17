import React, { lazy, useEffect, useState } from "react";
import axios from "axios";

const BannerSlider = lazy(() => import("./BannerSlider"));

const BannerSliderResponsive = () => {
  const [banners, setBanners] = useState();
  const [bannersS, setBannersS] = useState();
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get("http://localhost:5000/banners");
        console.log(response);
        setBanners(
          response.data.banners
            .filter((banner) => banner.banner_imagen_tipo === "L")
            .map((banner) => {
              return banner;
            })
        );
        setBannersS(
          response.data.banners
            .filter((banner) => banner.banner_imagen_tipo === "S")
            .map((banner) => {
              return banner;
            })
        );
      } catch (err) {
        console.error("Error fetching banners");
      }
    };
    fetchBanners();
  }, []);

  return banners && bannersS ? (
    <div className="select-none relative">
      <BannerSlider banners={bannersS} className={"md:hidden relative z-0"} />
      <BannerSlider
        banners={banners}
        className={"hidden md:block relative z-10"}
      />
      <div className="bg-gradient-to-t from-white via-white to-transparent w-screen h-8 -mt-8 relative z-10"></div>
    </div>
  ) : (
    <div className="select-none">
      <img
        src="/img/banners/defaultSm.webp"
        alt="banner default"
        className="md:hidden w-screen items-center"
      />
      <img
        src="/img/banners/default.webp"
        alt="banner default"
        className="hidden md:block w-screen items-center"
      />
    </div>
  );
};

export default BannerSliderResponsive;
