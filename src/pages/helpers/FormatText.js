export const truncateUrl = (url, maxLength) => {
  return url.length > maxLength ? url.substr(0, maxLength) + "..." : url;
};
