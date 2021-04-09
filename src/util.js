import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.duration(100);

const MAX_MONTHS_GAP = 6;
const MIN_DAYS_GAP = -10;
const MAX_DAYS_GAP = 7;
const MIN_DAYSTO_GAP = 1;
const HOURS_GAP = 24;
const MIN_MINUTES_GAP = 10;
const MAX_MINUTES_GAP = 60;
const MIN_TITLE_LENGTH = 5;

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

const removeDuplPointsNames = (points) => {
  const unduplicatedPointsNames = [points[0].destination.name];

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i].destination.name;
    const next = points[i + 1].destination.name;

    if (next !== current) {
      unduplicatedPointsNames.push(next);
    }
  }
  return unduplicatedPointsNames;
};

export const getSortedRoutePointsTitle = (points) => {
  const routeTitle = removeDuplPointsNames(points);
  const lastPoint = routeTitle.slice([routeTitle.length - 1]);

  if (routeTitle.length > MIN_TITLE_LENGTH) {
    return `${routeTitle.slice(0, MIN_TITLE_LENGTH - 1).join(' &mdash; ')}
     &mdash; . . . &mdash; ${lastPoint.join(' &mdash; ')}`;
  }
  return routeTitle.join(' &mdash; ');
};

const getAllPointsCost = (points) => {
  const allPointsCost = points.reduce((acc, point) => {
    return acc + point.basePrice;}, 0);

  return allPointsCost;
};

const getAllOffersCost = (points) => {
  let allOffersCost = 0;

  points.forEach((point) => {
    point.offers.forEach((offer) => {
      allOffersCost = allOffersCost + offer.price;
    });
  });
  return allOffersCost;
};

export const getTotalPrice = (points) => {
  const totalPrice = getAllPointsCost(points) + getAllOffersCost(points);

  return totalPrice;
};

export const createPhotosArray = () => {
  const array = [];
  for (let i = 1; i < getRandomInteger(2, 10); i++) {
    array.push({
      src: `http://picsum.photos/248/152?r=${getRandomInteger(i, i++)}`,
    });
  }
  return array;
};

export const getDescriptionFromSentences = (array) => {
  const copiedArray = array.slice();
  shuffle(copiedArray);

  const descriptionSentences = copiedArray.slice(0, getRandomInteger(1, 5));
  return descriptionSentences.join(' ');
};

export const getDuration = (dateFrom, dateTo) => {
  return new Date(dateTo) - new Date(dateFrom);
};

export const getPointDateFromToFormat = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);
  const difference = date2.diff(date1, 'day');

  return difference >= 1 ? 'MM/D HH:mm' : 'HH:mm';
};

export const getDateFrom = () => {
  const dateFrom = dayjs()
    .add(getRandomInteger(0, MAX_MONTHS_GAP), 'M')
    .add(getRandomInteger(MIN_DAYS_GAP, MAX_DAYS_GAP), 'd')
    .add(getRandomInteger(0, HOURS_GAP), 'h')
    .add(getRandomInteger(0, MAX_MINUTES_GAP), 'm')
    .format('YYYY-MM-DDTHH:mm');

  return dateFrom;
};

export const getDateTo = (dateFrom) => {
  const dateTo = dayjs(dateFrom)
    .add(getRandomInteger(0, MIN_DAYSTO_GAP), 'd')
    .add(getRandomInteger(0, HOURS_GAP), 'h')
    .add(getRandomInteger(MIN_MINUTES_GAP, MAX_MINUTES_GAP), 'm')
    .format('YYYY-MM-DDTHH:mm');

  return dateTo;
};

export const getTripDates = (points) => {
  const firstPoint = points[0];
  const lastIndex = points.length - 1;
  const lastPoint = points[lastIndex];
  const startingMonth = dayjs(firstPoint.dateFrom).month();
  const endingMonth = dayjs(lastPoint.dateTo).month();
  const start = getEventDateFormat(firstPoint.dateFrom);
  const end = startingMonth === endingMonth ? getDayFormat(lastPoint.dateTo) : getEventDateFormat(lastPoint.dateTo);

  return `${start} &mdash; ${end}`;
};

export const humanizeDurationFormat = (dateFrom, dateTo) => {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom));
  const daysDiff = dayjs.duration(difference).days();
  const hoursDiff = dayjs.duration(difference).hours();
  const minutesDiff = dayjs.duration(difference).minutes();

  if (daysDiff > 0) {
    return `${daysDiff}D ${hoursDiff}H ${minutesDiff}M`;
  } else if (daysDiff === 0 && hoursDiff !== 0) {
    return `${hoursDiff}H ${minutesDiff}M`;
  }
  return `${minutesDiff}M`;
};

export const getDateFormat = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getEventDateFormat = (date) => {
  return dayjs(date).format('MMM DD');
};

export const getFormDateFormat = (date) => {
  return dayjs(date).format('YY/MM/DD HH:mm');
};

export const getDayFormat = (date) => {
  return dayjs(date).format('DD');
};

export const isFutureEvent = (point) => {
  return dayjs(point.dateFrom).isAfter(dayjs(), 'd') || dayjs(point.dateFrom).isSame(dayjs(), 'D');
};

export const isExpiredEvent = (point) => {
  return dayjs(point.dateTo).isBefore(dayjs(), 'd');
};
