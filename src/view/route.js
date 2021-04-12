import { getTripDates,
  getRoutePointsTitle,
  getTotalPrice,
  createElement } from '../util.js';

const createRouteTemplate = (points) => {

  return `<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
  <h1 class="trip-info__title">${getRoutePointsTitle(points)}</h1>
  <p class="trip-info__dates">${getTripDates(points)}</p>
</div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice(points)}</span>
    </p>
  </section>`;
};

export default class TripInfo {
  constructor(points) {
    this._element = null;
    this._points = points;
  }

  getTemplate() {
    return createRouteTemplate(this._points);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
