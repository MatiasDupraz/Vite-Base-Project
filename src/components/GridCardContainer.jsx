import classNames from "classnames";
import { useNavigate, useLocation } from "react-router-dom";

const ProductCard = lazy(() => import("./ProductCard"));
//This component receives a list of product objects, asigns a card to each product, and creates a grid to display them

const GridCardContainer = ({ products, pages, className, cardClassName }) => {
  let location = useLocation();
  const navigate = useNavigate();
  let pageNumber = new URLSearchParams(location.search).get("p");
  pageNumber = parseInt(pageNumber);
  const changePage = (newPage) => {
    const urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.set("p", newPage);
    const newSearchParamsString = urlSearchParams.toString();
    const newUrl = `${location.pathname}?${newSearchParamsString}`;
    navigate(newUrl);
  };
  let finalClassName = classNames(
    className,
    "flex justify-center pt-[182px] md:pt-[168px] items-center w-full"
  );
  let finalCardClassName = classNames(
    cardClassName,
    "max-w-[80%] max-h-[90%] self-center mx-16 mx-4"
  );

  const handlePrevious = () => {
    if (pageNumber > 1) {
      changePage(pageNumber - 1);
    }
  };
  const handleNext = () => {
    if (pageNumber < pages) {
      changePage(pageNumber + 1);
    }
  };

  let shownProducts = products.map((product, index) => {
    return (
      <ProductCard
        key={index}
        title={product.public_titulo}
        price={product.venta_1_prec}
        images={`/img/prod/${product.archivo_nom}`}
        category={product.categoria_id}
        className={finalCardClassName}
        ID={product.producto_id}
      />
    );
  });

  const pagination = (pagesQuant) => {
    const pageButtons = () => {
      const buttons = [];
      for (let i = 0; i < parseInt(pagesQuant); i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => changePage(i + 1)}
            className={classNames(
              "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700  border  hover:bg-blue-200 cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10",
              i + 1 === pageNumber ? "bg-blue-100" : "bg-white"
            )}
          >
            {i + 1}
          </button>
        );
      }
      return buttons;
    };
    return (
      <div className="max-w-full md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto mt-10 col-span-9 mb-10">
        <div className="flex justify-center">
          <nav className="flex space-x-2" aria-label="Pagination">
            <a
              onClick={() => handlePrevious()}
              className="relative inline-flex items-center px-4 py-2 text-sm bg-neutral-950 border border-white hover:border-transparent hover:bg-neutral-700 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 select-none"
            >
              Anterior
            </a>
            {pageButtons()}
            <a
              onClick={() => {
                handleNext();
              }}
              className="relative inline-flex items-center px-4 py-2 text-sm bg-neutral-950 border border-white hover:border-transparent hover:bg-neutral-700 text-white font-semibold cursor-pointer leading-5 rounded-md transition duration-150 ease-in-out focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 select-none"
            >
              Siguiente
            </a>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className={finalClassName}>
      <div className="grid md:grid-cols-9 items-center w-full ">
        <div className="hidden lg:block md:col-span-1 "></div>
        <div className="col-span-8 col-start-0 lg:col-span-7  grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mx-auto mb-10 md:mb-0">
          {shownProducts}
        </div>
        {pagination(pages)}
        <div className="hidden lg:block md:col-span-1 "></div>
      </div>
    </div>
  );
};

export default GridCardContainer;
