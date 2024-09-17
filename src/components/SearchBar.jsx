import { useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { lazy } from "react";

const Icon = lazy(() => import("./Icon"));

const SearchBar = ({ className, buttonClassName, ...props }) => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const finalClassName = classNames(
    "rounded-md justify-end shadow-lg shadow-neutral-700 flex",
    className
  );
  const finalButtonClassName = classNames(
    buttonClassName,
    "border bg-gray-200 border-gray-300 rounded-r-md hover:bg-gray-300   hover:text-neutral-800"
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim() !== "") {
      navigate(`/search?q=${searchValue}&p=1`); // Redirect to search page with query parameters
    }
  };

  const handleChangeSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <form {...props} className={finalClassName} onSubmit={handleSubmit}>
      <input
        className="bg-transparent border-transparent w-full px-2 pr-10 rounded-md rounded-r-none focus:border-sky-600 -mr-12"
        placeholder={"Encontrá lo que necesitás acá"}
        value={searchValue}
        onChange={handleChangeSearchValue}
      />
      <button className={finalButtonClassName}>
        <Icon className={"py-2 px-4 ml"} disableHover search />
      </button>
    </form>
  );
};

export default SearchBar;
