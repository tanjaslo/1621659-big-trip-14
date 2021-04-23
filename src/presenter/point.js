import { render, RenderPosition, replace, remove } from '../utils/render.js';
import EditFormView from '../view/edit-form.js';
import PointView from '../view/point.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handlePointEditClick = this._handlePointEditClick.bind(this);
    this._handleFavouriteClick = this._handleFavouriteClick.bind(this);
    this._handleEditFormSubmit = this._handleEditFormSubmit.bind(this);
    this._handleEditFormClose = this._handleEditFormClose.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new EditFormView(point);

    this._pointComponent.setPointEditClickHandler(this._handlePointEditClick);
    this._pointComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._pointEditComponent.setEditFormSubmitHandler(this._handleEditFormSubmit);
    this._pointEditComponent.setEditFormCloseHandler(this._handleEditFormClose);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToPoint();
    }
  }

  _handlePointEditClick() {
    this._replacePointToForm();
  }

  _handleFavouriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavourite: !this._point.isFavourite,
        },
      ),
    );
  }

  _handleEditFormSubmit(point) {
    this._changeData(point);
    this._replaceFormToPoint();
  }

  _handleEditFormClose() {
    this._replaceFormToPoint();
  }
}
