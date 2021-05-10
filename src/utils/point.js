import { getRandomArrayElement, getRandomInteger, shuffle } from '../utils/common.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SENTENCES } from '../data.js';

dayjs.extend(duration);
dayjs.duration(100);

const MIN_TITLE_LENGTH = 5;

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

export const getRoutePointsTitle = (points) => {
  const routeTitle = removeDuplPointsNames(points);
  const lastPoint = routeTitle.slice([routeTitle.length - 1]);

  if (routeTitle.length > MIN_TITLE_LENGTH) {
    return `${routeTitle.slice(0, MIN_TITLE_LENGTH - 1).join(' &mdash; ')}
     &mdash; . . . &mdash; ${lastPoint.join(' &mdash; ')}`;
  }
  return routeTitle.join(' &mdash; ');
};

const getAllPointsCost = (points) => {
  const allPointsCost = points.reduce((acc, point) => acc + point.basePrice, 0);

  return allPointsCost;
};

const getAllOffersCost = (points) => {
  const allOffersCost = points.reduce((pointsAcc, {offers}) => {
    pointsAcc += offers.reduce((offersAcc, offer) => {
      return offersAcc + offer.price;
    }, 0);
    return pointsAcc;
  }, 0);
  return allOffersCost;
};

export const getTotalPrice = (points) => {
  const totalPrice = getAllPointsCost(points) + getAllOffersCost(points);

  return totalPrice;
};

export const createPhotosArray = () => {
  const array = [];
  for (let i = 1; i < getRandomInteger(2, 10); i++) {
    const picture = {
      src: `http://picsum.photos/248/152?r=${(i)}`,
      description: getRandomArrayElement(SENTENCES),
    };
    array.push(picture);
  }
  return array;
};

export const getDescriptionFromSentences = (array) => {
  const copiedArray = array.slice();
  shuffle(copiedArray);

  const descriptionSentences = copiedArray.slice(0, getRandomInteger(1, 5));
  return descriptionSentences.join(' ');
};

const getPointDateFromToFormat = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);

  return date2.isAfter(date1, 'day') ? 'MM/D HH:mm' : 'HH:mm';
};

export const getRandomDate = (start, end) => {
  const randomDate = dayjs(dayjs(start) + Math.random() * (dayjs(end) - dayjs(start)));
  return dayjs(randomDate).format('YYYY-MM-DDTHH:mm');
};

export const getDateTo = (dateFrom) => {
  const minEventDuration = dayjs(dateFrom).add(10, 'm');
  const maxEventDuration = dayjs(dateFrom).add(36, 'h');
  return dayjs(getRandomInteger(minEventDuration, maxEventDuration)).format('YYYY-MM-DDTHH:mm');
};

export const getDuration = (dateFrom, dateTo) => {
  return new Date(dateTo) - new Date(dateFrom);
};

export const humanizeDateFromFormat = (dateFrom, dateTo) => {
  return dayjs(dateFrom).format(getPointDateFromToFormat(dateFrom, dateTo));
};

export const humanizeDateToFormat = (dateFrom, dateTo) => {
  return dayjs(dateTo).format(getPointDateFromToFormat(dateFrom, dateTo));
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

export const humanizeDurationFormat = (difference) => {
  const daysDiff = dayjs.duration(difference).days();
  const hoursDiff = dayjs.duration(difference).hours();
  const minutesDiff = dayjs.duration(difference).minutes();
  const days = String(daysDiff).padStart(2, '0');
  const hours = String(hoursDiff).padStart(2, '0');
  const minutes = String(minutesDiff).padStart(2, '0');

  if (daysDiff > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hoursDiff > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

export const getDateFormat = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getEventDateFormat = (date) => {
  return dayjs(date).format('MMM DD');
};

export const getFormDateFormat = (date) => {
  return dayjs(date).format('DD/MM/YY HH:mm');
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

export const sortByDay = (pointA, pointB) => {
  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
};

export const sortByPrice = (pointA, pointB) => {
  return pointB.basePrice - pointA.basePrice;
};

export const sortByTime = (pointA, pointB) => {
  const timeA = getDuration(pointA.dateFrom, pointA.dateTo);
  const timeB = getDuration(pointB.dateFrom, pointB.dateTo);

  return timeB - timeA;
};

export const areDatesEqual = (dateA, dateB) => {
  return (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB, 'D');
};


