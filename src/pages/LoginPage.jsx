import React, { useRef, useState } from "react";

import { Link } from "react-router-dom";
import classNames from "classnames";
import GoogleLogin from "../lib/GoogleLogin";
import axios from "axios";
import { useUser } from "../context/sessionContext";
import { useNavigate } from "react-router-dom";
import Notification from "../components/Notification";
import Icon from "../components/Icon";

const LoginPage = () => {
  window.scrollTo(0, 0);
  const { setUser } = useUser();
  const { user } = useUser();
  const [registered, setRegistered] = useState(true);
  const navigate = useNavigate();
  const errorClassName = classNames("text-red-400");
  const registerClassName = classNames(
    " hover:underline decoration-2",
    registered ? "text-blue-300" : "font-bold text-blue-600 animate-pulse"
  );

  const isValidEmail = (email) => {
    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@+.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailPattern.test(email);
  };

  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
      errors.email = "Ingrese su correo";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Correo inválido";
    } else if (!data.password.trim()) {
      errors.password = "Ingrese su contraseña";
    }
    return errors;
  };

  const initialFormState = {
    email: "",
    password: "",
  };

  const form = useRef();
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setFormData(initialFormState);
      fetchUser();
    }
  };

  const closeSession = () => {
    localStorage.removeItem("user");
    navigate("/");
    setUser("");
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/userLogin?e=${encodeURIComponent(
          formData.email
        )}&p=${encodeURIComponent(formData.password)}`
      );
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
      Notification({ text: "Inicio de sesión correcto", success: true });
      return response;
    } catch (err) {
      console.error(`Error fetching user from database: ${err}`);
      if (err.response) {
        if (err.response.status === 404) {
          errors.email = "Correo no registrado";
          errors.password = "";
          setRegistered(false);
          setErrors(errors);
        } else if (err.response.status === 401) {
          errors.email = "";
          errors.password = "Contraseña incorrecta";
          setErrors(errors);
        }
      }
    }
  };

  if (!user) {
    return (
      <div className="">
        <div className="w-full lg:w-4/12 px-4 mx-auto pt-[200px] bg-white">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <h6 className="text-blueGray-500 text-sm font-bold">
                  Ingresa con
                </h6>
              </div>
              <div className="btn-wrapper text-center">
                <GoogleLogin />
              </div>
              <hr className="mt-6 border-b-1 border-blueGray-300" />
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="text-blueGray-400 text-center mb-3 font-bold">
                <small>O inicia con tus credenciales</small>
              </div>
              <form ref={form} onSubmit={handleFormSubmit}>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Correo*"
                  />
                  {errors.email && (
                    <p className={errorClassName}>{errors.email}</p>
                  )}
                </div>
                <div className="relative w-full mb-3">
                  <label
                    className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                    htmlFor="grid-password"
                  >
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Contraseña*"
                  />
                  {errors.password && (
                    <p className={errorClassName}>{errors.password}</p>
                  )}
                </div>
                <div></div>
                <div className="text-center mt-6">
                  <button
                    className="bg-slate-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-blue-300 mr-1 mb-1 w-full ease-linear transition-all duration-150 hover:text-blue-50"
                    type="submit"
                  >
                    Ingresar
                  </button>
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    ¿No estás Registrado?
                  </h6>
                  <Link className={registerClassName} to="/register">
                    Registrarse
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="">
        <div className="w-full lg:w-4/12 px-4 mx-auto pt-[200px] bg-white">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
            <div className="rounded-t mb-0 px-6 py-6">
              <div className="text-center mb-3">
                <Icon user className="text-6xl text-neutral-400" />
                <div className="my-5">
                  <h1 className="text-neutral-700 text-2xl font-bold">
                    {" "}
                    {user.usuario_nombre}
                  </h1>
                  <h5 className="text-neutral-700 text-md lowercase">
                    {user.usuario_correo}
                  </h5>
                </div>
                <button
                  className="bg-red-800 bg-opacity-50 text-rose-800 border-2 border-red-800 active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-red-800 mr-1 mb-1 w-full ease-linear transition-all duration-150 hover:text-red-700 hover:border-transparent"
                  type="submit"
                  onClick={closeSession}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default LoginPage;
