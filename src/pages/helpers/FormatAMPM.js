export const formatTicketDate = (createdAt) => {
    const createdAtDate = new Date(createdAt);
    const formattedDate = `${String(createdAtDate.getDate()).padStart(2, "0")}/${String(
      createdAtDate.getMonth() + 1
    ).padStart(2, "0")}/${createdAtDate.getFullYear()} ${formatAMPM(
      createdAtDate
    )}`;
    return formattedDate;
  };


export const formatAMPM = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};
