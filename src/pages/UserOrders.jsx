import React, { useEffect, useState } from "react";
import { useUser } from "../context/sessionContext";
import usePriceFormating from "../hooks/price-formating";
import { format } from "@formkit/tempo";
import axios from "axios";
import LoggedOut from "../components/LoggedOut";
import { useNavigate } from "react-router-dom";

const UserOrders = () => {
  window.scrollTo(0, 0);
  const { user } = useUser();

  const priceFormater = usePriceFormating;

  const navigate = useNavigate();

  let userId;
  if (user) {
    userId = user.usuario_id;
  }
  const [orders, setOrders] = useState();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/orderByUser?userId=${userId}`
        );
        if (response.data) {
          setOrders(response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    if (user) {
      fetchOrder();
    }
  }, [user]);

  if (user && orders) {
    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
        <div className="pt-[182px] md:pt-[168px]">
          <div className="md:px-10 grid grid-cols-12">
            <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6 shadow-lg bg-white shadow-gray-300 border border-slate-200 p-3 h-screen pb-14">
              <h2 className="text-center mb-5 font-semibold text-neutral-700 text-xl tracking-wide font-inter ">
                Ordenes de Compra
              </h2>
              <div className="overflow-y-scroll overflow-x-hidden scrollbar-hide h-full">
                {orders.map((order) => (
                  <div className="border-b border-slate-200 flex justify-between mx-5 py-2">
                    <div>
                      <p className="text-neutral-800 font-thin">
                        {order.venta_fecha
                          ? format(order.venta_fecha, "short")
                          : ""}
                      </p>
                      <p className="font-semibold">
                        Orden N°{order.web_venta_id}
                      </p>
                      <p>Productos: {order.producto_cantidad}</p>
                    </div>
                    <div className="text-right flex flex-col justify-between">
                      <p>
                        {priceFormater(order.precio_pedido + order.envio_costo)}
                      </p>

                      <button
                        className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-semibold uppercase p-1 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mb-1 ease-linear transition-all duration-150 hover:text-blue-50"
                        onClick={() =>
                          navigate(`../orderH?p=${order.web_venta_id}`)
                        }
                      >
                        Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (!user) {
    return <LoggedOut />;
  }
};

export default UserOrders;
