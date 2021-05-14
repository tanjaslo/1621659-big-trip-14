import EventsListView from '../view/events-list.js';
import BoardView from '../view/board.js';
import LoadingView from '../view/loading.js';
import NoEventView from '../view/no-event.js';
import TripSortView from '../view/sort.js';
import StatisticsView from '../view/statistics.js';
import PointPresenter from './point.js';
import PointNewPresenter from './point-new.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { pointsFilter } from '../utils/filter.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class Board {
  constructor(boardContainer, pointsModel, filterModel, offersModel, destinationsModel, api) {
    this._boardContainer = boardContainer;
    this._statsContainer = document.querySelector('.page-body__page-main');
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._isLoading = true;
    this._api = api;

    this._pointPresenters = {};
    this._currentSortType = SortType.DAY;

    this._loadingComponent = new LoadingView();
    this._sortComponent = null;
    this._statisticsComponent = null;
    this._boardComponent = new BoardView();
    this._pointsComponent = new EventsListView();
    this._noEventComponent = new NoEventView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointsComponent, this._handleViewAction, this._offersModel, this._destinationsModel);
  }

  init() {
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._pointsComponent, RenderPosition.BEFOREEND);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);
    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetSortType: true});

    remove(this._pointsComponent);
    remove(this._boardComponent);

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
    this._destinationsModel.removeObserver(this._handleModelEvent);
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init();
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = pointsFilter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
    }
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._api.updatePoint(update).then((response) => {
          this._pointsModel.updatePoint(updateType, response);
        });
        break;
      case UserAction.ADD_POINT:
        this._api.addNewPoint(update).then((response) => {
          this._pointsModel.addPoint(updateType, response);
        });
        break;
      case UserAction.DELETE_POINT:
        this._api.deletePoint(update).then(() => {
          this._pointsModel.deletePoint(updateType, update);
        });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenters[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearBoard();
    this._renderBoard();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new TripSortView(this._currentSortType);
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderStatistics() {
    if (this._statisticsComponent !== null) {
      this._statisticsComponent = null;
    }

    this._statisticsComponent = new StatisticsView(this._pointsModel.getPoints());
    render(this._statsContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._boardComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter(
      this._pointsComponent,
      this._handleViewAction,
      this._handleModeChange);
    pointPresenter.init(point, offers, destinations);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
    });
  }

  _renderNoPoints() {
    render(this._pointsComponent, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderPoints(this._pointsModel);
    remove(this._statisticsComponent);
  }

  _clearBoard({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._noEventComponent);
    this._renderStatistics();

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}
