import { POINT_COUNT } from '../src/data.js';
import { render, RenderPosition } from './utils/render.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import MenuView from './view/menu.js';
import TripInfoView from './view/route.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import { renderPoints } from './mock/point.js';

const points = renderPoints(POINT_COUNT);

const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = headerElement.querySelector('.trip-controls__navigation');
const filtersElement = headerElement.querySelector('.trip-controls__filters');
const eventsElement = mainElement.querySelector('.trip-events');

render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(menuElement, new MenuView(), RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(eventsElement, pointsModel, filterModel, destinationsModel, offersModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

filterPresenter.init();
boardPresenter.init();

headerElement.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});
