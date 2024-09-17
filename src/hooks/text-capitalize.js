function useTextCapitalize(text) {
  let finalText = text;
  finalText = finalText.toLowerCase();
  finalText = finalText.charAt(0).toUpperCase() + finalText.slice(1);
  return finalText;
}

export default useTextCapitalize;
