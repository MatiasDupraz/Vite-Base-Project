import React from "react";
import Icon from "./Icon";

const Footer = () => {
  return (
    <div className="flex items-end w-full min-h-screen">
      <footer className="w-full text-gray-700 bg-neutral-950 body-font">
        <div className="container flex flex-col flex-wrap px-5 py-14 mx-auto md:items-center lg:items-start md:flex-row md:flex-no-wrap">
          <div className="flex-shrink-0 w-64 mx-auto text-center md:mx-0 md:text-left">
            <a
              className="flex items-center justify-center font-medium text-gray-900 title-font md:justify-start"
              href="/"
            >
              <img src="/img/sg1.webp" className="h-14" alt="MYDIS LOGO" />
            </a>

            <div className="flex items-center justify-center sm:ml-auto mt-4">
              <a href="https://www.instagram.com/mydis_informatica/?hl=es-la">
                <Icon
                  instagram
                  disableHover
                  className={
                    "text-gray-300 text-2xl mx-2 ease-linear transition-all duration-300 hover:text-gray-50"
                  }
                />
              </a>
              <a href="https://www.facebook.com/INFORMATICAMYDIS/?locale=es_LA">
                <Icon
                  facebook
                  disableHover
                  className={
                    "text-gray-300 text-xl mx-2 ease-linear transition-all duration-300 hover:text-gray-50"
                  }
                />
              </a>
              <a href="https://walink.co/a88d79">
                <Icon
                  whatsapp
                  disableHover
                  className={
                    "text-gray-300 text-2xl mx-2 ease-linear transition-all duration-300 hover:text-gray-50"
                  }
                />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap flex-grow mt-10 -mb-10 text-center md:pl-20 md:mt-0 md:text-left">
            <div className="w-full px-4 lg:w-1/4 md:w-1/2">
              <nav className="mb-10 list-none">
                <li className="mt-3">
                  <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-100 uppercase title-font">
                    Horarios Atención
                  </h2>
                  <p className="text-gray-300">Lunes a Viernes.</p>
                  <p className="text-gray-300">08:30 - 13:00, 15:30 - 20:00</p>
                  <p className="text-gray-300">Sábado.</p>
                  <p className="text-gray-300">08:30 - 13:00, 16:00 - 20:00</p>
                </li>
              </nav>
            </div>
            <div className="w-full px-4 lg:w-1/4 md:w-1/2">
              <nav className="mb-10 list-none">
                <li className="mt-3">
                  <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-100 uppercase title-font">
                    Encontranos en
                  </h2>
                  <p className="text-gray-300">
                    Alvear 399 (Esquina Tucumán), Villa María. Córdoba
                  </p>
                  <a
                    href="https://maps.app.goo.gl/obL1ZULvzmtMUs1V6"
                    className="pt-2"
                  >
                    <p className="text-blue-200 underline cursor-pointer mt-6">
                      <Icon map className={"mr-2 text-red-500"} />
                      Cómo llegar
                    </p>
                  </a>
                </li>
              </nav>
            </div>
            <div className="w-full text-center flex justify-center md:block md:text-left md:pl-14 lg:w-1/4 md:w-1/2">
              <nav className="mb-10 list-none">
                <div className="mt-3">
                  <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-100 uppercase title-font">
                    Teléfonos de contacto
                  </h2>
                  <div className="mb-2 ">
                    <p className="text-gray-100 cursor-pointer flex uppercase text-sm title-font justify-center md:justify-start">
                      Ventas
                    </p>
                    <p className="text-gray-300 cursor-pointer flex md:pl-3 pt-1 justify-center md:justify-start">
                      <Icon whatsapp className={"text-xl pr-1 pt-0.5"} />{" "}
                      <a href="tel:+543534175020">+54 353 4175020</a>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-100 cursor-pointer flex uppercase text-sm title-font justify-center md:justify-start">
                      Servicio Técnico
                    </p>
                    <p className="text-gray-300 cursor-pointer flex md:pl-3 pt-1 justify-center md:justify-start">
                      <Icon whatsapp className={"text-xl pr-1 pt-0.5"} />
                      <a href="tel:+543535697407">+54 353 5697407</a>
                    </p>
                  </div>
                </div>
              </nav>
            </div>

            <div className="w-full md:pl-14 lg:w-1/4 md:w-1/2">
              <nav className="mb-10 list-none">
                <div className="mt-3 ">
                  <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-100 uppercase title-font ">
                    Atención Al Cliente
                  </h2>
                  <li className="hover:animate-pulse ">
                    <a
                      className="text-gray-300 cursor-pointer hover:text-gray-200 flex justify-center md:justify-start"
                      href="tel:+543534175020"
                    >
                      <div className="items-center pl-2 justify-center bg-gray-200 flex rounded-full w-7 h-7 mr-2">
                        <Icon
                          phone
                          disableHover
                          className={"text-neutral-900 pr-2"}
                        />
                      </div>
                      Llamanos
                    </a>
                  </li>
                </div>
                <li className="mt-3 hover:animate-pulse">
                  <a
                    className="text-gray-300 cursor-pointer hover:text-gray-200 flex justify-center md:justify-start"
                    href="https://walink.co/a88d79"
                  >
                    <div className="items-center pl-2 justify-center bg-gray-200 flex rounded-full w-7 h-7 mr-2">
                      <Icon
                        whatsapp
                        disableHover
                        className={"text-neutral-900 pr-2"}
                      />
                    </div>
                    Whatsapp
                  </a>
                </li>
                <li className="mt-3 hover:animate-pulse">
                  <a
                    className="text-gray-300 cursor-pointer hover:text-gray-200 flex justify-center md:justify-start"
                    href="mailto:ventas@mydis.com.ar"
                  >
                    <div className="items-center pl-2 justify-center bg-gray-200 flex rounded-full w-7 h-7 mr-2">
                      <Icon
                        mail
                        disableHover
                        className={"text-neutral-900 pr-2"}
                      />
                    </div>
                    <p>Correo</p>
                  </a>
                </li>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
