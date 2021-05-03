import {
  firstLetterCaps,
  isArrayEmpty } from '../utils/common.js';
import { getFormDateFormat } from '../utils/point.js';
import { optionsMap } from '../data.js';
import SmartView from './smart.js';

import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';
const DATEPICKER_FORMAT = 'd/m/y H:i';

const createEventTypesListTemplate = (currentType) => {
  const eventTypes = Array.from(optionsMap.keys());

  const eventTypesList = eventTypes.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-type="${type}">${firstLetterCaps(type)}</label>
    </div>`).join('');

  return eventTypesList;
};

const createDestinationsList = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  }).join('');
};

const createOffersList = ({type, offers}) => {
  const availableOffers = optionsMap.get(type);

  const offersList = availableOffers.map((offer) => {
    const {title, price, id} = offer;
    const isOfferSelected = offers ? offers.some((item) => item.title === title) : false;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}" data-title="${title}" ${isOfferSelected ? 'checked' : ''}>
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
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

  return picturesList;
};

const createEditFormTemplate = (state, destinations) => {
  const {basePrice, destination, dateFrom, dateTo, type, hasOptions, hasDescription, hasPicturesList} = state;

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

        <div class="event__field-group  event__field-group--destination"}>
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
          ${createDestinationsList(destinations)}
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
        <section class="event__section  event__section--offers
        ${hasOptions ? '' : 'visually-hidden'}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${createOffersList(state)}
          </div>
        </section>

        <section class="event__section  event__section--destination"
        ${hasDescription ? '' : 'visually-hidden'}>
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          <div class="event__photos-container"
          ${hasPicturesList ? '' : 'visually-hidden'}>
          <div class="event__photos-tape">
          ${createPicturesList(destination)}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`;
};

export default class EditForm extends SmartView {
  constructor(point, destinations) {
    super();
    this._state = EditForm.parsePointToState(point);
    this._destinations = destinations;
    this._datepicker = null;

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._editFormDeleteClickHandler = this._editFormDeleteClickHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._offersSelectorClickHandler = this._offersSelectorClickHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);
    this._setDateFromPicker();
    this._setDateToPicker();
    this._setInnerHandlers();
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        dateFormat: DATEPICKER_FORMAT,
        enableTime: true,
        time_24hr: true,
        default: this._state.dateFrom,
        maxDate: new Date(this._state.dateTo),
        onChange: this._dateFromChangeHandler,
      },
    );
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        dateFormat: DATEPICKER_FORMAT,
        enableTime: true,
        time_24hr: true,
        default: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this._dateToChangeHandler,
      },
    );
  }

  getTemplate() {
    return createEditFormTemplate(this._state, this._destinations);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._typeToggleHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationToggleHandler);
    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._priceChangeHandler);
    if (this._state.hasOptions) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._offersSelectorClickHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDateFromPicker();
    this._setDateToPicker();
    this.setEditFormSubmitHandler(this._callbacks.formSubmit);
    this.setEditFormCloseHandler(this._callbacks.formClose);
    this.setEditFormDeleteClickHandler(this._callbacks.deleteClick);
  }

  _dateFromChangeHandler([userDate]) {
    this.updateState({
      dateFrom: userDate,
    });
  }

  _dateToChangeHandler([userDate]) {
    this.updateState({
      dateTo: userDate,
    });
  }

  _typeToggleHandler(evt) {
    evt.preventDefault();
    if (!evt.target.classList.contains('event__type-label')) {
      return;
    }
    const currentType = evt.target.dataset.type;
    const options = optionsMap.get(currentType);
    const emptyOffers = [];

    this.updateState({
      type: currentType,
      hasOptions: isArrayEmpty(options),
      offers: emptyOffers,
    });
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const destinationFromList = this._destinations.find((destination) => destinationName === destination.name);

    if (!destinationFromList) {
      evt.target.setCustomValidity('Please select a destination from the list');
      evt.target.reportValidity();
      return;
    }
    evt.target.setCustomValidity('');

    this.updateState({
      destination: destinationFromList,
      hasDescription: isArrayEmpty(destinationFromList.description),
      hasPicturesList: isArrayEmpty(destinationFromList.pictures),
    });
  }

  _offersSelectorClickHandler(evt) {
    evt.preventDefault;
    const target = evt.target.closest('input');
    if (!target) {
      return;
    }
    const clickedOption = target.dataset.title;
    const availableOptions = optionsMap.get(this._state.type);
    const pointOffers = this._state.offers;

    const selectedOption = availableOptions.find((item) => item.title === clickedOption);
    const optionToAdd = pointOffers.find((item) => item.title === clickedOption);

    const selectedOptions = optionToAdd ? pointOffers.filter((item) => item.title !== clickedOption) : [...pointOffers, selectedOption];

    this.updateState({
      offers: selectedOptions,
    });
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();
    const price = evt.target.value;

    if (isNaN(price) || price < 0) {
      evt.target.setCustomValidity('Price must be a positive number');
      evt.target.reportValidity();
      return;
    }
    evt.target.setCustomValidity('');

    this.updateState(
      {
        basePrice: parseInt(price, 10),
      }, true);
  }

  _editFormSubmitHandler(evt) {
    evt.preventDefault();
    this._callbacks.formSubmit(EditForm.parseStateToPoint(this._state));
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

  _editFormDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.deleteClick(EditForm.parseStateToPoint(this._state));
  }

  setEditFormDeleteClickHandler(callback) {
    this._callbacks.deleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._editFormDeleteClickHandler);
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более ненужный календарь
  removeElement() {
    super.removeElement();

    if (this._datepicker) {
      this._datepicker.destroy();
      this._datepicker = null;
    }
  }

  reset(point) {
    this.updateState(
      EditForm.parsePointToState(point),
    );
  }

  static parsePointToState(point) {
    return Object.assign(
      {},
      point,
      {
        hasOptions: isArrayEmpty(optionsMap.get(point.type)),
        hasDescription: isArrayEmpty(point.destination.description),
        hasPicturesList: isArrayEmpty(point.destination.pictures),
      },
    );
  }

  static parseStateToPoint(state) {
    state = Object.assign({}, state);

    delete state.hasDescription;
    delete state.hasPicturesList;
    delete state.hasOptions;

    return state;
  }
}
