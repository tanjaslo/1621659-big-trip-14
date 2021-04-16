import { render, RenderPosition, remove } from '../utils/render.js';
import { POINT_COUNT } from '../data.js';
import EventsListView from '../view/list.js';
import NoEventView from '../view/no-event.js';
import TripSortView from '../view/sort.js';
import PointPresenter from '../presenter/point.js';

export default class Events {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;
    this._pointPresenter = {};

    this._pointsComponent = new EventsListView();
    this._sortComponent = new TripSortView();
    this._noEventComponent = new NoEventView();
  }

  init(points) {
    this._points = points.slice();

    render(this._pointsContainer, this._pointsComponent, RenderPosition.BEFOREEND);

    this._renderEventsList();
  }

  _renderSort() {
    render(this._pointsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsComponent);
    pointPresenter.init(point);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearPoints() {
    Object
      .values(this._taskPresenter)
      .forEach((presenter) => presenter.destroy());
    this._pointPresenter = {};
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
    this._renderPoints(POINT_COUNT);
  }
}
