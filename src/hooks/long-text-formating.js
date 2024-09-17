function useTextFormating(text, maxLength) {
  let finalText;
  if (text) {
    if (text.length > maxLength) {
      finalText = text.slice(0, maxLength) + "...";
    } else {
      finalText = text;
    }
    return finalText;
  }
}

export default useTextFormating;
