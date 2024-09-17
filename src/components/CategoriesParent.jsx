import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import classNames from "classnames";
import axios from "axios";

const CategoriesParent = ({ state, categoriesInput, className }) => {
  const [categories, setCategories] = useState([]);

  const finalClassName = classNames(
    "cursor-pointer block py-1 pl-4 text-gray-400 border-y border-transparent hover:bg-neutral-700 hover:text-gray-100 font-normal text-lg ease-linear transition-all duration-300 font-inter tracking-wider",
    className
  );

  useEffect(() => {
    axios
      .get("http://localhost:5000/categories")
      .then((response) => {
        setCategories(response.data[0]);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (categoriesInput.length > 0) {
      setCategories(categoriesInput);
    }
  }, [categoriesInput, categories]);

  const [styleState, setStyleState] = useState(state);

  useEffect(() => {
    setTimeout(() => {
      setStyleState(state);
    }, 200);
  }, [state]);

  const renderCategory = (category) => {
    if (!category.categoria_padre_id) {
      return (
        <Link
          to={`/categories?c=${category.categoria_id}&p=1`}
          key={category.categoria_id}
          className={finalClassName}
        >
          {category.categoria_web_desc}
        </Link>
      );
    }
  };

  return categories.map((rootCategory) => renderCategory(rootCategory));
};

export default CategoriesParent;
