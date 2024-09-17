//This component receives as parameter a list of products and creates an auto card slider

import React from "react";
import ProductCard from "./ProductCard";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CardSlider = ({ products, slidesQuantity }) => {
  const settings = {
    infinite: true,
    slidesToShow: slidesQuantity, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true,
    autoplaySpeed: 2000, // Interval between slides in milliseconds
  };

  const slider = products.map((product, index) => {
    return (
      <ProductCard
        key={index}
        title={product.public_titulo}
        price={product.venta_1_prec}
        images={`/img/prod/${product.archivo_nom}`}
        category={""}
        categoryID={product.categoria_id}
        ID={product.producto_id}
        className={"mx-1 md:mx-1.5 lg:mx-2.5"}
      />
    );
  });

  return <Slider {...settings}>{slider}</Slider>;
};

export default CardSlider;
