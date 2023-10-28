export const formatCurrency = (amount) => {
    const numericAmount = parseFloat(amount);
    return numericAmount
      .toLocaleString("en-US", {
        style: "currency",
        currency: "USD", 
        minimumFractionDigits: 0,
      })
      .replace(/^./, "");
  };