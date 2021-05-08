import { POINT_COUNT } from '../src/data.js';
import { render, RenderPosition, remove } from './utils/render.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import MenuView from './view/menu.js';
import TripInfoView from './view/route.js';
import StatisticsView from './view/statistics.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import { renderPoints } from './mock/point.js';
import { destinations } from './mock/destination.js';
import { UpdateType, MenuItem, FilterType } from './const.js';

let statisticsComponent = null;

const points = renderPoints(POINT_COUNT, destinations);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(UpdateType.PATCH, destinations);

const filterModel = new FilterModel();
const offersModel = new OffersModel();

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const boardElement = mainElement.querySelector('.page-body__container');
const menuComponent = new MenuView();
render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
render(menuElement, menuComponent, RenderPosition.AFTERBEGIN);

const boardPresenter = new BoardPresenter(boardElement, pointsModel, filterModel, offersModel, destinationsModel);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel);

const handleMenuClick = (menuItem) => {
  menuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.STATS:
      boardPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(mainElement, statisticsComponent, RenderPosition.BEFOREEND);
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case MenuItem.TABLE:
    default:
      remove(statisticsComponent);
      boardPresenter.init();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
  }
};

menuComponent.setMenuClickHandler(handleMenuClick);

filterPresenter.init();
boardPresenter.init();

headerElement.querySelector('.trip-main__event-add-btn')
  .addEventListener('click', (evt) => {
    evt.preventDefault();
    boardPresenter.createPoint();
  });
