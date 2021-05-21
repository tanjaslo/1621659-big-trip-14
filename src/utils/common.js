export const firstLetterCaps = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isArrayEmpty = (array) => {
  return array.length === 0 ? false : true;
  // или return !array.length;
};

export const getSortedItems = (items) => {
  return items.sort((a, b) => b - a);
};

export const isOnline = () => {
  return window.navigator.onLine;
};
