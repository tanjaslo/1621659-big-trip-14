import AbstractView from './abstract.js';
import { MenuItem } from '../utils/const.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" data-key="${MenuItem.TABLE}" href="#">Table</a>
            <a class="trip-tabs__btn" data-key="${MenuItem.STATS}" href="#">Stats</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callbacks.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const menuItems = this.getElement().querySelectorAll('.trip-tabs__btn');

    menuItems.forEach((item) => {
      if (item.dataset.key === menuItem) {
        item.classList.add('trip-tabs__btn--active');
      } else {
        item.classList.remove('trip-tabs__btn--active');
      }
    });
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.classList.contains('trip-tabs__btn--active') ||
    (!evt.target.classList.contains('trip-tabs__btn'))) {
      return;
    }
    this._callbacks.menuClick(evt.target.dataset.key);
  }
}
