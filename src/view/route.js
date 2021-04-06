import { getMonthFormat, getDayFormat } from '../util.js';

const createRouteTemplate = (points) => {

  const lastIndex = points.length - 1;
  const middleIndex = points.length/2 - 1;
  const firstPoint = points[0];
  const middlePoint = points[middleIndex];
  const lastPoint = points[lastIndex];

  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${firstPoint.destination.name} &mdash; ${middlePoint.destination.name} &mdash; ${lastPoint.destination.name}</h1>

      <p class="trip-info__dates">${getMonthFormat(firstPoint.dateFrom)} ${getDayFormat(firstPoint.dateFrom)} &mdash;&nbsp; ${getDayFormat(lastPoint.dateTo)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>`;
};

export { createRouteTemplate };
