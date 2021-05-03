import BoardView from '../view/board.js';
import NoEventView from '../view/no-event.js';
import TripSortView from '../view/sort.js';
import PointPresenter from '../presenter/point.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { pointsFilter } from '../utils/filter.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/point.js';
import { SortType, UpdateType, UserAction } from '../const.js';

export default class Events {
  constructor(pointsContainer, pointsModel, filterModel, offersModel) {
    this._pointsContainer = pointsContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;

    this._pointPresenters = {};
    this._currentSortType = SortType.DAY;

    this._sortComponent = null;
    this._boardComponent = new BoardView();
    this._noEventComponent = new NoEventView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    // this._destinationsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._pointsContainer, this._boardComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  /*   _sortPoints(sortType) {
    switch (sortType) {
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
      case SortType.DAY:
      default:
        this._points.sort(sortByDay);
    }
    this._currentSortType = sortType;
  } */

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = pointsFilter[filterType](points);

    switch (this._currentSortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }
    return filteredPoints.sort(sortByDay);
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearBoard();
        this._renderBoard();
        break;
      case UpdateType.MAJOR:
        this._clearBoard({resetSortType: true});
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
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point, destinations) {
    const pointPresenter = new PointPresenter(
      this._boardComponent,
      this._handleViewAction,
      this._handleModeChange,
      this._destinations);
    pointPresenter.init(point, destinations);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _renderPoints() {
    this._getPoints().forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderNoPoints() {
    render(this._boardComponent, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderBoard() {
    if (this._getPoints().length === 0) {
      this._renderNoPoints();
      return;
    }
    this._renderSort();
    this._renderPoints(this._pointsModel);
  }

  _clearBoard({resetSortType = false} = {}) {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};

    remove(this._sortComponent);
    remove(this._noEventComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }
}
