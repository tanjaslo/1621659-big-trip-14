import dayjs from 'dayjs';

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

export const getDuration = (dateFrom, dateTo) => {
  const startTime = new Date(dateFrom).getTime();
  const endTime = new Date(dateTo).getTime();
  const duration = endTime - startTime;
  return duration;
};

export const millisecondsToTime = (duration) => {
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

export const getFromToFormat = (dateFrom, dateTo) => {
  dateFrom = new Date(dateFrom).getDate();
  dateTo = new Date(dateTo).getDate();

  if (dateTo - dateFrom >= 1) {
    return 'MM/D HH:mm';
  } else {
    return 'HH:mm';
  }
};

export const getDateFormat = (date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const getEventDateFormat = (date) => {
  return dayjs(date).format('MMM D');
};

export const getFormDateFormat = (date) => {
  return dayjs(date).format('YY/MM/DD HH:mm');
};

export const getMonthFormat = (date) => {
  return dayjs(date).format('MMM');
};

export const getDayFormat = (date) => {
  return dayjs(date).format('DD');
};
