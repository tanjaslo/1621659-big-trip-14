import dayjs from 'dayjs';
import {
  optionsMap,
  DESTINATIONS,
  SENTENCES,
  TYPES } from '../data.js';
import { getRandomInteger,
  getRandomArrayElement,
  getRandomDate,
  getDateTo,
  createPhotosArray,
  getDescriptionFromSentences } from '../util.js';

const createPoint = () => {
  const dateFrom = getRandomDate(dayjs(), dayjs().add(6, 'M'));
  const type = getRandomArrayElement(TYPES);

  return {
    basePrice: getRandomInteger(10, 1000),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: {
      description: getDescriptionFromSentences(SENTENCES),
      name: getRandomArrayElement(DESTINATIONS),
      pictures: createPhotosArray(),
    },
    isFavourite: Boolean(getRandomInteger(0, 1)),
    offers: optionsMap.get(type),
    type,
  };
};

const renderPoints = (count) => {
  const points = new Array(count).fill().map(createPoint).sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));

  return points;
};

export { renderPoints };
