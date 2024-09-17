import { useEffect, useState } from "react";
import classNames from "classnames";
import axios from "axios";

const Icon = lazy(() => import("./Icon"));

const Categories = ({ state, categoriesInput }) => {
  const [categories, setCategories] = useState([]);

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

  const finalClassName = classNames(
    "bg-neutral-800 md:text-base text-neutral-200 w-36 md:w-56 z-30 font-inter overflow-y-scroll scrollbar-hide max-h-screen",
    styleState ? "hidden  md:block" : "hidden"
  );
  const organizeCategories = (categories) => {
    const organized = {};

    // Organize categories into a tree-like structure
    categories.forEach((category) => {
      if (!organized[category.categoria_padre_id]) {
        organized[category.categoria_padre_id] = [];
      }
      organized[category.categoria_padre_id].push(category);
    });

    return organized;
  };

  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (categoryID) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [categoryID]: !prevState[categoryID],
    }));
  };

  const renderCategory = (category) => {
    const isLastCategory = !organizedCategories[category.categoria_id];
    category.link = () => (
      <Link
        to={`/categories?c=${category.categoria_id}&p=1`}
        key={category.categoria_id}
        className="cursor-pointer py-1.5 px-3"
      >
        {category.categoria_web_desc}
      </Link>
    );
    return (
      <div
        className="flex hover:bg-neutral-700"
        key={category.categoria_id}
        onMouseEnter={() => toggleCategory(category.categoria_id)}
        onMouseLeave={() => toggleCategory(category.categoria_id)}
      >
        <p className="py-1 pl-1 hover:text-white">
          <Icon rightArrowSimple /> {category.link()}
        </p>

        {expandedCategories[category.categoria_id] && !isLastCategory && (
          <div className="bg-neutral-800 text-base w-36 ml-36 md:w-56 md:ml-56 absolute">
            {organizedCategories[category.categoria_id].map((subCategory) =>
              renderCategory(subCategory)
            )}
          </div>
        )}
      </div>
    );
  };

  const organizedCategories = organizeCategories(categories);

  return (
    <div className={finalClassName}>
      {organizedCategories[null] &&
        organizedCategories[null].map((rootCategory) =>
          renderCategory(rootCategory)
        )}
    </div>
  );
};

export default Categories;
