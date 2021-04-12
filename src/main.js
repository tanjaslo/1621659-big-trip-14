import { POINT_COUNT } from './data.js';
import { renderElement, RenderPosition } from './util.js';
import AddFormView from './view/add-form.js';
// import EditFormView from './view/edit-form.js';
import FilterView from './view/filter.js';
import EventsListView from './view/list.js';
import MenuView from './view/menu.js';
import TripInfoView from './view/route.js';
import TripSortView from './view/sort.js';
import PointView from './view/point.js';
import { renderPoints } from './mock/point.js';
import { generateFilters } from './mock/filter.js';

const points = renderPoints(POINT_COUNT);
const filters = generateFilters(points);

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

renderElement(tripMainElement, new TripInfoView(points).getElement(), RenderPosition.AFTERBEGIN);
renderElement(menuElement, new MenuView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(filtersElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);
renderElement(eventsElement, new TripSortView().getElement(), RenderPosition.AFTERBEGIN);
renderElement(eventsElement, new AddFormView(points[0]).getElement(), RenderPosition.BEFOREEND);
renderElement(eventsElement, new EventsListView().getElement(), RenderPosition.BEFOREEND);

const eventList = mainElement.querySelector('.trip-events__list');

points.forEach((point) => {
  renderElement(eventList, new PointView(point).getElement(), RenderPosition.BEFOREEND);
});

// const eventItem = document.querySelector('.trip-events__item');

// renderElement(eventItem, new EditFormView(points[0]).getElement(), RenderPosition.BEFOREEND);
