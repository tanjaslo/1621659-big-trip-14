import { remove, render, RenderPosition, replace } from '../utils/render.js';
import StatisticsView from '../view/statistics.js';

export default class Statistics {
  constructor(statisticsContainer, pointsModel) {
    this._statisticsContainer = statisticsContainer;
    this._pointsModel = pointsModel;
    this._statisticsComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);

    const prevStatisticsComponent = this._statisticsComponent;
    this._statisticsComponent = new StatisticsView(this._pointsModel.getPoints());

    if (prevStatisticsComponent === null) {
      render(this._statisticsContainer, this._statisticsComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._statisticsComponent, prevStatisticsComponent);
    remove(prevStatisticsComponent);
  }

  destroy() {
    remove(this._statisticsComponent);
    this._statisticsComponent = null;
    this._pointsModel.removeObserver(this._handleModelEvent);
  }

  _handleModelEvent() {
    this.init();
  }
}
