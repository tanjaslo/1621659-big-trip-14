import { POINT_COUNT } from '../src/data.js';
import { render, RenderPosition } from './utils/render.js';
// import AddFormView from './view/add-form.js';
import FilterView from './view/filter.js';
import MenuView from './view/menu.js';
import TripInfoView from './view/route.js';
import EventsPresenter from './presenter/events.js';
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

render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(menuElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(filtersElement, new FilterView(filters), RenderPosition.BEFOREEND);

const eventsPresenter = new EventsPresenter(eventsElement);
eventsPresenter.init(points);
