export const formatDate = (dateString) => {
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };

      const parsedDate = new Date(dateString);

      // Check if the parsed date is a valid date
      if (isNaN(parsedDate)) {
          return "-";
      }
  
      const formattedDate = parsedDate.toLocaleDateString(undefined, options);
  
      return formattedDate;
}