//This component receives as parameter a list of products and creates a manual card slider

import React from "react";
import ProductCard from "./ProductCard";

const CardSlider = ({ products }) => {
  const slider = products.map((product, index) => {
    return (
      <ProductCard
        key={index}
        title={product.title}
        rate={product.rate}
        price={product.price}
        images={`/img/prod/${product.archivo_nom}`}
        category={product.category}
        categoryID={product.categoryID}
        ID={product.ID}
      />
    );
  });
  return <div className="flex px-10 overflow-x-scroll">{slider}</div>;
};

export default CardSlider;
