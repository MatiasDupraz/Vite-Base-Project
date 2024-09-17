import React, { useRef, useState, useEffect, lazy } from "react";
import classNames from "classnames";
import { useUser } from "../context/sessionContext";
import { useLocation, Link } from "react-router-dom";
import useTextCapitalize from "../hooks/text-capitalize";
import axios from "axios";

const Icon = lazy(() => import("./Icon"));
const Categories = lazy(() => import("./Categories"));
const SearchBar = lazy(() => import("./SearchBar"));
const Squash = lazy(() =>
  import("hamburger-react").then((module) => ({ default: module.Squash }))
);
const Drawer = lazy(() => import("./Drawer"));
const NavBar = ({ categories }) => {
  const { user } = useUser();
  let location = useLocation().pathname;
  let isInCart = location === "/cart";
  let isInOrders = location.includes("/order");
  const [name, setName] = useState("");
  const [mainCategories, setMainCategories] = useState([]);
  let finalName = useTextCapitalize(name);

  useEffect(() => {
    if (user) {
      setName(user.usuario_nombre);
    }
  }, [user]);

  const categoriesClassName = classNames(
    "px-3 text-gray-300 uppercase hover:text-white hover:drop-shadow-lg flex align-midle font-medium ease-linear transition-all duration-300 font-inter tracking-wider"
  );
  const cartClassName = classNames(
    isInCart
      ? "text-gray-200 pl-2"
      : "text-gray-400 hover:text-gray-200 pl-2 ease-linear transition-all duration-300"
  );
  const listClassName = classNames(
    isInOrders
      ? "text-gray-200 pl-2"
      : "text-gray-400 hover:text-gray-200 pl-2 ease-linear transition-all duration-300"
  );

  const userClassName = classNames(
    "border  py-1 px-2 rounded text-md  flex",
    user
      ? "text-gray-200 border-gray-600 hover:border-gray-200 ease-linear transition-all duration-300"
      : "text-gray-400 border-gray-600 hover:border-gray-200 hover:text-gray-200 ease-linear transition-all duration-300"
  );
  const buttonRef = useRef(null); //Ref created to handle when the user clicks inside or outside the button

  useEffect(() => {
    const fetchedMainCategories = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/mainCategory`);
        setMainCategories(response.data[0]);
      } catch (err) {
        console.error(`Error fetching user from database: ${err}`);
      }
    };
    fetchedMainCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setCategoryState(false);
      }
    };
    //Attach listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buttonRef]);

  const [categoryState, setCategoryState] = useState(false);

  const navBarClassName = classNames("fixed z-20 w-full  ");
  //Change the state of displaying the category dropdown to the oppposity
  const toggleState = (categoryState) => {
    setCategoryState((categoryState) => !categoryState);
  };
  return (
    <nav className={navBarClassName}>
      <div className="font-sans flex content-between justify-between text-left py-2 px-6 bg-neutral-950 items-end w-full ">
        <div className="pt-1">
          <a href="/">
            <img src="/img/sg1.webp" className="w-auto h-14" alt="Logo Mydis" />
          </a>
        </div>
        <SearchBar
          className="self-center w-1/3 hidden md:flex  bg-slate-950 bg-opacity-40 border border-gray-500   duration-200 transition-all text-white shadow-none  "
          buttonClassName={
            "bg-gray-800 border-0 text-gray-500 hover:bg-gray-500 hover:text-gray-700"
          }
        />
        <div className=" self-center flex">
          <Link to="/login">
            <div className={userClassName}>
              <Icon user disableHover className={"sm:pr-2 sm:pt-1"} />
              <p className="hidden sm:block">{user ? finalName : "Ingresar"}</p>
            </div>
          </Link>
          <div className="text-md no-underline">
            <div className=" sm:pt-1">
              <Link to="/cart">
                <Icon cart disableHover className={cartClassName} />
              </Link>
              <Link to="/orders">
                <Icon list disableHover className={listClassName} />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <button
          ref={buttonRef}
          className="hidden md:block bg-neutral-800 b-10 bg-opacity-50 hover:bg-opacity-80 focus:bg-opacity-100 text-gray-300 hover:text-white hover:bg-neutral-950 py-0.5 px-4 align-middle font-semibold  absolute  ease-linear transition-all duration-300 "
          onClick={() => toggleState()}
        >
          CATEGORIAS
        </button>

        <div className="flex md:block bg-neutral-950 md:h-8 w-full justify-around">
          <button
            onClick={() => toggleState()}
            className="md:hidden text-slate-200"
          >
            <Squash toggled={categoryState} />
          </button>
          <SearchBar
            className={
              "flex md:hidden self-center shadow-sm justify-center bg-gray-50 bg-opacity-20 text-gray-50 align-middle w-3/4 h-8"
            }
            buttonClassName={"text-gray-700"}
          />
          <div className="hidden lg:flex justify-center items-center font-semibold pt-1 pb-1 shadow shadow-black">
            {mainCategories &&
              mainCategories.map((category, index) => {
                return (
                  <Link
                    to={`/categories?c=${category.categoria_id}&p=1`}
                    key={index}
                  >
                    <h2 className={categoriesClassName}>
                      {category.categoria_desc}
                    </h2>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
      <Categories state={categoryState} categoriesInput={categories} />
      <Drawer categories={categories} display={categoryState} />
    </nav>
  );
};

export default NavBar;
