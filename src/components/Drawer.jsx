import { useEffect, useState } from "react";
import { lazy } from "react";
import classNames from "classnames";

const CategoriesParent = lazy(() => import("./CategoriesParent"));

//-translate-x-full
const Drawer = ({ categories, display }) => {
  const [style, setStyle] = useState(false);
  const drawerClassName = classNames(
    "top-0 left-0 z-40 h-screen p-4 pl-0 pr-0 overflow-y-auto bg-neutral-950 border-r border-neutral-900 overflow-y-scroll scrollbar-hide",
    style ? "fixed md:hidden " : "hidden "
  );
  const backgroundClassName = classNames(
    "w-full h-full z-30 top-0 left-0 bg-black bg-opacity-60",
    style ? "fixed md:hidden " : "hidden "
  );

  useEffect(() => {
    setTimeout(() => {
      setStyle(display);
    }, 200);
  }, [display]);

  return (
    <div className={backgroundClassName}>
      <div
        id="drawer-navigation"
        className={drawerClassName}
        tabIndex="-1"
        aria-labelledby="drawer-navigation-label"
      >
        <h1 className="pl-4  text-xl font-medium text-gray-50 mb-5 pr-10 tracking-widest font-inter">
          CATEGORIAS
        </h1>

        <CategoriesParent
          state={true}
          categoriesInput={categories}
          className="px-10"
        />
      </div>
    </div>
  );
};

export default Drawer;
