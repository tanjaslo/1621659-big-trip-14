export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomArrayElement = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const getRandomArray = (array) => {
  return array.filter(() => Math.random() < 0.5);
};

// Тасование Фишера — Йетса https://learn.javascript.ru/task/shuffle
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const firstLetterCaps = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};