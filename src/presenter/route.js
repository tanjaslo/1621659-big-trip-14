import { sortByDay } from '../utils/point.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import RouteView from '../view/route.js';

export default class Route {
  constructor(routeContainer, pointsModel) {
    this._routeContainer = routeContainer;
    this._routeComponent = null;

    this._pointsModel = pointsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    remove(this._routeComponent);

    const points = this._pointsModel.getPoints();
    if (points.length === 0) {
      return;
    }

    this._routeComponent = new RouteView(points.slice().sort(sortByDay));

    render(this._routeContainer, this._routeComponent, RenderPosition.AFTERBEGIN);
  }

  _handleModelEvent() {
    this.init();
  }
}
