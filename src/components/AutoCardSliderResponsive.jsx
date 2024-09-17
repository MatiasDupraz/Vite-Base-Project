import React, { lazy } from "react";
// Components
const AutoCardSlider = lazy(() => import("./AutoCardSlider.jsx"));

// Libraries
import { useMediaQuery } from "@react-hook/media-query";
import classNames from "classnames";

const AutoCardSliderResponsive = ({ products }) => {
  const isMd = useMediaQuery("(min-width:768px) and (max-width: 1279px)");
  const isXl = useMediaQuery("(min-width:1280px)  and (max-width: 1535px)");
  const is2Xl = useMediaQuery("(min-width:1536px)");

  let slidesQuantity;
  if (isMd) {
    slidesQuantity = 3;
  } else if (isXl) {
    slidesQuantity = 4;
  } else if (is2Xl) {
    slidesQuantity = 5;
  } else {
    slidesQuantity = 2;
  }

  return (
    <AutoCardSlider
      products={products}
      slidesQuantity={slidesQuantity}
      className={classNames("flex")}
    />
  );
};

export default AutoCardSliderResponsive;
