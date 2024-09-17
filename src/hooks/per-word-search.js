function useSearchingPerWord({ text, products }) {
  //Separates all the words in the search text, and saves them in an array
  const words = text.spli(" ");
  products.map((product) => {
    //for each product, it analyzes if the description includes every of the given words
    words.forEach((word) => {
      //if a word is not included, the product won't be returned
      if (!product.attributes.includes(word)) return [];
    });
    //the product is returned if contains all the words
    return product;
  });
}

export default useSearchingPerWord;
