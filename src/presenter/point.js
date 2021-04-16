import { render, RenderPosition, replace } from '../utils/render.js';
import EditFormView from '../view/edit-form.js';
import PointView from '../view/point.js';

export default class Point {
  constructor(pointListContainer) {
    this._pointListContainer = pointListContainer;

    this._pointComponent = null;
    this._pointEditComponent = null;

    this._pointEditClickHandler = this._pointEditClickHandler.bind(this);
    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new EditFormView(point);

    this._pointComponent.setPointEditClickHandler(this._pointEditClickHandler);
    this._pointEditComponent.setEditFormSubmitHandler(this._editFormSubmitHandler);
    this._pointEditComponent.setEditFormCloseHandler(this._editFormCloseHandler);

    render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _pointEditClickHandler() {
    this._replacePointToForm();
  }

  _editFormSubmitHandler() {
    this._replaceFormToPoint();
  }

  _editFormCloseHandler() {
    this._replaceFormToPoint();
  }
}
