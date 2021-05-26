export const uppercaseFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isArrayEmpty = (array) => {
  return array.length !== 0;
};

export const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

export const isOnline = () => {
  return window.navigator.onLine;
};
