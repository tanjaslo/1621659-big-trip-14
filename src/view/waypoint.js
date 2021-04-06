import dayjs from 'dayjs';
import { getFromToFormat,
  getDateFormat,
  getEventDateFormat,
  getDuration,
  millisecondsToTime } from '../util.js';

const createOffersList = (offers) => {
  if (offers.length !== 0) {
    const OffersList = offers.map((offer) =>
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </li>`).join('');

    return OffersList;
  }
  return '';
};

const createWaypointsTemplate = (point) => {

  const {basePrice, destination, dateFrom, dateTo, isFavourite, offers, type} = point;

  const duration = getDuration(dateFrom, dateTo);

  const humanizeTimeFormat = (date) => {
    return dayjs(date).format(getFromToFormat(dateFrom, dateTo));
  };

  const favouriteClassName = isFavourite
    ? 'event__favorite-btn event__favorite-btn--active'
    : 'event__favorite-btn';

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${getDateFormat(dateFrom)}">${getEventDateFormat(dateFrom)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${humanizeTimeFormat(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${humanizeTimeFormat(dateTo)}</time>
        </p>
          <p class="event__duration">${millisecondsToTime(duration)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${createOffersList(offers)}
      </ul>
      <button class="${favouriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export { createWaypointsTemplate };
