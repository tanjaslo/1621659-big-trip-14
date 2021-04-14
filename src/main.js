import { POINT_COUNT } from './data.js';
import { render, RenderPosition, replace } from './utils/render.js';
import AddFormView from './view/add-form.js';
import EditFormView from './view/edit-form.js';
import FilterView from './view/filter.js';
import EventsListView from './view/list.js';
import MenuView from './view/menu.js';
import TripInfoView from './view/route.js';
import TripSortView from './view/sort.js';
import PointView from './view/point.js';
import NoEventView from './view/no-event.js';
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

render(eventsElement, new EventsListView(), RenderPosition.BEFOREEND);

const eventList = mainElement.querySelector('.trip-events__list');

const renderPoint = (pointContainer, point) => {
  const pointComponent = new PointView(point);
  const pointEditComponent = new EditFormView(point);

  const replacePointToForm = () => {
    replace(pointEditComponent, pointComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointComponent, pointEditComponent);
  };

  pointComponent.setPointClickHandler(() => {
    replacePointToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setEditFormSubmitHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  pointEditComponent.setEditFormCloseHandler(() => {
    replaceFormToPoint();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  render(pointContainer, pointComponent, RenderPosition.BEFOREEND);
};

const renderEventsListElement = (pointsContainer, points) => {
  if (points.length === 0) {
    render(pointsContainer, new NoEventView(), RenderPosition.BEFOREEND);
  }
  render(eventsElement, new AddFormView(points[0]), RenderPosition.AFTERBEGIN);
  render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN); render(eventsElement, new TripSortView(), RenderPosition.AFTERBEGIN);

  points.forEach((point) => {
    renderPoint(pointsContainer, point);
  });
};

render(menuElement, new MenuView(), RenderPosition.AFTERBEGIN);
render(filtersElement, new FilterView(filters), RenderPosition.BEFOREEND);
renderEventsListElement(eventList, points);
