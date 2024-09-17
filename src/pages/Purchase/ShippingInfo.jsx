import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/sessionContext";
import usePriceFormating from "../../hooks/price-formating";

const Stepper = React.lazy(() => import("../../components/Stepper/Stepper"));
const Icon = React.lazy(() => import("../../components/Icon"));
const Notification = React.lazy(() => import("../../components/Notification"));
const LoggedOut = React.lazy(() => import("../../components/LoggedOut"));

const ShippingInfo = () => {
  const navigate = useNavigate();

  const priceFormater = usePriceFormating;

  const [shippingOption, setShippingOption] = useState("shipping");
  const [deliveryOption, setDeliveryOption] = useState("home");
  const [provinces, setProvinces] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [envioTipo, setEnvioTipo] = useState("D");

  const [shippingPrice, setShippingPrice] = useState(0);
  const [finalCartWeight, setFinalCartWeight] = useState(0);

  useEffect(() => {
    // 'R' retiro, 'D' Domicilio, 'S' Sucursal
    if (shippingOption === "pickup") {
      setEnvioTipo("R");
    } else if (shippingOption === "shipping") {
      if (deliveryOption === "pickup") {
        setEnvioTipo("S");
      } else if (deliveryOption === "home") {
        setEnvioTipo("D");
      }
    }
    setFormData({
      ...formData,
      envioTipo: envioTipo,
    });
  }, [shippingOption, deliveryOption, envioTipo]);

  const { user } = useUser();

  let userId;
  if (user) {
    userId = user.usuario_id;
  }

  const [formData, setFormData] = useState({
    envioTipo: "", // 'R' retiro, 'D' Domicilio, 'S' Sucursal
    provincia: "",
    localidad: "",
    direccion: "",
    altura: "",
    piso: "",
    departamento: "",
    codigopostal: "",
    observaciones: "",
  });
  const [errors, setErrors] = useState({});

  const locationClassName = classNames(
    "border-0 px-3 py-3  w-full rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150",
    selectedProvince ? "bg-white " : "bg-gray-100 pointer-events-none"
  );
  const homeDeliveryClassName = classNames(
    shippingOption === "shipping" ? "block pt-10 px-2" : "hidden"
  );
  const pickupClassName = classNames(
    shippingOption === "pickup" ? "block" : "hidden"
  );
  const deliveryDataClassName = classNames(
    deliveryOption === "home" ? "block" : "hidden"
  );

  const deliveryFlexDataClassName = classNames(
    deliveryOption === "home" ? "flex" : "hidden"
  );

  const observationsDataClassName = classNames(
    deliveryOption === "home" ? "col-span-2" : "hidden"
  );

  const errorClassName = classNames("text-red-400");
  // Handler function to update the selected option
  const handleShippingOptionChange = (e) => {
    setShippingOption(e.target.value);
    setFormData({
      envioTipo: "",
      provincia: "",
      localidad: "",
      direccion: "",
      altura: "",
      piso: "",
      departamento: "",
      codigopostal: "",
      observaciones: "",
    });
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
    setFormData({
      ...formData,
      direccion: "",
      altura: "",
      piso: "",
      departamento: "",
      codigopostal: "",
      observaciones: "",
    });
  };
  // 'R' retiro, 'D' Domicilio, 'S' Sucursal
  const handleCalculateShipping = () => {
    const fetchShippingCost = async () => {
      try {
        let shippingType;
        if (envioTipo === "S") {
          shippingType = 1;
        } else if (envioTipo === "D") {
          shippingType = 2;
        } else if (envioTipo === "R") {
          shippingType = 3;
        }

        if (shippingType && formData.localidad) {
          if (shippingType !== 3) {
            const response = await axios.get(
              `http://localhost:5000/shippingCost?locationID=${encodeURIComponent(
                formData.localidad
              )}&shippingTypeID=${shippingType}&totalWeight=${finalCartWeight}`
            );
            const fetchedShippingCost = response.data.envio_precio;
            setShippingPrice(fetchedShippingCost);
          } else {
            setShippingPrice(0);
          }
        }

        // setProvinces(fetchedShippingCost);
      } catch (err) {
        console.error("Error fetching shipping price:", err);
      }
    };

    if (!formData.provincia || !formData.localidad || !formData.envioTipo) {
      setErrors({
        ...errors,
        precioEnvio: "Faltan datos para calcular el envío",
      });
    } else {
      setErrors({
        ...errors,
        precioEnvio: "",
      });
      fetchShippingCost();
    }
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      window.scrollTo(0, 0);
      try {
        const response = await axios.get(`http://localhost:5000/provinces`);
        const fetchedProvinces = response.data[0];
        setProvinces(fetchedProvinces);
      } catch (err) {
        console.error("Error fetching provinces:", err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince !== 0 && selectedProvince !== "") {
      const fetchLocations = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/locations?p=${selectedProvince}`
          );
          const fetchedLocations = response.data[0];
          setSelectedLocation("");
          setLocations(fetchedLocations);
        } catch (err) {
          console.error("Error fetching locations:", err);
        }
      };
      // Retrives the weight of the product
      const fetchPrice = async () => {
        const response = await axios.get(
          `http://localhost:5000/shippingWeight?uid=${encodeURIComponent(
            userId
          )}`
        );
        setFinalCartWeight(response.data.totalWeight);
      };

      fetchLocations();
      fetchPrice();
    }
  }, [selectedProvince]);

  useEffect(() => {
    setFormData({
      ...formData,
      provincia: selectedProvince,
      localidad: selectedLocation,
      envioTipo: envioTipo,
    });
  }, [selectedLocation]);
  //Look for errors after form is sent
  const validateForm = (data) => {
    let errors = {};

    if (!selectedProvince.trim()) {
      errors.provincia = "Seleccione una provincia";
    } else if (!selectedLocation.trim()) {
      errors.localidad = "Seleccione una localidad";
    } else if (!data.codigopostal.trim()) {
      errors.codigopostal = "Código postal";
    }
    if (envioTipo === "D") {
      if (!data.direccion.trim()) {
        errors.direccion = "Ingrese su domicilio";
      } else if (!data.altura.trim()) {
        errors.altura = "Ingrese altura";
      }
    }

    return errors;
  };

  const form = useRef();

  //Updates the values inside the form data variable
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  //
  const handleFormSubmit = (event) => {
    window.scrollTo(0, 0);
    event.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      fetchShippingInfo();
    }
  };

  const fetchShippingInfo = async () => {
    if (userId !== undefined) {
      try {
        let shippingType;
        if (formData.envioTipo === "S") {
          shippingType = 1;
        } else if (formData.envioTipo === "D") {
          shippingType = 2;
        }
        console.log(formData);
        const response = await axios.get(
          `http://localhost:5000/shippingInfo?prov=${encodeURIComponent(
            formData.provincia
          )}&loc=${encodeURIComponent(
            formData.localidad
          )}&dir=${encodeURIComponent(
            formData.direccion
          )}&alt=${encodeURIComponent(
            formData.altura
          )}&piso=${encodeURIComponent(
            formData.piso
          )}&depto=${encodeURIComponent(
            formData.departamento
          )}&cp=${encodeURIComponent(
            formData.codigopostal
          )}&obs=${encodeURIComponent(
            formData.observaciones
          )}&uid=${encodeURIComponent(userId)}&class=${encodeURIComponent(
            formData.envioTipo
          )}&totalWeight=${encodeURIComponent(
            finalCartWeight
          )}&shippingTypeID=${encodeURIComponent(shippingType)}
        `
        );

        navigate("/contact");

        return response;
      } catch (err) {
        console.error(`Error fetching user from database: ${err}`);
      }
    } else {
      Notification({
        text: "Sesión caducada, inice nuevamente",
        error: true,
      });
    }
  };

  const fetchWithdrawInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/shippingInfo?&uid=${encodeURIComponent(
          userId
        )}&class=R&shippingTypeID=3
        `
      );
      navigate("/contact");

      return response;
    } catch (err) {
      console.error(`Error fetching user from database: ${err}`);
    }
  };
  if (user) {
    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
        <div className="pt-[182px] md:pt-[168px]">
          <Stepper step={2} />
          <div className="md:px-10 grid grid-cols-12 mt-10 mb-10">
            <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6 shadow-lg bg-white shadow-gray-300 border border-slate-200 p-3">
              <div className="flex justify-around mt-5 mb-5">
                <label className="flex select-none">
                  <input
                    type="radio"
                    name="shippingOption"
                    checked={shippingOption === "shipping"}
                    onChange={handleShippingOptionChange}
                    value="shipping"
                    className="text-left mr-2 col-span-12 "
                  />
                  <p className=" text-md md:text-xl font-semibold">
                    Envío por correo
                  </p>
                </label>
                <label className="flex select-none">
                  <input
                    type="radio"
                    name="shippingOption"
                    checked={shippingOption === "pickup"}
                    onChange={handleShippingOptionChange}
                    value="pickup"
                    className="text-left mr-2 col-span-12"
                  />
                  <p className="text-md md:text-xl font-semibold">
                    Retiro en persona
                  </p>
                </label>
              </div>
              <hr />
              <div className="mt-5">
                {/* HOME DELIVERY FORM */}
                <form
                  className={homeDeliveryClassName}
                  ref={form}
                  onSubmit={handleFormSubmit}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block uppercase text-sm md:text-md font-bold mb-2 ">
                        Provincia
                      </label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className="border-0 px-3 py-3 bg-white w-full rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 "
                        placeholder="Provincia*"
                      >
                        <option value="">Seleccionar provincia*</option>
                        {provinces.map((province) => (
                          <option
                            key={province.provincia_id}
                            value={province.provincia_id}
                          >
                            {province.provincia_desc}
                          </option>
                        ))}
                      </select>
                      {errors.provincia && (
                        <p className={errorClassName}>{errors.provincia}</p>
                      )}
                    </div>
                    <div>
                      <label className="block uppercase text-sm md:text-md font-bold mb-2">
                        Localidad
                      </label>
                      <select
                        value={
                          selectedProvince !== 0 && selectedProvince !== ""
                            ? selectedLocation
                            : ""
                        }
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className={locationClassName}
                        placeholder="Localidad*"
                      >
                        <option value="">Seleccionar localidad*</option>
                        {locations.map((location) => (
                          <option
                            key={location.localidad_id}
                            value={location.localidad_id}
                          >
                            {location.localidad_desc}
                          </option>
                        ))}
                      </select>
                      {errors.localidad && (
                        <p className={errorClassName}>{errors.localidad}</p>
                      )}
                    </div>
                    <div className="flex justify-around mt-5 mb-5 col-span-2">
                      <label className="flex select-none">
                        <input
                          type="radio"
                          name="deliveryOption "
                          checked={deliveryOption === "home"}
                          onChange={handleDeliveryOptionChange}
                          value="home"
                          className="text-left mr-2 col-span-12 "
                        />
                        <p className=" text-md md:text-xl font-semibold">
                          Envío a domicilio
                        </p>
                      </label>
                      <label className="flex select-none">
                        <input
                          type="radio"
                          name="deliveryOption "
                          checked={deliveryOption === "pickup"}
                          onChange={handleDeliveryOptionChange}
                          value="pickup"
                          className="text-left mr-2 col-span-12"
                        />
                        <p className="text-md md:text-xl font-semibold">
                          Retiro en sucursal de correo
                        </p>
                      </label>
                    </div>
                    <hr className="col-span-2" />
                    <div className={deliveryDataClassName}>
                      <label className="block uppercase text-sm md:text-md font-bold mb-2 mt-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className="border-0 px-3 py-3  bg-white w-full rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 "
                        placeholder="Dirección*"
                      />
                      {errors.direccion && (
                        <p className={errorClassName}>{errors.direccion}</p>
                      )}
                    </div>

                    <div className={deliveryFlexDataClassName}>
                      <div className="w-full">
                        <label className="block uppercase text-sm md:text-md font-bold mb-2 mt-2 ">
                          Número
                        </label>
                        <input
                          type="number"
                          id="altura"
                          name="altura"
                          value={formData.altura}
                          onChange={handleInputChange}
                          className="border-0 px-3 py-3  bg-white  rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 "
                          placeholder="Número*"
                        />
                        {errors.altura && (
                          <p className={errorClassName}>{errors.altura}</p>
                        )}
                      </div>
                      <div className="w-full pl-1">
                        <label className="block uppercase text-sm md:text-md font-bold mb-2 mt-2">
                          Piso
                        </label>
                        <input
                          type="number"
                          id="piso"
                          name="piso"
                          value={formData.piso}
                          onChange={handleInputChange}
                          className="border-0 px-3 py-3  bg-white  rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Piso"
                        />
                      </div>
                    </div>
                    <div className={"flex"}>
                      <div className={deliveryDataClassName}>
                        <div>
                          <label className="block uppercase text-sm md:text-md font-bold mb-2">
                            Depto.
                          </label>
                          <input
                            type="text"
                            name="departamento"
                            value={formData.departamento}
                            onChange={handleInputChange}
                            className="border-0 px-3 py-3  bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            placeholder="Depto."
                          />
                        </div>
                      </div>
                      <div className="ml-1">
                        <label className="block uppercase text-sm md:text-md font-bold mb-2">
                          C. Postal
                        </label>
                        <input
                          type="number"
                          id="codigopostal"
                          name="codigopostal"
                          value={formData.codigopostal}
                          onChange={handleInputChange}
                          className="border-0 px-3 py-3  w-full bg-white  rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                          placeholder="C.P.*"
                        />
                        {errors.codigopostal && (
                          <p className={errorClassName}>
                            {errors.codigopostal}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={observationsDataClassName}>
                      <label className="block uppercase text-sm md:text-md font-bold mb-2 col-span-1  ">
                        Observaciones
                      </label>
                      <textarea
                        type="text"
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        className="border-0 px-3 py-3  bg-white w-full rounded text-sm shadow focus:outline-none focus:ring  ease-linear transition-all duration-150"
                        placeholder="Instrucciones de envío, puntos de referencia, descripción de la fachada, etc."
                      />
                    </div>
                    <hr className="col-span-2 my-5" />

                    <div className="col-span-2 md:col-span-1">
                      <label className="block uppercase text-sm md:text-md font-bold mb-2">
                        Costo de envío
                      </label>
                      <div className="flex">
                        <p className="border-0 px-3 py-3 md:text-lg w-[50%] bg-white  rounded  shadow focus:outline-none focus:ring ease-linear transition-all duration-150 select-none">
                          {priceFormater(shippingPrice)}
                        </p>
                        <button
                          type="button"
                          className="ml-5 px-3  text-center bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 ease-linear transition-all duration-150 hover:text-blue-50"
                          children=" w-full "
                          onClick={handleCalculateShipping}
                        >
                          Calcular
                        </button>
                      </div>
                    </div>
                  </div>
                  {errors.precioEnvio && (
                    <p className={errorClassName}>{errors.precioEnvio}</p>
                  )}

                  <div className="flex justify-center mt-16">
                    <button
                      type="submit"
                      className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1"
                    >
                      Siguiente
                    </button>
                  </div>
                </form>
                {/* PICKUP FORM*/}
                <div className={pickupClassName}>
                  <div className="mb-5 ml-10">
                    <p className="font-semibold text-lg">
                      Puede retirar el paquete en:
                    </p>
                    <a href="https://maps.app.goo.gl/obL1ZULvzmtMUs1V6">
                      <p className="hover:text-blue-600 hover:underline">
                        <Icon map className={"text-red-500"} /> Villa María.
                        (Cba) Bv. Alvear 399. Esquina Tucumán
                      </p>
                    </a>
                  </div>
                  <div className="flex justify-center">
                    <iframe
                      title="google api "
                      className="shadow-md shadow-neutral-400"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.268662530997!2d-63.238029223616074!3d-32.411960845085396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cc42e91fbca28d%3A0x1083aa28c67bbb44!2sMYDIS%20Inform%C3%A1tica!5e0!3m2!1ses!2sar!4v1709087434157!5m2!1ses!2sar"
                      width="600"
                      height="350"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={fetchWithdrawInfo}
                      className=" px-14 py-3 mb-2 text-center text-gray-100 bg-blue-600 border border-transparent   hover:bg-blue-800 transition-all duration-200 font-semibold rounded-xl"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-20 md:mt-14" />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (!user) {
    return <LoggedOut />;
  }
};

export default ShippingInfo;
