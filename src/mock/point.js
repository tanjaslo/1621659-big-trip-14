import dayjs from 'dayjs';
import {
  optionsMap,
  DESTINATIONS,
  PICTURES,
  SENTENCES,
  TYPES } from '../data.js';
import { getRandomInteger,
  getRandomArrayElement,
  getRandomArray,
  getDateFrom,
  getDateTo,
  getDescriptionFromSentences } from '../util.js';

const createPoint = () => {
  const dateFrom = getDateFrom();
  const type = getRandomArrayElement(TYPES);

  return {
    basePrice: getRandomInteger(10, 1000),
    dateFrom: dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: {
      description: getDescriptionFromSentences(SENTENCES),
      name: getRandomArrayElement(DESTINATIONS),
      pictures: getRandomArray(PICTURES),
    },
    isFavourite: Boolean(getRandomInteger(0, 1)),
    offers: optionsMap.get(type),
    type: type,
  };
};

const renderPoints = (count) => {
  const points = new Array(count).fill().map(createPoint).slice().sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom));

  return points;
};

export { renderPoints };
