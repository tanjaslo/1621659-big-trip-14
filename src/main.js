import { render, RenderPosition } from './utils/render.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import MenuView from './view/menu.js';
import TripInfoView from './view/route.js';
import BoardPresenter from './presenter/board.js';
import FilterPresenter from './presenter/filter.js';
import { UpdateType, MenuItem, FilterType } from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 0LnQvtGDLCDQtNC10YjQuNGE0YDQvtCy0YnQuNC6IQ==';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const addEventButton = document.querySelector('.trip-main__event-add-btn');
const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const boardElement = mainElement.querySelector('.page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();

const menuComponent = new MenuView();

const boardPresenter = new BoardPresenter(boardElement, pointsModel, filterModel, offersModel, destinationsModel, api);
const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel, offersModel, destinationsModel);

const handleMenuClick = (menuItem) => {
  menuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.STATS:
      boardPresenter.destroy();
      addEventButton.disabled = true;
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case MenuItem.TABLE:
      boardPresenter.init();
      addEventButton.disabled = false;
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
  }
};

addEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});

Promise.all([
  api.getOffers(),
  api.getDestinations(),
  api.getPoints(),
]).then(([offers, destinations, points]) => {
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);
  render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
  render(menuElement, menuComponent, RenderPosition.AFTERBEGIN);
  menuComponent.setMenuClickHandler(handleMenuClick);
  filterPresenter.init();
})
  .catch(() => {
    offersModel.setOffers([]);
    destinationsModel.setDestinations([]);
    pointsModel.setPoints(UpdateType.INIT, []);
    render(menuElement, menuComponent, RenderPosition.AFTERBEGIN);
    menuComponent.setMenuClickHandler(handleMenuClick);
  });

boardPresenter.init();
