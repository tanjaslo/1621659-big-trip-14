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
import { createDestination } from './destination.js';

const createPoint = () => {
  const dateFrom = getRandomDate(dayjs(), dayjs().add(6, 'M'));
  const type = getRandomArrayElement(TYPES);

  return {
    id: nanoid(),
    basePrice: getRandomInteger(10, 1000),
    dateFrom,
    dateTo: getDateTo(dateFrom),
    destination: createDestination(),
    isFavourite: Boolean(getRandomInteger(0, 1)),
    offers: getRandomArray(optionsMap.get(type)),
    type,
  };
};

const renderPoints = (count) => {
  const points = new Array(count).fill().map(createPoint).sort(sortByDay);

  return points;
};

export { renderPoints };
