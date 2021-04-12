import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);
dayjs.duration(100);

const MIN_TITLE_LENGTH = 5;

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

// Принцип работы прост:
// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2

  return newElement.firstChild; // 3
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

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
    array.push({
      src: `http://picsum.photos/248/152?r=${(i)}`,
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

const getPointDateFromToFormat = (dateFrom, dateTo) => {
  const date1 = dayjs(dateFrom);
  const date2 = dayjs(dateTo);

  return date2.isAfter(date1, 'day') ? 'MM/D HH:mm' : 'HH:mm';
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

export const humanizeDurationFormat = (dateFrom, dateTo) => {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom));
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

export const firstLetterCaps = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
