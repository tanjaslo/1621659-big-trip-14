import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {
  optionsMap,
  TYPES } from '../data.js';
import { getRandomInteger,
  getRandomArray,
  getRandomArrayElement } from '../utils/common.js';
import {
  getRandomDate,
  getDateTo,
  sortByDay } from '../utils/point.js';

const createPoint = (destination) => {
  const dateFrom = getRandomDate(dayjs().add(-20, 'd'), dayjs().add(6, 'M'));
  const type = getRandomArrayElement(TYPES);

  return {
    id: nanoid(),
    basePrice: getRandomInteger(10, 1000),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination,
    isFavourite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomArray(optionsMap.get(type)),
    type,
  };
};

const renderPoints = (count, destinations) => {
  const points = new Array(count).fill().
    map(
      () => {
        return createPoint(destinations[getRandomInteger(0, destinations.length - 1)]);
      })
    .sort(sortByDay);

  return points;
};

export { renderPoints };
