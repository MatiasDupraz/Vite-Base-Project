import React, { useEffect, useState, lazy } from "react";
import classNames from "classnames";
import { useUser } from "../../context/sessionContext.jsx";
import { useNavigate } from "react-router-dom";
import usePriceFormating from "../../hooks/price-formating";
import axios from "axios";

const Stepper = lazy(() => import("../../components/Stepper/Stepper.jsx"));
const Notification = lazy(() => import("../../components/Notification.jsx"));
const LoggedOut = lazy(() => import("../../components/LoggedOut.jsx"));

const PaymentMethods = () => {
  window.scrollTo(0, 0);
  const { user } = useUser();
  const priceFormater = usePriceFormating;

  const navigate = useNavigate();

  const imgClassName = classNames("w-10 flex aspect-square align-middle");
  const cardClassName = classNames(
    "col-span-12 md:col-start-4 md:col-span-6 bg-white border-b border-gray-100 shadow-lg shadow-neutral-300 hover:bg-slate-100 ease-linear duration-200 transition-all"
  );
  const sectionClassName = classNames(
    "col-span-12 md:col-start-4 md:col-span-6 bg-white border-b border-gray-100 shadow-neutral-300 shadow-lg shadow-neutral-300"
  );
  const firstClassName = classNames(sectionClassName, " border-b pb-5");
  const lastClassName = classNames(
    sectionClassName,
    " border-none flex justify-center py-5"
  );
  const cardContentClassName = classNames(
    "m-2 flex justify-between p-2 rounded-md "
  );

  let userId;
  if (user) {
    userId = user.usuario_id;
  }

  const [shippingPrice, setShippingPrice] = useState(null);
  const [finalPrice, setFinalPrice] = useState(null);

  const fetchFinalPrice = async () => {
    if (user) {
      try {
        const response = await axios.get(
          `http://localhost:5000/finalPrice?uid=${userId}`
        );
        if (response.data.finalPrice && response.data.shippingPrice !== null) {
          setFinalPrice(response.data.finalPrice);
          setShippingPrice(response.data.shippingPrice);
        }
      } catch (err) {
        console.error(`Error fetching data from database: ${err}`);
      }
    }
  };

  useEffect(() => {
    fetchFinalPrice();
  }, [userId]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const fetchPaymentMethod = async () => {
    if (userId !== undefined) {
      if (selectedPaymentMethod) {
        try {
          const response = await axios.get(
            `http://localhost:5000/payment?uid=${userId}&ptid=${selectedPaymentMethod}`
          );
          navigate("/order");
          Notification({
            text: "¡Gracias por su compra!",
            success: true,
          });
          return response;
        } catch (err) {
          if (err.response.status === 401) {
            Notification({
              text: "Sesión caducada, inicie nuevamente",
              error: true,
            });
          }
          console.error(`Error fetching user from database: ${err}`);
        }
      } else {
        Notification({
          text: "Seleccione un método de pago",
          error: true,
        });
      }
    } else {
      Notification({
        text: "Sesión caducada, inicie nuevamente",
        error: true,
      });
    }
  };

  const handleCardClick = (methodId) => {
    setSelectedPaymentMethod(
      methodId === selectedPaymentMethod ? null : methodId
    );
  };

  const informationClassName = (method) =>
    classNames(
      "bg-slate-50 w-full p-2 ease-linear duration-200 transition-all pl-12",
      selectedPaymentMethod === method ? "block" : "hidden"
    );

  useEffect(() => {}, [selectedPaymentMethod]);

  let transference = (
    <div className={imgClassName}>
      <img
        alt="payment method"
        src="./img/paymentMethods/Transference.webp"
        className="object-contain max-w-full max-h-full"
      />
    </div>
  );
  let cash = (
    <div className={imgClassName}>
      <img
        alt="payment method"
        src="./img/paymentMethods/Cash.webp"
        className="object-contain max-w-full max-h-full"
      />
    </div>
  );
  let credit = (
    <div className={imgClassName}>
      <img
        alt="payment method"
        src="./img/paymentMethods/Credit.webp"
        className="object-contain max-w-full max-h-full"
      />
    </div>
  );
  let tether = (
    <div className={imgClassName}>
      <img
        alt="payment method"
        src="./img/paymentMethods/Usdt.webp"
        className="object-contain max-w-full max-h-full"
      />
    </div>
  );

  // '1 EFECTIVO',
  // '2 CUENTA_CORRIENTE',
  // '3 TRANSFERENCIA_BANCARIA',
  // '4 TARJETA_CREDITO',
  // '5 TRANSFERENCIA_CRIPTO'

  const paymentMethods = [
    {
      id: 0,
      name: "Efectivo en local",
      icon: cash,
      information: (
        <p>
          Para realizar el pago en efectivo acercate a nuestro local en:{" "}
          <p className="font-semibold pr-1.5">
            Alvear 399 Esq. Tucumán - Villa María (Cba.)
          </p>
        </p>
      ),
      systemId: 1,
    },
    {
      id: 1,
      name: "Transferencia",
      icon: transference,
      information: (
        <p>
          <p className="flex">
            <span className="font-semibold pr-1.5 w-20">Banco:</span> Bancor
          </p>
          <p className="flex">
            <p className="font-semibold pr-1.5 w-20">Nro. CBU:</p>
            0200304511000007357480
          </p>
          <p className="flex">
            <p className="font-semibold pr-1.5 w-20">Alias:</p> MYDIS.INF
          </p>{" "}
          <p className="flex">
            <p className="font-semibold pr-1.5 w-20">Titulares:</p>Nora Mano,
            Daniel Dupraz
          </p>
        </p>
      ),
      systemId: 3,
    },

    {
      id: 2,
      name: "Tarjetas de Crédito",
      icon: credit,
      information: (
        <p>
          Consultá nuestras promociones en el siguiente link
          <p>
            <Link
              to="/promotions"
              className="col-start-4 col-span-6 mb-5 text-sky-500 underline underline-offset-2 hover:text-sky-700"
            >
              Promociones y Descuentos
            </Link>
          </p>
          <p>Al finalizar la compra nos comunicaremos para gestionar el pago</p>
        </p>
      ),
      systemId: 4,
    },
    {
      id: 3,
      name: "Transferencia Criptomonedas",
      icon: tether,
      information: (
        <p>
          Al finalizar la compra nos comunicaremos para enviarte los datos de
          transferencia
        </p>
      ),
      systemId: 5,
    },
  ];

  if (userId !== undefined) {
    const paymentMethodsMap = paymentMethods.map((method, index) => {
      return (
        <div className={cardClassName}>
          <div className={cardContentClassName}>
            <label
              htmlFor={method.systemId}
              className="flex justify-between w-full cursor-pointer"
            >
              <div className="flex">
                <input
                  type="radio"
                  id={method.systemId}
                  name="payment-method"
                  className="mr-4"
                  onClick={() => handleCardClick(method.systemId)}
                />
                <div className="flex">
                  <div className="mr-5">{method.icon}</div>
                  <div>
                    <p className="font-medium">{method.name}</p>
                  </div>
                </div>
              </div>
              <div></div>
            </label>
          </div>
          <div className={informationClassName(method.systemId)}>
            {method.information}
          </div>
        </div>
      );
    });

    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
        <div className="pt-[182px] md:pt-[168px]  mb-64">
          <Stepper step={4} />

          <div className="grid grid-cols-12 mt-10">
            {" "}
            <div className={firstClassName}>
              <h1 className="text-center mt-10 font-semibold text-neutral-700 text-xl tracking-wide font-inter">
                Seleccione el método de pago
              </h1>
              <h2 className="text-center text-lg mt-4">
                <span className="mr-2 text-xs md:text-sm">
                  Subtotal: {priceFormater(finalPrice)}
                </span>
                <span className="ml-2 text-xs md:text-sm">
                  Envío: {priceFormater(shippingPrice)}
                </span>
              </h2>
              <h2 className="text-center text-lg mt-4">
                Final: {priceFormater(finalPrice + shippingPrice)}
              </h2>
            </div>
            {paymentMethodsMap}
            <div className={lastClassName}>
              <button
                className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1"
                onClick={() => {
                  fetchPaymentMethod();
                }}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (!user) {
    return <LoggedOut />;
  }
};

export default PaymentMethods;
