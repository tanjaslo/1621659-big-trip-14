import {
  firstLetterCaps,
  isArrayEmpty } from '../utils/common.js';
import { getFormDateFormat } from '../utils/point.js';
import { DATEPICKER_FORMAT, Mode } from '../utils/const.js';
import SmartView from './smart.js';
import dayjs from 'dayjs';
import he from 'he';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEventTypesListTemplate = (availableOffers, currentType, isDisabled) => {
  const eventTypes = Array.from(availableOffers.keys());

  const eventTypesList = eventTypes.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-type="${type}">${firstLetterCaps(type)}</label>
    </div>`).join('');

  return eventTypesList;
};

const createDestinationsList = (destinations) => {
  return destinations.map((destination) => {
    return `<option value="${destination.name}"></option>`;
  }).join('');
};

const createOffersList = (availableOffers, type, selectedOffers, isDisabled) => {
  const offers = availableOffers.get(type);
  const offersList = offers.map((offer) => {
    const {title, price} = offer;
    const id = title.split('').join('-');
    const isOfferSelected = selectedOffers ? selectedOffers.some((item) => item.title === title && item.price === price) : false;

    return `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${id}" type="checkbox" name="event-offer-${type}" data-title="${title}" ${isOfferSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} >
      <label class="event__offer-label" for="event-offer-${type}-${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
      </div>`;
  }).join('');

  return offersList;
};

const createDestinationContainer = (destination) => {
  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
    </section>`;
};

const createPicturesContainer = (destination) => {
  const picturesList = destination.pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

  return `<div class="event__photos-container">
  <div class="event__photos-tape">
  ${picturesList}
  </div>
</div>`;
};

const createEditFormTemplate = (state, availableOffers, destinations, mode) => {
  const {basePrice, destination, dateFrom, dateTo, offers, type, isDisabled, isSaving, isDeleting} = state;

  const hasDescription = isArrayEmpty(destination.description);
  const hasPicturesList = isArrayEmpty(destination.pictures);
  const hasOptions = isArrayEmpty(availableOffers.get(type));
  const isEditingMode = mode !== Mode.ADDING;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createEventTypesListTemplate(availableOffers, type, isDisabled)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination"}>
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1" ${isDisabled ? 'disabled' : ''} required>
          <datalist id="destination-list-1">
          ${createDestinationsList(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getFormDateFormat(dateFrom)}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getFormDateFormat(dateTo)}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" name="event-price" type="text" value="${basePrice}" required ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>

        ${isEditingMode ? `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : '<button class="event__reset-btn" type="reset">Cancel</button>'}

      </header>
      <section class="event__details">
      <section class="event__section  event__section--offers ${hasOptions ? '' : 'visually-hidden'}">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${hasOptions ? createOffersList(availableOffers, type, offers, isDisabled) : ''}
        </div>
      </section>
      <section class="event__section  event__section--destination">
        ${hasDescription ? createDestinationContainer(destination) : ''}
        ${hasPicturesList ? createPicturesContainer(destination) : ''}
      </section>
      </section>
  </form>
</li>`;
};

export default class EditForm extends SmartView {
  constructor(point, availableOffers, destinations, mode) {
    super();
    this._state = EditForm.parsePointToState(point);
    this._availableOffers = availableOffers;
    this._destinations = destinations;
    this._mode = mode;
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
    return createEditFormTemplate(this._state, this._availableOffers, this._destinations, this._mode);
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
    this.getElement()
      .querySelector('.event__available-offers')
      .addEventListener('click', this._offersSelectorClickHandler);
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
    const chosenDate = dayjs(userDate);
    if (chosenDate.isAfter(this._state.dateTo)) {
      this._state.dateTo = chosenDate;
    }

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
    const currentOptions = this._availableOffers.get(currentType);
    const emptyOffers = [];

    this.updateState({
      type: currentType,
      options: currentOptions,
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
    });
  }

  _offersSelectorClickHandler(evt) {
    const target = evt.target.closest('input');
    if (!target) {
      return;
    }
    const clickedOption = target.dataset.title;
    const availableOptions = this._availableOffers.get(this._state.type);
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
    const price = Number(evt.target.value);

    if (isNaN(price) || price <= 0) {
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
    if (this._mode === Mode.ADDING) {
      return;
    }

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
    this.getElement()
      .querySelector('.event__reset-btn')
      .addEventListener('click', this._editFormDeleteClickHandler);
  }

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
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseStateToPoint(state) {
    state = Object.assign({}, state);

    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  }
}

