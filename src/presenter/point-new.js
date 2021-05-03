import EditFormView from '../view/edit-form.js';
import { nanoid } from 'nanoid';
import { remove, render, RenderPosition } from '../utils/render.js';
import { UserAction, UpdateType } from '../const.js';
import { destinations } from '../mock/destination.js';

const BLANK_POINT = {
  type: 'bus',
  offers: [],
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: new Date,
  dateTo: new Date,
  basePrice: '',
  isFavorite: false,
};

export default class PointNew {
  constructor(pointContainer, changeData) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;

    this._pointNewComponent = null;

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._editFormDeleteClickHandler = this._editFormDeleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._pointNewComponent !== null) {
      return;
    }

    this._pointNewComponent = new EditFormView(BLANK_POINT, destinations);
    this._pointNewComponent.setEditFormSubmitHandler(this._editFormSubmitHandler);
    this._pointNewComponent.setEditFormCloseHandler(this._editFormCloseHandler);
    this._pointNewComponent.setEditFormDeleteClickHandler(this._editFormDeleteClickHandler);

    render(this._pointContainer, this._pointNewComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewComponent === null) {
      return;
    }

    remove(this._pointNewComponent);
    this._pointNewComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _editFormSubmitHandler(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign({id: nanoid()}, point),
    );
    this.destroy();
  }

  _editFormCloseHandler() {
    this.destroy();
  }

  _editFormDeleteClickHandler() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
