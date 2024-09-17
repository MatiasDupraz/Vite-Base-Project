import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/sessionContext";
import LoggedOut from "../components/LoggedOut";
import useTextCapitalize from "../hooks/text-capitalize";
import usePriceFormating from "../hooks/price-formating";
import { format } from "@formkit/tempo";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../components/Icon";

const PurchaseResumes = () => {
  window.scrollTo(0, 0);
  const [purchaseDetails, setPurchaseDetails] = useState({
    purchaseId: 0,
    paymentType: "",
    shipingType: "",
    shipingCost: 0,
    purchasePrice: 0,
    purchaseDate: null,
    paymentState: "",
    shippingState: "",
  });

  const { user } = useUser();
  const navigate = useNavigate();
  const capitalizer = useTextCapitalize;
  const priceFormater = usePriceFormating;
  let userId;
  const location = useLocation();

  const purchaseId = new URLSearchParams(location.search).get("p");

  if (user) {
    userId = user.usuario_id;
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/orderById?userId=${userId}&ventaId=${purchaseId}`
        );
        if (response.data) {
          setPurchaseDetails((prevState) => ({
            ...prevState,
            purchaseId: response.data.web_venta_id,
            paymentType: response.data.cobro_forma_tipo_desc,
            shipingCost: response.data.envio_costo,
            purchasePrice: response.data.precio_pedido,
            purchaseDate: response.data.venta_fecha,
          }));
          if (response.data.envio_tipo_cod === "D") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              shipingType: "Domicilio",
            }));
          } else if (response.data.envio_tipo_cod === "S") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              shipingType: "Sucursal",
            }));
          } else if (response.data.envio_tipo_cod === "R") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              shipingType: "Retiro",
            }));
          }
          if (response.data.envio_estado === "P") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              shippingState: "En preparacion",
            }));
          } else if (response.data.envio_estado === "E") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              shippingState: "En camino",
            }));
          } else if (response.data.envio_estado === "R") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              shippingState: "Recibido",
            }));
          }

          if (response.data.pago_estado === "P") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              paymentState: "Pendiente",
            }));
          }
          if (response.data.pago_estado === "R") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              paymentState: "Rechazado",
            }));
          }

          if (response.data.pago_estado === "A") {
            setPurchaseDetails((prevState) => ({
              ...prevState,
              paymentState: "Aprobado",
            }));
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [user]);

  if (user && purchaseDetails.purchaseId) {
    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
        <div className="pt-[182px] md:pt-[168px] mb-64 md:mb-0">
          <div className="md:px-10 grid grid-cols-12 mt-10">
            {" "}
            <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6  shadow-lg bg-white shadow-gray-300 border border-slate-200 p-3 pb-10">
              <button onClick={() => navigate(-1)}>
                <Icon leftArrow className={"h-7 m-2 mb-0 text-neutral-700"} />
              </button>
              <div className="flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-top-0.5 z-10  h-14 w-14 rounded-full bg-green-500 bg-opacity-10 text-green-600  mt-3 "
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h1 className="text-center mt-5 font-semibold text-neutral-700 text-xl tracking-wide font-inter">
                Orden de Compra
              </h1>
              <div className="flex justify-center my-5">
                <div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Orden de Pedido:</p>
                    <p className="font-semibold">
                      {purchaseDetails.purchaseId}
                    </p>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Fecha de pedido: </p>
                    <span>
                      {purchaseDetails.purchaseDate
                        ? format(purchaseDetails.purchaseDate, "medium")
                        : ""}
                    </span>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Medio de pago: </p>
                    <span>{capitalizer(purchaseDetails.paymentType)}</span>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Subtotal: </p>
                    <span>{priceFormater(purchaseDetails.purchasePrice)}</span>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Tipo de Envío: </p>
                    <span>{purchaseDetails.shipingType}</span>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Costo Envío: </p>
                    <span>{priceFormater(purchaseDetails.shipingCost)}</span>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Total </p>
                    <span>
                      {priceFormater(
                        purchaseDetails.purchasePrice +
                          purchaseDetails.shipingCost
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <hr />
              <div className="flex justify-center">
                <div>
                  <div className=" flex my-2">
                    <p className="w-48 font-semibold">Estado pago: </p>
                    <span className="bg-blue-100 text-blue-500 rounded-md px-1.5">
                      {purchaseDetails.paymentState}
                    </span>
                  </div>
                  <div className=" flex">
                    <p className="w-48 font-semibold">Estado envío: </p>
                    <span className="bg-blue-100 text-blue-500 rounded-md px-1.5">
                      {purchaseDetails.shippingState}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (!purchaseDetails.purchaseId) {
    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
        <div className="pt-[182px] md:pt-[168px] mb-64 md:mb-0">
          <div className="md:px-10 grid grid-cols-12 mt-10">
            {" "}
            <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6  lg:rounded-md shadow-lg bg-white shadow-gray-300 border border-slate-200 p-3 h-56">
              <h1 className="text-center mt-5 font-semibold text-neutral-700 text-xl tracking-wide font-inter">
                No se encontró la orden
              </h1>
              <p className="text-center mt-5">
                El número de orden no existe o no esta asociado al usuario
                actual
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (!user) {
    return <LoggedOut />;
  }
};

export default PurchaseResumes;
