import { isOnline } from './utils/common.js';
import { render, RenderPosition } from './utils/render.js';
import { toast } from './utils/toast/toast.js';
import PointsModel from './model/points.js';
import DestinationsModel from './model/destinations.js';
import OffersModel from './model/offers.js';
import FilterModel from './model/filter.js';
import MenuView from './view/menu.js';
import BoardPresenter from './presenter/board.js';
import RoutePresenter from './presenter/route.js';
import FilterPresenter from './presenter/filter.js';
import StatisticsPresenter from './presenter/statistics.js';
import {
  UpdateType,
  MenuItem,
  FilterType,
  StorePrefix,
  AUTHORIZATION,
  END_POINT,
  STORE_VER } from './utils/const.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

const POINTS_STORE_NAME = `${StorePrefix.POINTS}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${StorePrefix.OFFERS}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${StorePrefix.DESTINATIONS}-${STORE_VER}`;

const addEventButton = document.querySelector('.trip-main__event-add-btn');
const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-body__page-main');
const tripMainElement = headerElement.querySelector('.trip-main');
const menuElement = tripMainElement.querySelector('.trip-controls__navigation');
const filtersElement = tripMainElement.querySelector('.trip-controls__filters');
const boardElement = mainElement.querySelector('.page-body__container');

const api = new Api(END_POINT, AUTHORIZATION);
const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, offersStore, destinationsStore);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const menuComponent = new MenuView();

const routePresenter = new RoutePresenter(tripMainElement, pointsModel);
routePresenter.init();

const boardPresenter = new BoardPresenter(boardElement, pointsModel, filterModel, offersModel, destinationsModel, apiWithProvider);
boardPresenter.init();

const filterPresenter = new FilterPresenter(filtersElement, filterModel, pointsModel, offersModel, destinationsModel);
filterPresenter.init();

const statisticsPresenter = new StatisticsPresenter(boardElement, pointsModel);

render(menuElement, menuComponent, RenderPosition.AFTERBEGIN);

const handleMenuClick = (menuItem) => {
  menuComponent.setMenuItem(menuItem);

  switch (menuItem) {
    case MenuItem.STATS:
      boardPresenter.destroy();
      statisticsPresenter.init();
      addEventButton.disabled = true;
      filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
    case MenuItem.TABLE:
      statisticsPresenter.destroy();
      boardPresenter.init();
      addEventButton.disabled = false;
      filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
      break;
  }
};

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getPoints(),
]).then(([offers, destinations, points]) => {
  offersModel.set(offers);
  destinationsModel.set(destinations);
  pointsModel.set(UpdateType.INIT, points);
  menuComponent.setMenuClickHandler(handleMenuClick);
  addEventButton.disabled = false;
  addEventButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    if (!isOnline()) {
      toast('You cannot create new point offline');
      return;
    }
    boardPresenter.createPoint();
  });
})
  .catch(() => {
    offersModel.set([]);
    destinationsModel.set([]);
    pointsModel.set(UpdateType.INIT, []);
    menuComponent.setMenuClickHandler(handleMenuClick);
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
  toast('Attention! Network not available.');
});
