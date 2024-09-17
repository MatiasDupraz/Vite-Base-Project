import { useRef, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import axios from "axios";

const GoogleLogin = lazy(() => import("../lib/GoogleLogin"));
const Notification = lazy(() => import("../components/Notification"));
const RegisterPage = () => {
  window.scrollTo(0, 0);
  const [registered, setRegistered] = useState(false);
  const registerClassName = classNames(
    " hover:underline decoration-2",
    registered ? "font-bold text-blue-600 animate-pulse" : "text-blue-300"
  );

  const errorClassName = classNames("text-red-400");

  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const emailPattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@+.[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailPattern.test(email);
  };

  const isValidPassword = (password) => {
    const passPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    return passPattern.test(password);
  };

  const isValidName = (name) => {
    const namePattern =
      /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    return namePattern.test(name);
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.email.trim()) {
      errors.email = "Ingrese su correo";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Correo inválido";
    } else if (!data.name.trim()) {
      errors.name = "Ingrese su nombre";
    } else if (!isValidName(data.name)) {
      errors.name = "Nombre inválido";
    } else if (!data.surname.trim()) {
      errors.surname = "Ingrese su apellido";
    } else if (!isValidName(data.surname)) {
      errors.surname = "Apellido inválido";
    } else if (!data.password.trim()) {
      errors.password = "Ingrese su contraseña";
    } else if (!isValidPassword(data.password)) {
      errors.password =
        "La contraseña debe incluir al menos 8 caracteres, incluyendo un número, una mayúscula y un símbolo";
    } else if (!data.passwordConfirm.trim()) {
      errors.passwordConfirm = "Confirme la contraseña";
    } else if (data.passwordConfirm !== data.password) {
      errors.passwordConfirm = "Las contraseñas no coinciden";
    }
    return errors;
  };

  const initialFormState = {
    email: "",
    password: "",
    passwordConfirm: "",
    name: "",
    surname: "",
  };

  const form = useRef();
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSuccess = () => {
    return Notification({ text: "Usuario registrado", success: true });
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      fetchUser();
      setFormData(initialFormState);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/userRegister?e=${encodeURIComponent(
          formData.email
        )}&p=${encodeURIComponent(formData.password)}&n=${encodeURIComponent(
          formData.name
        )}&s=${encodeURIComponent(formData.surname)}`
      );
      navigate("/login");
      handleSuccess();
      return response;
    } catch (err) {
      console.error(`Error fetching user from database: ${err}`);

      if (err.response) {
        if (err.response.status === 409) {
          Notification({
            text: "Correo ya registrado",
            error: true,
          });
          errors.email = "Correo ya registrado";
          errors.password = "";
          setRegistered(true);
          setErrors(errors);
        }
      }
    }
  };

  return (
    <div className="">
      <div className="w-full lg:w-4/12 px-4 mx-auto pt-[200px] bg-white">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gra-200 border-0 bg-white">
          <div className="rounded-t mb-0 px-6 py-6">
            <div className="text-center mb-3">
              <h6 className="text-gra-500 text-sm font-bold">Registrate con</h6>
            </div>
            <div className="btn-wrapper text-center">
              <GoogleLogin />
            </div>
            <hr className="mt-6 border-b-1 border-gra-300" />
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            <div className="text-gra-400 text-center mb-3 font-bold">
              <small>O registrate manualmente</small>
            </div>
            <form ref={form} onSubmit={handleFormSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-gra-600 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Email
                </label>

                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-gra-300 text-gra-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Correo*"
                />
                {errors.email && (
                  <p className={errorClassName}>{errors.email}</p>
                )}
              </div>
              <div className="relative w-full flex mb-3 justify-between">
                <div className="w-[47%]">
                  <label className="block uppercase text-gra-600 text-xs font-bold mb-2">
                    Nombre
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-gra-300 text-gra-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full mr-1 ease-linear transition-all duration-150"
                    placeholder="Nombre*"
                  />

                  {errors.name && (
                    <p className={errorClassName}>{errors.name}</p>
                  )}
                </div>
                <div className="w-[47%] mr-1">
                  <label className="block uppercase text-gra-600 text-xs font-bold mb-2">
                    Apellido
                  </label>

                  <input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className="border-0 px-3 py-3 placeholder-gra-300 text-gra-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ml-1 ease-linear transition-all duration-150"
                    placeholder="Apellido*"
                  />
                  {errors.surname && (
                    <p className={errorClassName}>{errors.surname}</p>
                  )}
                </div>
              </div>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-gra-600 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-gra-300 text-gra-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Contraseña*"
                />
              </div>
              {errors.password && (
                <p className={errorClassName}>{errors.password}</p>
              )}

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-gra-600 text-xs font-bold mb-2"
                  for="grid-password"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  className="border-0 px-3 py-3 placeholder-gra-300 text-gra-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Contraseña*"
                />
              </div>
              {errors.passwordConfirm && (
                <p className={errorClassName}>{errors.passwordConfirm}</p>
              )}
              <div></div>
              <div className="text-center mt-6">
                <button
                  className="bg-slate-800 text-white active:bg-gra-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 hover:text-blue-50 focus:outline-blue-300"
                  type="submit"
                >
                  Registrarse
                </button>
                <h6 className="text-gra-500 text-sm font-bold">
                  ¿Ya estás Registrado?
                </h6>
                <Link className={registerClassName} to="/login">
                  Iniciar sesión
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
