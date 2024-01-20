export function capitalizeWord(str) {
  return `${str[0].toUpperCase()}${str.slice(1)}`;
}

export function formatPrice(price) {
  // Check if the price is a valid number
  if (isNaN(price)) {
    console.error("Invalid price. Must be a number.");
    return null;
  }

  // Format the price using Intl.NumberFormat with VND currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 3,
  }).format(price);

  return formattedPrice;
}

export function convertPriceToNumber(priceString) {
  // Remove commas and dots from the currency string
  const numberString = priceString.replace(/[,.]/g, "");

  // Parse the result as a float or integer
  const numberValue = parseFloat(numberString);

  return numberValue;
}
