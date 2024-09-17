//Given the basic parameters of a product, creates a card wich displays the main information and on click redirects to the product page

import React, { useState } from "react";
import classNames from "classnames";
import usePriceFormating from "../hooks/price-formating";
import useTextFormating from "../hooks/long-text-formating";
import useTextCapitalize from "../hooks/text-capitalize";
const ProductCard = ({ title, price, images, ID, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatedPrice = usePriceFormating(price);
  const formatedTitle = useTextCapitalize(title);

  const cardClassName = classNames(
    "bg-neutral-50 shadow-md rounded-sm lg:max-w-xs ease-linear transition-all duration-300 aspect-ratio hover:shadow-neutral-700 hover:shadow-lg flex-shrink-0 my-2 lg:text-lg md:text-md",
    className
  );
  const titleClassName = classNames(
    "lg:mt-2 font-medium tracking-tight hidden lg:block h-12",
    isHovered ? "text-red-800" : ""
  );

  const titleSmClassName = classNames(
    " lg:hidden lg:mt-2  text-sm font-base h-12",
    isHovered ? "text-red-800" : ""
  );

  let finalTitle = useTextFormating(formatedTitle, 56);

  let finalTitle2 = useTextFormating(formatedTitle, 36);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      className={cardClassName}
    >
      <a
        className="prevent-select flex justify-center align-middle aspect-square p-1 w-full max-h-36  lg:max-h-44  bg-white"
        href={`/product?q=${ID}`}
      >
        <img
          className="prevent-select rounded-md flex justify-center p-1 object-contain max-w-full max-h-full m-1 md:m-2"
          src={images}
          alt="product pic"
        />
      </a>
      <div className="px-5 pb-5 grid grid-cols-3 grid-rows-2 ">
        <a className="col-span-3 prevent-select " href={`/product?q=${ID}`}>
          <h3 className={titleClassName}>{finalTitle}</h3>
          <h3 className={titleSmClassName}>{finalTitle2}</h3>
        </a>

        <div className="grid grid-cols-3 col-span-3 md:row-start-2 h-full">
          <span className="row h-8 lg:h-10 col-span-3"></span>
          <span className="text-sm md:text-xl lg:text-2xl font-semibold text-gray-900 col-span-2 row-span-1 md:pb-4 ">
            {formatedPrice}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
