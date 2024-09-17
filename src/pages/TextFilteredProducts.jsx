import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import GridCardContainer from "../components/GridCardContainer";

const FilteredProducts = () => {
  window.scrollTo(0, 0);
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState([]);
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get("q");
  const pageNumber = new URLSearchParams(location.search).get("p");
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/textSearch?q=${searchQuery}&p=${pageNumber}`
        );
        setProducts(response.data.products[0]);
        setPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    if (searchQuery) {
      fetchFilteredProducts();
    }
  }, [searchQuery, pageNumber]);

  // Render the GridCardContainer component with the filtered products
  if (products.length > 0) {
    let orderedProducts = new Map();
    let orderedImages = new Map();
    products.forEach((product) => {
      if (!orderedProducts.has(product.producto_id)) {
        orderedProducts.set(product.producto_id, product);
      }
      const { producto_id, archivo_nom } = product;
      if (orderedImages.has(producto_id)) {
        orderedImages.get(producto_id).push(`/img/prod/${archivo_nom}`);
      } else {
        orderedImages.set(producto_id, [`/img/prod/${archivo_nom}`]);
      }
    });

    // Create an array to store the final result
    let finalProducts = [];

    // Iterate over the orderedProducts map
    orderedProducts.forEach((product, producto_id) => {
      // Create a new object for each product
      let productObj = {
        ...product,
        product_images: orderedImages.get(producto_id),
      };
      // Push the object to the result array
      finalProducts.push(productObj);
    });

    return <GridCardContainer products={finalProducts} pages={pages} />;
  }
};

export default FilteredProducts;
