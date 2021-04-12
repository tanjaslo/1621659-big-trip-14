import { createElement } from '../util.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="trip-filters__filter-input  visually-hidden"
      name="trip-filter"
      value="${name}"
      ${isChecked ? 'checked' : ''}
    />
    <label for="filter__${name}" class="trip-filters__filter-label">${name} (${count})</label>`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter)).join(' &nbsp;&nbsp; ');

  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export default class Filter {
  constructor(filterItems) {
    //this._element = null;
    this._filterItems = filterItems;
  }

  getTemplate() {
    return createFilterTemplate(this._filterItems);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
