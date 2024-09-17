import React from "react";
import classNames from "classnames";

const Promotions = () => {
  window.scrollTo(0, 0);
  const promotionClassName = classNames(
    "h-42 md:h-20 px-10 pt-4  md:flex justify-between align"
  );
  const middlePromotionClassName = classNames(
    promotionClassName,
    "border-t border-neutral-200"
  );
  const titleClassName = classNames("font-medium text-lg tracking-wide");
  const descClassName = classNames();
  return (
    <React.Fragment>
      <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
      <div className="pt-[182px] md:pt-[168px] ">
        <h1 className="text-center font-semibold text-neutral-700 text-xl tracking-wide font-inter mb-8">
          Promociones disponibles en Tarjetas de Crédito
        </h1>
        <div className="w-full grid grid-cols-12">
          <div className="col-span-12 md:col-start-2 md:col-span-10 bg-white rounded-md shadow-lg">
            <div className={promotionClassName}>
              <div>
                <h3 className={titleClassName}>
                  3 Cuotas Sin Interés Visa Macro
                </h3>
                <p className={descClassName}>
                  Todos los días hasta el 30 de Junio
                </p>
              </div>
              <div className="flex p-2">
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Visa.webp" />
                </div>
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Macro.webp" />
                </div>
              </div>
            </div>

            <div className={middlePromotionClassName}>
              <div>
                <h3 className={titleClassName}>
                  3 Cuotas Sin Interés Visa y Mastercard Santander
                </h3>
                <p className={descClassName}>
                  Todos los martes y jueves de Abril
                </p>
              </div>
              <div className="flex p-2">
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Visa.webp" />
                </div>
                <div className="aspect-square w-12 m-2">
                  <img src="/img/paymentMethods/Mastercard.webp" />
                </div>
                <div className="aspect-square w-10 m-2">
                  <img src="/img/paymentMethods/Santander.webp" />
                </div>
              </div>
            </div>

            <div className={middlePromotionClassName}>
              <div>
                <h3 className={titleClassName}>
                  6 Cuotas Sin Interés Visa Macro
                </h3>
                <p className={descClassName}>
                  5, 11, 12, 18, 19, 25 y 26 de Abril
                </p>
              </div>
              <div className="flex p-2">
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Visa.webp" />
                </div>
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Macro.webp" />
                </div>
              </div>
            </div>
            <div className={middlePromotionClassName}>
              <div>
                <h3 className={titleClassName}>
                  20, 24 Cuotas Fijas Cordobesa Bancor
                </h3>
              </div>
              <div className="flex p-2">
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Cordobesa.webp" />
                </div>
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Bancor.webp" />
                </div>
              </div>
            </div>
            <div className={middlePromotionClassName}>
              <div>
                <h3 className={titleClassName}>
                  3, 6 y 12 Cuotas Fijas Cuota Simple
                </h3>
              </div>
              <div className="flex p-2">
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Cuota Simple.webp" />
                </div>
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Visa.webp" />
                </div>
                <div className="aspect-square w-12 m-2">
                  <img src="/img/paymentMethods/Mastercard.webp" />
                </div>
                <div className="aspect-square w-16 m-2">
                  <img src="/img/paymentMethods/Cabal.webp" />
                </div>
                <div className="aspect-square w-10 my-1 mx-2">
                  <img src="/img/paymentMethods/AExpress.webp" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-start-2 col-span-10 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6  mt-10 flex justify-center px-10">
            <Link to="/payment">
              <button className=" px-14 py-3 mb-2 text-center text-gray-100 bg-blue-600 border border-transparent   hover:bg-blue-800 transition-all duration-200 font-semibold rounded-xl">
                Volver
              </button>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Promotions;
