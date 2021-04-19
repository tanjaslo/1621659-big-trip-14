import EventsListView from '../view/list.js';
import NoEventView from '../view/no-event.js';
import TripSortView from '../view/sort.js';
import PointPresenter from '../presenter/point.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItemById } from '../utils/common.js';

export default class Events {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    this._pointPresenters = {};

    this._pointsComponent = new EventsListView();
    this._sortComponent = new TripSortView();
    this._noEventComponent = new NoEventView();

    this._changePointHandler = this._changePointHandler.bind(this);
    this._сhangeModeHandler = this._сhangeModeHandler.bind(this);
  }

  init(points) {
    this._points = points.slice();

    render(this._pointsContainer, this._pointsComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _сhangeModeHandler() {
    Object
      .values(this._pointPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _changePointHandler(updatedPoint) {
    this._points = updateItemById(this._points, updatedPoint);
    this._pointPresenters[updatedPoint.id].init(updatedPoint);
  }

  _renderSort() {
    render(this._pointsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsComponent, this._changePointHandler, this._сhangeModeHandler);
    pointPresenter.init(point);
    this._pointPresenters[point.id] = pointPresenter;
  }

  _clearPoints() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenters = {};
    remove(this._sortComponent);
  }

  _renderPoints() {
    this._points
      .slice()
      .forEach((point) => this._renderPoint(point));
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
