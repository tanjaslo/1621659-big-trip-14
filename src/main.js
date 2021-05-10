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
import { destinations } from './mock/destination.js';
import { UpdateType, MenuItem, FilterType } from './const.js';
import Api from './api.js';

const AUTHORIZATION = 'Basic 0L/RgNC40LLQtdGCLNC00LXRiNC40YTRgNC+0LLRidC40Loh';
const END_POINT = 'https://14.ecmascript.pages.academy/big-trip';

const api = new Api(END_POINT, AUTHORIZATION);

api.getPoints().then((points) => {
  console.log(points);
  // Есть проблема: cтруктура объекта похожа, но некоторые ключи называются иначе,
  // а ещё на сервере используется snake_case, а у нас camelCase.
  // Можно, конечно, переписать часть нашего клиентского приложения, но зачем?
  // Есть вариант получше - паттерн "Адаптер"
});

const points = renderPoints(POINT_COUNT, destinations);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(UpdateType.PATCH, destinations);

const filterModel = new FilterModel();
const offersModel = new OffersModel();

const addEventButton = document.querySelector('.trip-main__event-add-btn');
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

menuComponent.setMenuClickHandler(handleMenuClick);

filterPresenter.init();
boardPresenter.init();

addEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  boardPresenter.createPoint();
});
