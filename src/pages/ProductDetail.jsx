import React, { useEffect, useState } from "react";
import classNames from "classnames";
import Notification from "../components/Notification";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Icon from "../components/Icon";

import { useUser } from "../context/sessionContext";

const ProductDetail = () => {
  const { user } = useUser();
  const location = useLocation();
  const productID = new URLSearchParams(location.search).get("q");

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [stock, setStock] = useState(0);

  const images = [];

  const addProduct = async () => {
    try {
      await axios.get(
        `http://localhost:5000/addItem?uid=${encodeURIComponent(
          user.usuario_id
        )}&pid=${encodeURIComponent(productID)}&pq=${encodeURIComponent(
          quantity
        )}`
      );
      Notification({ text: "Producto agregado a lista", success: true });
    } catch (err) {
      if (!user) {
        Notification({
          text: "Inicie sesión para agregar productos",
          error: true,
        });
      } else {
        console.error(`Error fetching user from database: ${err}`);
        Notification({
          text: "Stock insuficiente (Ya está en lista)",
          error: true,
        });
      }
    }
  };

  const formatedPrice = (price) => {
    const format = {
      style: "decimal",
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    };
    const formatedNumber = "$ " + parseInt(price).toLocaleString("es", format);
    return formatedNumber;
  };

  const stockClassName = classNames(
    "ml-2 px-1 py-0.5 rounded-md text-base inline-block",
    parseInt(stock) < 3
      ? "text-red-600 bg-red-300"
      : "text-blue-600 bg-blue-300"
  );
  const noStockClassName = classNames(
    "ml-2 px-1 py-0.5 rounded-md text-base inline-block text-yellow-600 bg-yellow-100"
  );
  let [product, setProduct] = useState("");
  let finalProduct;

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/product?q=${productID}`
        );
        const fetchedProduct = response.data[0];
        setProduct(fetchedProduct);
        if (fetchedProduct.stock_cant) {
          setStock(parseInt(fetchedProduct.stock_cant));
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    if (productID) {
      fetchProductDetail();
    }
  }, [productID]);

  //Set product info and images
  if (product !== "") {
    finalProduct = product[0];

    for (let i = 0; i < product.length; i++) {
      images.push(`/img/prod/${product[i].archivo_nom}`);
    }
  }

  //This function allows the "next" arrow to change the actual displayed image to the next one

  const setNextIndex = () => {
    if (images.length === selectedImage + 1) {
      setSelectedImage(0);
    } else {
      setSelectedImage(selectedImage + 1);
    }
  };

  //This function allows the "previous" arrow to change the actual displayed image to the previous one
  const setPreviousIndex = () => {
    if (selectedImage === 0) {
      setSelectedImage(images.length - 1);
    } else {
      setSelectedImage(selectedImage - 1);
    }
  };

  const addQuantity = () => {
    if (quantity < finalProduct.stock_cant) {
      setQuantity(quantity + 1);
    }
  };

  const removeQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <section className="py-10 font-poppins pt-48">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex flex-wrap mb-24 -mx-4">
          <div className="w-full px-4 mb-8 md:w-1/2 md:mb-0">
            <div className="sticky top-0 overflow-hidden ">
              <div className="relative mb-6 lg:mb-10 lg:h-96">
                <a
                  className="absolute left-0 transform lg:ml-2 top-1/2 translate-1/2"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-5 h-5 text-neutral-500 bi bi-chevron-left"
                    viewBox="0 0 16 16"
                    onClick={() => setPreviousIndex()}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    ></path>
                  </svg>
                </a>
                <div className="flex justify-center align-middle w-full h-96 bg-white">
                  <img
                    className="object-contain w-full lg:h-full p-10 select-none"
                    src={images[selectedImage]}
                    alt="primary"
                  />
                </div>
                <a
                  className="absolute right-0 transform lg:mr-2 top-1/2 translate-1/2"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="w-5 h-5 text-neutral-500 bi bi-chevron-right"
                    viewBox="0 0 16 16"
                    onClick={() => setNextIndex()}
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    ></path>
                  </svg>
                </a>
              </div>
              <div className="flex-wrap hidden -mx-2 md:flex">
                {images.map((image, index) => {
                  return (
                    <div
                      className="w-1/2 p-2 sm:w-1/4"
                      key={index}
                      onClick={() => setSelectedImage(parseInt(index))}
                    >
                      <div
                        className="block border border-gray-200 hover:border-blue-300 transition-all duration-200"
                        href="#"
                      >
                        <img
                          className="object-contain w-full lg:h-28"
                          src={image}
                          alt={"imagen N° " + index}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2">
            <div className="lg:pl-20">
              <div className="mb-6 ">
                <h2 className="max-w-xl mt-6 mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl">
                  {finalProduct.public_titulo}
                </h2>
                <div className="flex flex-wrap items-center mb-6"></div>
                <p className="inline-block text-3xl font-semibold ">
                  <span className=" text-neutral-800">
                    {formatedPrice(finalProduct.venta_1_prec)}
                  </span>
                </p>
                <div className="block">
                  <p className="text-sm text-neutral-500">
                    Precio válido por pago en efectivo o transferencia bancaria
                  </p>
                </div>
              </div>
              <div className="mb-6 flex">
                <div className="items-center justify-center bg-gray-200 flex rounded-full w-9 h-9 mr-2 text-gray-700">
                  <Icon truck disableHover />
                </div>
                <h2 className="mb-2 text-lg font-semibold text-gray-700 italic ">
                  {" "}
                  Envíos a todo el país
                </h2>
              </div>
              <div className="py-6 mb-6 border-t border-b border-gray-200">
                <span className="text-base text-gray-600">
                  {finalProduct.stock_cant ? `En stock` : ""}
                </span>

                {finalProduct.stock_cant ? (
                  <p className={stockClassName}>
                    {finalProduct.stock_cant} unidades
                  </p>
                ) : (
                  <p className={noStockClassName}>Ingreso por pedido</p>
                )}
              </div>
              <div className="mb-6 "></div>
              <div className="flex flex-wrap items-center mb-6">
                <div className="mb-4 mr-4 lg:mb-0">
                  {finalProduct.stock_cant !== 0 ? (
                    <div className="w-28">
                      <div className="relative flex flex-row w-full h-10 bg-transparent rounded-lg">
                        <button
                          className="w-20 h-full text-gray-600 bg-gray-100 border-r rounded-l outline-none cursor-pointer hover:bg-gray-300 flex items-center justify-center transition-all duration-200"
                          onClick={() => removeQuantity()}
                        >
                          <span className="text-2xl font-normal">-</span>
                        </button>
                        <input
                          type="number"
                          className="flex items-center w-full font-semibold text-center text-gray-700 placeholder-gray-700 bg-gray-100 outline-none  focus:outline-none text-md hover:text-black appearance-none remove-arrow"
                          placeholder={quantity}
                          value={quantity}
                          readOnly
                        />
                        <button
                          className="w-20 h-full text-gray-600 bg-gray-100 border-l rounded-r outline-none cursor-pointer  hover:text-gray-700 hover:bg-gray-300 flex items-center justify-center transition-all duration-200"
                          onClick={() => {
                            addQuantity();
                          }}
                        >
                          <span className="text-2xl font-normal flex items-center">
                            +
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <React.Fragment></React.Fragment>
                  )}
                </div>

                <button
                  href="#"
                  className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1 ease-linear transition-all duration-150 hover:text-blue-50"
                  onClick={() => {
                    addProduct();
                  }}
                >
                  <Icon cart className={"pr-2"} /> Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="py-6 mb-6 border-t border-b border-gray-200">
          <h2 className="mb-2 text-lg font-bold text-gray-700">Descripción</h2>

          <div className="p-0.5 ">
            <div className="rounded-xl ">{finalProduct.public_desc}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
