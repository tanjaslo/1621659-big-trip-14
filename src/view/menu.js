import AbstractView from './abstract.js';
import { MenuItem } from '../const.js';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}" value="${MenuItem.TABLE}">Table</a>
  <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}" value="${MenuItem.STATS}">Stats</a>
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

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callbacks.menuClick(evt.target.value);
  }

  setMenuClickHandler(callback) {
    this._callbacks.menuClick = callback;
    this.getElement().addEventListener('change', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);
    const activeItem = this.getElement().querySelector('.trip-tabs__btn--active');

    if (item !== null && activeItem !== null) {
      item.classList.add('trip-tabs__btn--active');
      activeItem.classList.remove('trip-tabs__btn--active');
    }
  }
}
