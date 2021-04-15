import { getTripDates,
  getRoutePointsTitle,
  getTotalPrice } from '../utils/point.js';
import AbstractView from './abstract.js';

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

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createRouteTemplate(this._points);
  }
}
