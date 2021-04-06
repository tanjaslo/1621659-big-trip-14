import { optionsMap,
  getDateFrom,
  getDateTo,
  getDescription,
  DESTINATIONS,
  PICTURES,
  TYPES } from '../data.js';
import { getRandomInteger,
  getRandomArrayElement,
  getRandomArray } from '../util.js';

const createPoint = () => {

  const dateFrom = getDateFrom();
  const type = getRandomArrayElement(TYPES);

  return {
    basePrice: getRandomInteger(10, 1000),
    dateFrom: dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: {
      description: getDescription(),
      name: getRandomArrayElement(DESTINATIONS),
      pictures: getRandomArray(PICTURES),
    },
    isFavourite: Boolean(getRandomInteger(0, 1)),
    offers: optionsMap.get(type),
    type: type,
  };
};

export { createPoint };
