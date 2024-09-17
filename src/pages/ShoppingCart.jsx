import React, { useEffect, useState } from "react";
import axios from "axios";
import ShoppingCartCard from "../components/ShoppingCartCard";
import { useUser } from "../context/sessionContext";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import usePriceFormating from "../hooks/price-formating";
import LoggedOut from "../components/LoggedOut";
const ShoppingCart = () => {
  window.scrollTo(0, 0);
  const [products, setProducts] = useState([]);

  const { user } = useUser();

  const [userId, setUserId] = useState(0);

  const [total, setTotal] = useState(0);

  const totalPrice = usePriceFormating(total);

  // Create an array to store the final result
  let finalProducts = [];

  const navigate = useNavigate();

  const handleClickNext = () => {
    navigate("/resume");
  };

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

  // Callback function to handle quantity and price changes

  const noProductClassName = classNames("block pt-[250px] mb-64");

  if (products.length > 0) {
    let orderedProducts = new Map();

    products.forEach((product) => {
      if (!orderedProducts.has(product.producto_id)) {
        orderedProducts.set(product.producto_id, product);
      }
    });

    const productClassName = classNames(
      "col-span-12 lg:col-span-9 mb-5 lg:mb-0 lg:mr-10 bg-white shadow-lg shadow-gray-300 border border-slate-200 overflow-y-scroll overflow-x-hidden scrollbar-hide "
    );

    // Iterate over the orderedProducts map
    orderedProducts.forEach((product) => {
      // Create a new object for each product
      let productObj = {
        ...product,
      };
      // Push the object to the result array
      finalProducts.push(productObj);
    });

    function updateQuant(quant, ID) {
      const updatedProducts = finalProducts.map((product) => {
        if (product.producto_id === ID) {
          return { ...product, producto_cant: quant };
        }
        return product;
      });
      finalProducts = updatedProducts;
      let prevTotal = 0;
      updatedProducts.forEach((product) => {
        prevTotal += product.venta_1_prec * product.producto_cant;
      });
      setTotal(prevTotal);
    }

    const finalProductsMap = finalProducts.map((product) => {
      return (
        <ShoppingCartCard
          name={product.public_titulo}
          price={product.venta_1_prec}
          quantity={product.producto_cant}
          image={`/img/prod/${product.archivo_nom}`}
          stock={product.stock_cant}
          ID={product.producto_id}
          className={
            "mx-4 lg:p-0 col-start-1 col-span-8 lg:col-start-2 lg:col-span-6 xl:col-start-0 xl:col-span-5"
          }
          updateQuant={updateQuant}
        />
      );
    });

    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>

        <div className="pt-[182px] md:pt-[168px] md:px-10 grid grid-cols-12 max-h-screen">
          <div className={productClassName}>{finalProductsMap}</div>
          <div className="col-span-12 lg:col-start-10 lg:col-span-3 bg-white shadow-lg shadow-gray-300 border border-slate-200 px-2 h-56 ">
            <p className="py-4 pl-5 font-medium">Confirmar Compra</p>
            <hr />

            <hr />
            <p className="pt-4 pb-2 pl-5 font-bold text-lg">
              Total: {totalPrice}
            </p>

            <button
              className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1 w-full ease-linear transition-all duration-150 hover:text-blue-50"
              onClick={handleClickNext}
            >
              Continuar Compra
            </button>

            <div className="flex justify-center">
              <button
                className=" px-2  py-1.5 m-2 text-center text-blue-600 underline border border-transparent   hover:text-blue-800 rounded-xl"
                onClick={() => navigate(-1)}
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (user && products.length === 0) {
    return (
      <React.Fragment>
        <div className="bg-neutral-100 h-full w-full fixed -z-10"></div>
        <div className={noProductClassName}>
          <div className="flex justify-center select-none">
            <img
              src="./img/no-products.webp"
              className="h-36 select-none"
              alt="Empty bag"
            />
          </div>
          <h1 className="text-center text-xl">
            No hay productos seleccionados
          </h1>
          <h2 className="text-center text-md text-neutral-600">
            ¡Comience a agregar productos para proceder con la compra!
          </h2>
        </div>
      </React.Fragment>
    );
  } else if (!user) {
    return <LoggedOut />;
  }
};
export default ShoppingCart;
