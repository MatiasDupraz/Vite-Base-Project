import React, { useState, useEffect } from "react";
import classNames from "classnames";
import Icon from "./Icon";
import useTextFormating from "../hooks/long-text-formating";
import axios from "axios";
import { useUser } from "../context/sessionContext";
import usePriceFormating from "../hooks/price-formating";
const ShoppingCartCard = ({
  ID,
  name,
  price,
  quantity,
  image,
  className,
  stock,
  updateQuant,
}) => {
  const { user } = useUser();
  const formatedText = useTextFormating(name, 25);
  const [userId, setUserId] = useState(0);
  const [quant, setQuant] = useState(quantity);
  const [finalPrice, setFinalPrice] = useState(price * quantity);
  const priceFormated = usePriceFormating(price);
  const finalPriceFormated = usePriceFormating(finalPrice);
  const modifyQuantity = async () => {
    try {
      if (user) {
        setUserId(user.usuario_id);
        if (userId !== 0) {
          await axios.get(
            `http://localhost:5000/cartM?uid=${encodeURIComponent(
              userId
            )}&quant=${encodeURIComponent(quant)}&pid=${encodeURIComponent(ID)}`
          );
        }
      }
    } catch (error) {
      console.error("Error fetching filtered products:", error);
    }
  };

  useEffect(() => {
    setFinalPrice(price * quant);
  }, [price, quant]);

  const handleSetQuant = (newQuant) => {
    if (newQuant === 0) {
      setQuant(0);
    } else if (quant + newQuant > 0 && quant + newQuant <= stock) {
      setQuant(quant + newQuant);
    }
  };

  useEffect(() => {
    modifyQuantity();
    updateQuant(quant, ID);
  }, [quant, handleSetQuant]);

  const finalClassName = classNames(
    "my-5 border-b border-gray-200",
    className,
    quant > 0 ? "flex" : "hidden"
  );
  return (
    <div className={finalClassName}>
      <img
        src={image}
        className="w-20 aspect-square bg-white prevent-select rounded-md flex justify-center p-0.5 object-contain max-w-full max-h-full m-0.5"
        alt={name}
      />
      <div className="flex flex-col w-full m-3 mt-0">
        <div className="hidden md:flex">
          <a href={`/product?q=${ID}`}>
            <p className="font-medium text-md hover:text-red-800">{name}</p>
          </a>
          <button
            className="ml-auto font-bold font-mono text-xl hover:text-red-800"
            onClick={() => handleSetQuant(0)}
          >
            <Icon cross disableHover />
          </button>
        </div>
        <div className="flex md:hidden">
          <p className="font-semibold text-md">{formatedText}</p>
          <button
            className="ml-auto font-bold font-mono text-xl hover:text-red-800"
            onClick={() => handleSetQuant(0)}
          >
            <Icon cross disableHover />
          </button>
        </div>
        <div className="flex mt-auto content-between justify-between">
          <div className="self-start">
            <p className="block">
              <div className="relative flex flex-row w-full h-7 bg-transparent rounded-lg">
                <button
                  className="h-full text-gray-600 bg-gray-50 w-7 border-r rounded-l outline-none cursor-pointer hover:bg-gray-300 flex items-center justify-center pb-1"
                  onClick={() => handleSetQuant(-1)}
                >
                  <span className="text-2xl font-normal">-</span>
                </button>
                <input
                  type="number"
                  className="flex items-center w-7 text-center text-gray-700 placeholder-gray-700 bg-gray-50 outline-none  focus:outline-none text-sm hover:text-black appearance-none remove-arrow "
                  placeholder={quant}
                  value={quant}
                  readOnly
                />
                <button
                  className="w-7 h-full text-gray-600 bg-gray-50 border-l rounded-r outline-none cursor-pointer  hover:text-gray-700 hover:bg-gray-300 flex items-center justify-center pb-1"
                  onClick={() => {
                    handleSetQuant(1);
                  }}
                >
                  <span className="text-2xl font-normal flex items-center">
                    +
                  </span>
                </button>
              </div>
              <p className="text-xs font-normal text-gray-500">
                Disponible {stock}
              </p>
            </p>
          </div>
          <div className="self-end text-end">
            <p className="select-none font-normal text-xs text-neutral-500 md:hidden">
              {priceFormated}
            </p>
            <p className="select-none font-light text-sm hidden md:block text-neutral-500 ">
              {priceFormated}
            </p>
            <p className="hidden md:block select-none font-bold text-lg">
              {finalPriceFormated}
            </p>
            <p className="md:hidden select-none font-bold text-lg">
              {finalPriceFormated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCartCard;
