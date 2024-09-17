function usePriceFormating(price) {
    const format = { style: 'decimal', useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: 0 };
	const formatedNumber = '$ '+ (parseInt(price)).toLocaleString('es', format);
    return formatedNumber
}
export default usePriceFormating