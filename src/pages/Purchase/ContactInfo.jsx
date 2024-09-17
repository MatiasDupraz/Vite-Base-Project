import React, { useEffect, useRef, useState } from "react";
import Stepper from "../../components/Stepper/Stepper";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Notification from "../../components/Notification";
import { useUser } from "../../context/sessionContext";
import Icon from "../../components/Icon";
import LoggedOut from "../../components/LoggedOut";

const ContactInfo = () => {
  const [errors, setErrors] = useState({});
  const [phoneCodes, setPhoneCodes] = useState([]);
  const [identifications, setIdentifications] = useState([]);

  const [selectedId, setSelectedId] = useState("");
  const [selectedPhoneCode, setSelectedPhoneCode] = useState("");

  const [needBill, setNeedBill] = useState(false);
  const [anotherPerson, setAnotherPerson] = useState(false);

  const [personType, setPersonType] = useState("F");

  const [formData, setFormData] = useState({
    personaTipo: "", // F y J
    nombre: "", // F
    apellido: "", // F
    razonSocial: "", // J
    tipoId: "", // F y J
    identif: "", // F y J
    caracteristica: "", // F y J
    telefono: "", // F y J
    CUIT: "",
    DNI2: "",
  });

  const navigate = useNavigate();

  const { user } = useUser();

  let userId;
  if (user) {
    userId = user.usuario_id;
  }

  const inputClassName = classNames(
    "border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white w-full rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150 "
  );
  const noUserClassName = classNames("block pt-[250px] mb-64");
  const labelClassName = classNames("block uppercase text-md font-bold mb-2 ");
  const inputDivClassName = classNames("col-span-4 lg:col-span-2 px-3 mt-1");
  const errorClassName = classNames("text-red-400");
  const bussinessClassName = classNames(
    personType === "J" ? "grid grid-cols-4 col-span-4" : "hidden"
  );
  const personClassName = classNames(
    personType === "F" ? "grid grid-cols-4 col-span-4" : "hidden"
  );

  const identifClassName = classNames(
    "border-0 px-3 mx-1 py-3 w-36 rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150",
    personType === "F" ? "bg-white " : "bg-gray-100 pointer-events-none"
  );

  const needBillClassName = classNames(
    " ease-linear transition-all duration-200 ",
    needBill ? "block" : "hidden"
  );

  const anotherPersonClassName = classNames(
    " ease-linear transition-all duration-200 col-span-2",
    anotherPerson ? "block" : "hidden"
  );

  const form = useRef();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBillChange = () => {
    setNeedBill(!needBill);
    setFormData({ ...formData, CUIT: "" });
  };

  const handleAnotherPersonChange = () => {
    setAnotherPerson(!anotherPerson);
    setFormData({ ...formData, DNI2: "" });
  };

  const validateForm = (data) => {
    let errors = {};
    const selectedIdentification = identifications.find(
      (id) => id.persona_ident_id === parseInt(selectedId)
    );
    if (personType === "F") {
      if (!data.nombre.trim()) {
        errors.nombre = "Ingrese su nombre";
      } else if (!data.apellido.trim()) {
        errors.apellido = "Ingrese su apellido";
      } else if (!selectedId) {
        errors.identif = "Seleccione tipo de documento";
      } else if (!data.identif.trim()) {
        errors.identif = "Ingrese su documento";
      } else if (!selectedPhoneCode) {
        errors.telefono = "Seleccione la característica";
      } else if (!data.telefono.trim()) {
        errors.telefono = "Ingrese su teléfono";
      } else if (data.telefono.length < 9) {
        errors.telefono = "Revise el teléfono ingresado";
      } else if (data.identif.length < selectedIdentification.ident_longitud) {
        errors.identif = `Revise el número de identificación ingresado`;
      } // Verificar longitud de la identificación

      if (needBill) {
        if (formData.CUIT) {
          if (data.CUIT.length < 11) {
            errors.CUIT = `Revise el CUIT ingresado`;
          }
        } else {
          errors.CUIT = `Ingrese su CUIT`;
        }
      }

      if (anotherPerson) {
        if (formData.DNI2) {
          if (data.DNI2.length < 8) {
            errors.DNI2 = `Revise el DNI ingresado`;
          }
        } else {
          errors.DNI2 = `Ingrese el DNI de quien retira`;
        }
      }
    } else if (personType === "J") {
      if (!data.razonSocial.trim()) {
        errors.razonSocial = "Ingrese el nombre de su empresa";
      } else if (!selectedId) {
        errors.identif = "Seleccione tipo de documento";
      } else if (!data.CUIT.trim()) {
        errors.identif = "Ingrese su CUIT";
      } else if (!selectedPhoneCode) {
        errors.telefono = "Seleccione la característica";
      } else if (!data.telefono.trim()) {
        errors.telefono = "Ingrese su teléfono";
      } else if (data.telefono.length < 9) {
        errors.telefono = "Revise el teléfono ingresado";
      } else if (data.CUIT.length < selectedIdentification.ident_longitud) {
        errors.identif = `Revise el número de identificación ingresado`;
      } // Verificar longitud de la identificación
    }

    return errors;
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      fetchContactInfo();
    }
  };

  const fetchContactInfo = async () => {
    window.scrollTo(0, 0);
    if (userId !== undefined) {
      try {
        const response = await axios.get(
          `http://localhost:5000/contact?uid=${userId}&pt=${formData.personaTipo}&n='${formData.nombre}'&s='${formData.apellido}'&bn='${formData.razonSocial}'&id=${formData.identif}&idt=${formData.tipoId}&pc=${formData.caracteristica}&pn=${formData.telefono}&cuit=${formData.CUIT}&DNI2=${formData.DNI2}`
        );
        navigate("/payment");
        return response;
      } catch (err) {
        if (err.response.status === 401) {
          Notification({
            text: "Sesión caducada, inice nuevamente",
            error: true,
          });
        }
        console.error(`Error fetching user from database: ${err}`);
      }
    } else {
      Notification({
        text: "Sesión caducada, inice nuevamente",
        error: true,
      });
    }
  };

  const handleOptionChange = (e) => {
    setPersonType(e.target.value);
    setFormData({
      personaTipo: "", // F y J
      nombre: "", // F
      apellido: "", // F
      razonSocial: "", // J
      tipoId: "", // F y J
      identif: "", // F y J
      caracteristica: "", // F y J
      telefono: "", // F y J
      CUIT: "",
      DNI2: "",
    });
  };

  useEffect(() => {
    if (personType === "J") {
      setSelectedId(2);
    }
  }, [personType]);

  useEffect(() => {
    const fetchPhoneCode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/phoneCode`);
        const fetchedPhoneCode = response.data[0];
        setPhoneCodes(fetchedPhoneCode);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    fetchPhoneCode();
  }, []);

  useEffect(() => {
    const fetchIdentification = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/identification`
        );
        const fetchedIdentifications = response.data[0];
        setIdentifications(fetchedIdentifications);
      } catch (err) {
        console.error("Error fetching product details:", err);
      }
    };
    fetchIdentification();
  }, []);

  useEffect(() => {
    setFormData({
      ...formData,
      tipoId: selectedId,
      caracteristica: selectedPhoneCode,
      personaTipo: personType,
    });
  }, [selectedId, selectedPhoneCode]);
  if (user) {
    return (
      <React.Fragment>
        <div className="bg-slate-100 h-full w-full fixed -z-10"></div>
        <div className="pt-[182px] md:pt-[168px]">
          <Stepper step={3} />
          <div className="md:px-10 grid grid-cols-12 mt-10">
            <div className="col-start-1 col-span-12 md:col-start-3 md:col-span-8 xl:col-start-4 xl:col-span-6 shadow-lg bg-white shadow-gray-300 border border-slate-200 p-3">
              <p className=" text-xl font-semibold text-center text- mb-10">
                Datos de contacto
              </p>
              <hr />
              <div className="flex justify-around mt-5 mb-5">
                <label className="flex select-none">
                  <input
                    type="radio"
                    name="personType"
                    checked={personType === "F"}
                    onChange={handleOptionChange}
                    value="F"
                    className="text-left mr-2 col-span-12 "
                  />
                  <p className=" text-xl font-semibold">Particular</p>
                </label>
                <label className="flex select-none">
                  <input
                    type="radio"
                    name="personType"
                    checked={personType === "J"}
                    onChange={handleOptionChange}
                    value="J"
                    className="text-left mr-2 col-span-12"
                  />
                  <p className="text-xl font-semibold">Empresa</p>
                </label>
              </div>
              <hr />

              <form
                className="grid grid-cols-4 gap-2 mt-5"
                ref={form}
                onSubmit={handleFormSubmit}
              >
                <div className={personClassName}>
                  <div className={inputDivClassName}>
                    <label className={labelClassName}>Nombre</label>
                    <input
                      className={inputClassName}
                      placeholder="Nombre*"
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                    {errors.nombre && (
                      <p className={errorClassName}>{errors.nombre}</p>
                    )}
                  </div>
                  <div className={inputDivClassName}>
                    <label className={labelClassName}>Apellido</label>
                    <input
                      className={inputClassName}
                      placeholder="Apellido*"
                      type="text"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                    />
                    {errors.apellido && (
                      <p className={errorClassName}>{errors.apellido}</p>
                    )}
                  </div>
                </div>
                <div className={bussinessClassName}>
                  <div className={inputDivClassName}>
                    <label className={labelClassName}>Razón Social</label>
                    <input
                      className={inputClassName}
                      placeholder="Razón Social*"
                      type="text"
                      id="razonSocial"
                      name="razonSocial"
                      value={formData.razonSocial}
                      onChange={handleInputChange}
                    />
                    {errors.razonSocial && (
                      <p className={errorClassName}>{errors.razonSocial}</p>
                    )}
                  </div>
                </div>
                <div className={inputDivClassName}>
                  <label className={labelClassName}>Identificación</label>
                  <div className="flex">
                    <select
                      value={personType === "F" ? selectedId : 2}
                      onChange={(e) => setSelectedId(e.target.value)}
                      id="tipoId"
                      name="tipoId"
                      className={identifClassName}
                      placeholder="Tipo Id.*"
                    >
                      {personType === "F" ? <option>Tipo Id.*</option> : null}
                      {identifications.map((id) => {
                        if (personType === "F") {
                          if (id.persona_ident_nom !== "CUIT") {
                            return (
                              <option
                                key={id.persona_ident_id}
                                value={`${id.persona_ident_id}`}
                              >
                                {id.persona_ident_nom}
                              </option>
                            );
                          }
                        } else if (personType === "J") {
                          if (id.persona_ident_nom === "CUIT") {
                            return (
                              <option
                                key={id.persona_ident_id}
                                value={`${id.persona_ident_id}`}
                              >
                                {id.persona_ident_nom}
                              </option>
                            );
                          }
                        }
                        return null; // Ensure to return something if the condition doesn't match
                      })}
                    </select>
                    <input
                      className={inputClassName}
                      placeholder="Identificación* (Sin puntuación)"
                      type="text"
                      id={personType === "F" ? "identif" : "CUIT"}
                      name={personType === "F" ? "identif" : "CUIT"}
                      value={
                        personType === "F" ? formData.identif : formData.CUIT
                      }
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.identif && (
                    <p className={errorClassName}>{errors.identif}</p>
                  )}
                </div>
                <div className={inputDivClassName}>
                  <label className={labelClassName}>Teléfono</label>
                  <div className="flex">
                    <select
                      value={selectedPhoneCode}
                      onChange={(e) => setSelectedPhoneCode(e.target.value)}
                      id="caracteristica"
                      name="caracteristica"
                      className={
                        "border-0 px-3 mx-1 py-3 w-24 rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                      }
                      placeholder="Tipo Id.*"
                    >
                      <option value="">Caract.*</option>
                      {phoneCodes.map((code) => (
                        <option
                          key={code.telefono_prefijo_id}
                          value={`${code.telefono_prefijo_num}`}
                        >
                          {`+${code.telefono_prefijo_num} ${code.telefono_prefijo_pais_abrev}`}
                        </option>
                      ))}
                    </select>
                    <input
                      className={inputClassName}
                      placeholder="Teléfono* (Sólo números)"
                      type="number"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.telefono && (
                    <p className={errorClassName}>{errors.telefono}</p>
                  )}
                </div>
                {personType === "F" ? (
                  <React.Fragment>
                    <div className="col-span-3">
                      <label>
                        <input
                          type="checkbox"
                          checked={needBill}
                          className="ml-4"
                          onChange={handleBillChange}
                        />
                        <span className="pl-3 font-semibold ">
                          Necesito Factura A
                        </span>
                      </label>

                      {
                        <div className={needBillClassName}>
                          <div className={inputDivClassName}>
                            <label className={labelClassName}>CUIT</label>
                            <div className="flex">
                              <input
                                className={inputClassName}
                                placeholder="CUIT* (Sin puntuación)"
                                type="text"
                                id="CUIT"
                                name="CUIT"
                                value={formData.CUIT}
                                onChange={handleInputChange}
                              />
                            </div>
                            {errors.CUIT && (
                              <p className={errorClassName}>{errors.CUIT}</p>
                            )}
                          </div>
                        </div>
                      }
                    </div>

                    <div className={"col-span-4"}>
                      <p className="text-neutral-500 text-center italic">
                        En caso de retiro de los productos por parte de otra
                        persona, debe especificar el documento de identidad
                      </p>
                    </div>
                    <div className="col-span-3">
                      <label>
                        <input
                          type="checkbox"
                          checked={anotherPerson}
                          className="ml-4"
                          onChange={handleAnotherPersonChange}
                        />
                        <span className="pl-3 font-semibold ">
                          Entrega a otra persona
                        </span>
                      </label>

                      {
                        <div className={anotherPersonClassName}>
                          <div className={inputDivClassName}>
                            <label className={labelClassName}>DNI</label>
                            <div className="flex">
                              <input
                                className={inputClassName}
                                placeholder="DNI* (Sin puntuación)"
                                type="text"
                                id="DNI2"
                                name="DNI2"
                                value={formData.DNI2}
                                onChange={handleInputChange}
                              />
                            </div>
                            {errors.DNI2 && (
                              <p className={errorClassName}>{errors.DNI2}</p>
                            )}
                          </div>
                        </div>
                      }
                    </div>
                  </React.Fragment>
                ) : (
                  ""
                )}

                <div className="flex justify-center mt-16 col-span-4">
                  <button
                    type="submit"
                    className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1 ease-linear transition-all duration-150 hover:text-blue-50"
                  >
                    Siguiente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else if (!user) {
    return <LoggedOut />;
  }
};

export default ContactInfo;
