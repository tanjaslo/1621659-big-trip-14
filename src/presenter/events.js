import EventsListView from '../view/list.js';
import NoEventView from '../view/no-event.js';
import TripSortView from '../view/sort.js';
import PointPresenter from '../presenter/point.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItemById } from '../utils/common.js';
import { sortByDay, sortByPrice, sortByTime } from '../utils/point.js';
import { SortType } from '../data.js';

export default class Events {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    this._pointPresenters = {};
    this._currentSortType = SortType.DAY;

    this._pointsComponent = new EventsListView();
    this._sortComponent = new TripSortView(this._currentSortType);
    this._noEventComponent = new NoEventView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();

    render(this._pointsContainer, this._pointsComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _handleModeChange() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updateItemById(this._points, updatedPoint);
    this._pointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _sortPoints(sortType) {
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
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortPoints(sortType);
    this._clearPoints();
    this._renderEventsList();
  }

  _renderSort() {
    this._sortComponent = new TripSortView(this._currentSortType);
    render(this._pointsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _clearPoints() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
    remove(this._sortComponent);
  }

  _renderPoints() {
    this._points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._pointsComponent, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderEventsList() {
    if (this._points.length === 0) {
      this._renderNoPoints();
    }

    this._renderSort();
    this._renderPoints();
  }
}
