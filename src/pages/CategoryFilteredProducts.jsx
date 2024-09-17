import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import GridCardContainer from "../components/GridCardContainer";

const FilteredProducts = () => {
  window.scrollTo(0, 0);
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState([]);
  const location = useLocation();
  const categoryID = new URLSearchParams(location.search).get("c");
  const pageNumber = new URLSearchParams(location.search).get("p");
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (pageNumber > 0) {
        try {
          const response = await axios.get(
            `http://localhost:5000/categoryFilter?c=${categoryID}&p=${pageNumber}`
          );
          setProducts(response.data.products[0]);
          setPages(response.data.totalPages);
        } catch (error) {
          console.error("Error fetching filtered products:", error);
        }
      }
    };

    if (categoryID) {
      fetchFilteredProducts();
    }
  }, [categoryID, pageNumber]);

  // Render the GridCardContainer component with the filtered products
  if (products.length > 0) {
    return <GridCardContainer products={products} pages={pages} />;
  }
};

export default FilteredProducts;
