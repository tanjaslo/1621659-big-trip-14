import EditFormView from '../view/edit-form.js';
import { EscKeys, UserAction, UpdateType, Mode, BLANK_POINT } from '../utils/const.js';
import { isOnline } from '../utils/common.js';
import { toast } from '../utils/toast/toast.js';
import { remove, render, RenderPosition } from '../utils/render.js';

export default class PointNew {
  constructor(pointContainer, changeData, offersModel, destinationsModel) {
    this._pointContainer = pointContainer;
    this._pointNewComponent = null;

    this._changeData = changeData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._mode = Mode.ADDING;
    this._addEventButton = document.querySelector('.trip-main__event-add-btn');

    this._editFormSubmitHandler = this._editFormSubmitHandler.bind(this);
    this._editFormCloseHandler = this._editFormCloseHandler.bind(this);
    this._editFormDeleteClickHandler = this._editFormDeleteClickHandler.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  setSaving() {
    this._pointNewComponent.updateState({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._pointNewComponent.updateState({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointNewComponent.shake(resetFormState);
  }

  init() {
    if (this._pointNewComponent !== null) {
      return;
    }

    this._pointNewComponent = new EditFormView(BLANK_POINT, this._offersModel.get(), this._destinationsModel.get(), this._mode);
    this._pointNewComponent.setEditFormSubmitHandler(this._editFormSubmitHandler);
    this._pointNewComponent.setEditFormCloseHandler(this._editFormCloseHandler);
    this._pointNewComponent.setEditFormDeleteClickHandler(this._editFormDeleteClickHandler);

    render(this._pointContainer, this._pointNewComponent, RenderPosition.AFTERBEGIN);
    this._addEventButton.disabled = true;
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewComponent === null) {
      return;
    }

    remove(this._pointNewComponent);
    this._pointNewComponent = null;

    this._addEventButton.disabled = false;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _editFormSubmitHandler(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  _editFormCloseHandler() {
    this.destroy();
  }

  _editFormDeleteClickHandler() {
    if (!isOnline()) {
      toast('You cannot delete point offline');
      return;
    }
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === EscKeys.ESCAPE || evt.key === EscKeys.ESC) {
      evt.preventDefault();
      this.destroy();
    }
  }
}
