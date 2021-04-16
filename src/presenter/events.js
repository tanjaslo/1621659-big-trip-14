
import EditFormView from '../view/edit-form.js';
import EventsListView from '../view/list.js';
import NoEventView from '../view/no-event.js';
import PointView from '../view/point.js';
import TripSortView from '../view/sort.js';
import { render, RenderPosition, replace } from '../utils/render.js';
import { POINT_COUNT } from '../data.js';

export default class Events {
  constructor(pointsContainer) {
    this._pointsContainer = pointsContainer;

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
    const pointComponent = new PointView(point);
    const pointEditComponent = new EditFormView(point);

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    pointComponent.setPointEditClickHandler(() => {
      replacePointToForm();
      document.addEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setEditFormSubmitHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    pointEditComponent.setEditFormCloseHandler(() => {
      replaceFormToPoint();
      document.removeEventListener('keydown', onEscKeyDown);
    });

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    render(this._pointsComponent, pointComponent, RenderPosition.BEFOREEND);
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
