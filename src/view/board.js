import AbstractView from './abstract.js';

const createBoardTemplate = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate(this._element);
  }
}
