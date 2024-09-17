import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Stepper from "../../components/Stepper/Stepper";
import { useUser } from "../../context/sessionContext";
import usePriceFormating from "../../hooks/price-formating";
import LoggedOut from "../../components/LoggedOut";
import axios from "axios";

const CartResume = () => {
  window.scrollTo(0, 0);
  const { user } = useUser();
  const [userId, setUserId] = useState(0);
  const [products, setProducts] = useState(0);
  const [total, setTotal] = useState(0);
  const priceFormating = usePriceFormating;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/cart?uid=${userId}`
        );
        setProducts(response.data[0]);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };
    if (user) {
      setUserId(user.usuario_id);
      if (userId !== 0) {
        fetchProducts();
      }
    }
  }, [userId, user]);

  useEffect(() => {
    if (products) {
      let prevTotal = 0;
      products.forEach((product) => {
        prevTotal += product.venta_1_prec * product.producto_cant;
      });
      setTotal(prevTotal);
    }
  }, [products]);

  if (userId !== undefined) {
    const formatedTotalPrice = priceFormating(total);

    if (products.length > 0) {
      return (
        <React.Fragment>
          <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
          <div className="pt-[182px] md:pt-[168px]">
            <Stepper step={1} />
            <div className="md:px-10 grid grid-cols-12  mt-10">
              <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6  shadow-lg bg-white shadow-gray-300 border border-slate-200 p-3">
                <div className="text-left w-full col-span-12 mb-10 text-xl font-semibold">
                  Resumen de compra
                </div>
                <hr />
                {products.map((product) => (
                  <div className="flex border-b p-2 rounded-sm">
                    <img
                      className="w-20 aspect-square bg-white prevent-select rounded-md flex justify-center p-0.5 object-contain max-w-full max-h-full m-0.5 mr-3"
                      src={`/img/prod/${product.archivo_nom}`}
                      alt={`Img ${product.ID}`}
                    />
                    <div className="w-full">
                      <div
                        key={product.ID}
                        className="pt-2 text-blue-800 text-sm md:text-base w-[70%]"
                      >
                        {product.public_titulo.toLowerCase()}
                        <p className="text-neutral-600 text-xs pt-3">
                          Cantidad {product.producto_cant}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {priceFormating(product.venta_1_prec)}
                        </p>
                      </div>
                      <div className="text-right mr-5 flex self-end justify-end h-full text-blue-800">
                        {priceFormating(
                          product.venta_1_prec * product.producto_cant
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-right font-semibold mr-5 p-2">
                  <p className="underline">Total:</p>
                  {formatedTotalPrice}
                </div>
                <div className="col-start-2 mb-2  col-span-10 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6  mt-10 flex justify-center px-10">
                  <Link to="/shipping">
                    <button className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1 w-full ease-linear transition-all duration-150 hover:text-blue-50">
                      Confirmar Compra
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    } else if (!user || products.length === 0) {
      return <LoggedOut />;
    }
  }
};

export default CartResume;
