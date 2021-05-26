import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { areDatesEqual } from '../utils/point.js';
import { UserAction, UpdateType, Mode, State } from '../utils/const.js';
import { isEscEvent, isOnline } from '../utils/common.js';
import { toast } from '../utils/toast/toast.js';
import EditFormView from '../view/edit-form.js';
import PointView from '../view/point.js';

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
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateState({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case State.DELETING:
        this._pointEditComponent.updateState({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        break;
    }
  }

  init(point, offers, destinations) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new EditFormView(point, offers, destinations);

    this._pointComponent.setPointEditClickHandler(this._handlePointEditClick);
    this._pointComponent.setFavouriteClickHandler(this._handleFavouriteClick);
    this._pointEditComponent.setEditFormSubmitHandler(this._handleEditFormSubmit);
    this._pointEditComponent.setEditFormCloseHandler(this._handleEditFormClose);
    this._pointEditComponent.setEditFormDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.DEFAULT;
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
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  _handlePointEditClick() {
    this._replacePointToForm();
  }

  _handleFavouriteClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      Object.assign(
        {},
        this._point,
        {
          isFavourite: !this._point.isFavourite,
        },
      ),
    );
  }

  _handleEditFormSubmit(update) {
    if (!isOnline()) {
      toast('You cannot save point offline');
      return;
    }
    const isMinorUpdate =
    !areDatesEqual(this._point.dateFrom, update.dateFrom) ||
    this._point.basePrice !== update.basePrice;

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  _handleEditFormClose() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleDeleteClick(point) {
    if (!isOnline()) {
      toast('You cannot delete point offline');
      return;
    }
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }
}

export { State };
