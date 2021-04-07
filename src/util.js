import dayjs from 'dayjs';

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

// Тасование Фишера — Йетса https://learn.javascript.ru/task/shuffle
export const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export const getRandomArray = (array) => {
  const arrayList = [];
  array.forEach((element) => {
    if (Math.random() > 0.5) {
      return;
    }
    arrayList.push(element);
  });
  return arrayList;
};

export const getSortedRoutePointsTitle = (points) => {
  const sortedPoints = [points[0].destination.name];

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i].destination.name;
    const next = points[i + 1].destination.name;

    if (next !== current) {
      sortedPoints.push(next);
    }
  }
  if (sortedPoints.length > MIN_TITLE_LENGTH) {
    return sortedPoints.slice(0, MIN_TITLE_LENGTH - 1).join(' &mdash; ') + ' &mdash; . . . &mdash; ' + sortedPoints.slice([sortedPoints.length - 1]).join(' &mdash; ');
  }
  return sortedPoints.join(' &mdash; ');
};

export const getTotalPrice = (points) => {
  let totalPrice = 0;
  const reducer = (accumulator, currentValue) => accumulator + currentValue;

  points.forEach((point) => {
    totalPrice = totalPrice + point.offers.map((offer) => offer.price).reduce(reducer, point.basePrice);
  });

  return totalPrice;
};

export const getDescriptionFromSentences = (array) => {
  const newArray = array.slice();
  const description = [];
  shuffle(newArray);

  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    description.push(newArray[i]);
  }
  return description.join(' ');
};

export const getDuration = (dateFrom, dateTo) => {
  const startTime = new Date(dateFrom).getTime();
  const endTime = new Date(dateTo).getTime();
  const duration = endTime - startTime;
  return duration;
};

export const humanizeDurationFormat = (duration) => {
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  let days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 30);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  days = (days < 10) ? '0' + days : days;

  if (days !== '00') {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (days === '00' && hours !== '00') {
    return `${hours}H ${minutes}M`;
  } else {
    return `${minutes}M`;
  }
};

export const getPointDateFromToFormat = (dateFrom, dateTo) => {
  dateFrom = new Date(dateFrom).getDate();
  dateTo = new Date(dateTo).getDate();

  if (dateTo - dateFrom >= 1) {
    return 'MM/D HH:mm';
  } else {
    return 'HH:mm';
  }
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

  if (startingMonth === endingMonth) {
    return `${getEventDateFormat(firstPoint.dateFrom)} &mdash; ${getDayFormat(lastPoint.dateTo)}`;
  }
  return `${getEventDateFormat(firstPoint.dateFrom)} &mdash; ${getEventDateFormat(lastPoint.dateTo)}`;
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
