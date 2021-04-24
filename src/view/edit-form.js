import { firstLetterCaps, isArrayEmpty } from '../utils/common.js';
import { getFormDateFormat } from '../utils/point.js';
import { DESTINATIONS, optionsMap } from '../data.js';
import SmartView from './smart.js';

const createEventTypesListTemplate = (currentType) => {
  const arr = Array.from(optionsMap.keys());
  const eventTypesList = arr.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${firstLetterCaps(type)}</label>
    </div>`).join('');

  return eventTypesList;
};

const createDestinationsListTemplate = () => {
  return DESTINATIONS.map((destination) => {
    return `<option value="${destination}"></option>`;
  }).join('');
};

const createOffersList = ({type, offers}) => {
  const availableOffers = optionsMap.get(type);

  const offersList = availableOffers.map((option) => {
    const {title, price, id} = option;
    const isOfferSelected = offers ? offers.some((offer) => offer.id === id) : false;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}" ${isOfferSelected ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${type}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
      </div>`;
  }).join('');

  return offersList;
};

const createPicturesList = (destination) => {
  const picturesList = destination.pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join('');

  return picturesList;
};

const createEditFormTemplate = (data) => {
  const {basePrice, destination, dateFrom, dateTo, type, isAvailableOffers, isDescription, isPhotosList} = data;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${createEventTypesListTemplate(type)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${createDestinationsListTemplate()}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormDateFormat(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormDateFormat(dateTo)}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers ${isAvailableOffers ? '' : 'visually-hidden'}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${isAvailableOffers ? createOffersList(data) : ''}
        </div>
      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description" ${isDescription ? '' : 'visually-hidden'}>${destination.description}</p>
        <div class="event__photos-container ${isPhotosList ? '' : 'visually-hidden'}">
        <div class="event__photos-tape">
        ${isPhotosList ? createPicturesList(destination) : ''}
        </div>
      </div>
    </section>
  </section>
</form>
  </li>`;
};

export default class EditForm extends SmartView {
  constructor(point) {
    super();
    this._data = EditForm.parsePointToState(point);

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
  }

  getTemplate() {
    return createEditFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  updateData(update) {
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
  }

  _editFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callbacks.formSubmit(EditForm.parseStateToPoint(this._data));
  }

  setEditFormSubmitHandler(callback) {
    this._callbacks.formSubmit = callback;
    this.getElement()
      .querySelector('form')
      .addEventListener('submit', this._editFormSubmitHandler);
  }

  _editFormCloseHandler(evt) {
    evt.preventDefault();
    this._callbacks.formClose();
  }

  setEditFormCloseHandler(callback) {
    this._callbacks.formClose = callback;
    this.getElement()
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this._editFormCloseHandler);
  }

  static parsePointToState(point) {
    return Object.assign(
      {},
      point,
      {
        isAvailableOffers: optionsMap.get(point.type),
        isDescription: isArrayEmpty(point.destination.description),
        isPhotosList: isArrayEmpty(point.destination.pictures),
      },
    );
  }

  static parseStateToPoint(data) {
    data = Object.assign({}, data);

    delete data.isAvailableOffers;
    delete data.isDescription;
    delete data.isPhotosList;

    return data;
  }
}
