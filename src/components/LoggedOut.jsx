import { lazy } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";

const Icon = lazy(() => import("./Icon"));

const LoggedOut = () => {
  const noProductClassName = classNames("block pt-[250px] mb-64");
  window.scrollTo(0, 0);
  return (
    <React.Fragment>
      <div className="bg-neutral-100 h-full w-full fixed -z-10"></div>
      <div className={noProductClassName}>
        <div className="flex justify-center mb-5">
          <Icon user className="text-6xl text-neutral-400" />
        </div>
        <h1 className="text-center text-xl">
          No se accedió con ninguna cuenta
        </h1>
        <h2 className="text-center text-md text-neutral-600">
          Inicie sesión para continuar
        </h2>
        <div className="w-full flex justify-center mt-10">
          <Link to="/login">
            <button className="w-60 px-6 py-3 text-center bg-slate-800 text-white  border border-transparent text-sm font-bold uppercase transition-all duration-15 hover:shadow-lg hover:text-blue-50 rounded shadow  outline-none focus:outline-none ease-linear focus:outline-blue-300">
              Iniciar sesión
            </button>
          </Link>
        </div>
      </div>
    </React.Fragment>
  );
};
export default LoggedOut;
