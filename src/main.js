import { WAYPOINT_COUNT } from './data.js';
import { createAddFormTemplate } from './view/add-form.js';
import { createEditFormTemplate } from './view/edit-form.js';
import { createFilterTemplate } from './view/filter.js';
import { createEventsListTemplate } from './view/list.js';
import { createMenuTemplate } from './view/menu.js';
import { createRouteTemplate } from './view/route.js';
import { createSortTemplate } from './view/sort.js';
import { createPointsTemplate } from './view/point.js';
import { renderPoints } from './mock/point.js';
import { generateFilters } from './mock/filter.js';

const points = renderPoints(WAYPOINT_COUNT);
const filters = generateFilters(points);

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

renderTemplate(tripMainElement, createRouteTemplate(points), 'afterbegin');
renderTemplate(menuElement, createMenuTemplate(), 'beforeend');
renderTemplate(filtersElement, createFilterTemplate(filters), 'beforeend');
renderTemplate(eventsElement, createSortTemplate(), 'afterbegin');
renderTemplate(eventsElement, createAddFormTemplate(points[0]), 'beforeend');
renderTemplate(eventsElement, createEventsListTemplate(), 'beforeend');

const eventList = mainElement.querySelector('.trip-events__list');

for (let i = 1; i < WAYPOINT_COUNT; i++) {
  renderTemplate(eventList, createPointsTemplate(points[i]), 'beforeend');
}

const eventItem = document.querySelector('.trip-events__item');

renderTemplate(eventItem, createEditFormTemplate(points[1]), 'afterend');
