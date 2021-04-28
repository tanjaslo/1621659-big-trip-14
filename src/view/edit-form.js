import {
  firstLetterCaps,
  isArrayEmpty } from '../utils/common.js';
import {
  getFormDateFormat,
  getDescriptionFromSentences,
  createPhotosArray } from '../utils/point.js';
import {
  DESTINATIONS,
  SENTENCES,
  optionsMap } from '../data.js';
import SmartView from './smart.js';

const createEventTypesListTemplate = (currentType) => {
  const eventTypes = Array.from(optionsMap.keys());

  const eventTypesList = eventTypes.map((type) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1" data-type="${type}">${firstLetterCaps(type)}</label>
    </div>`).join('');

  return eventTypesList;
};

const createDestinationsList = () => {
  return DESTINATIONS.map((city) => {
    return `<option value="${city}"></option>`;
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
    `<img class="event__photo" src="${picture.src}" alt="Event photo">`).join('');

  return picturesList;
};

const createEditFormTemplate = (state) => {
  const {basePrice, destination, dateFrom, dateTo, type, offersAreAvailable, isDescription, isPicturesList} = state;

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
          ${createDestinationsList()}
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
        ${offersAreAvailable ? '' : 'visually-hidden'}">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
          ${createOffersList(state)}
          </div>
        </section>

        <section class="event__section  event__section--destination"
        ${isDescription ? '' : 'visually-hidden'}>
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          <div class="event__photos-container"
          ${isPicturesList ? '' : 'visually-hidden'}>
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
  constructor(point) {
    super();
    this._state = EditForm.parsePointToState(point);

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._typeToggleHandler = this._typeToggleHandler.bind(this);
    this._destinationToggleHandler = this._destinationToggleHandler.bind(this);
    this._offersSelectorClickHandler = this._offersSelectorClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditFormTemplate(this._state);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('click', this._typeToggleHandler);
    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._destinationToggleHandler);
    if (this._state.offersAreAvailable) {
      this.getElement()
        .querySelector('.event__available-offers')
        .addEventListener('click', this._offersSelectorClickHandler);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setEditFormSubmitHandler(this._callbacks.formSubmit);
    this.setEditFormCloseHandler(this._callbacks.formClose);
  }

  _typeToggleHandler(evt) {
    evt.preventDefault;
    if (!evt.target.name === 'event-type') {
      return;
    }
    const currentType = evt.target.dataset.type;
    const options = optionsMap.get(this._state.type);
    const emptyOffers = [];

    this.updateState({
      type: currentType,
      offersAreAvailable: isArrayEmpty(options),
      offers: emptyOffers,
    });
  }

  _destinationToggleHandler(evt) {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const destinationFromList = DESTINATIONS.find((destination) => destinationName === destination);

    if (!destinationFromList) {
      evt.target.setCustomValidity('Please select a destination from the list');
      evt.target.reportValidity();
      return;
    }
    evt.target.setCustomValidity('');

    this.updateState({
      destination: {
        name: destinationName,
        description: getDescriptionFromSentences(SENTENCES),
        pictures: createPhotosArray(),
      },
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
    const pointOffers = this._state.offers.slice();

    const selectedOption = availableOptions.find((item) => item.title === clickedOption);
    const optionToAdd = pointOffers.find((item) => item.title === clickedOption);

    const selectedOptions = optionToAdd ? pointOffers.filter((item) => item.title !== clickedOption) : [...pointOffers, selectedOption];

    this.updateState({
      offers: selectedOptions,
    });
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
        offersAreAvailable: isArrayEmpty(optionsMap.get(point.type)),
        isDescription: isArrayEmpty(point.destination.description),
        isPicturesList: isArrayEmpty(point.destination.pictures),
      },
    );
  }

  static parseStateToPoint(state) {
    state = Object.assign({}, state);

    delete state.isDescription;
    delete state.isPicturesList;
    delete state.offersAreAvailable;

    return state;
  }
}
