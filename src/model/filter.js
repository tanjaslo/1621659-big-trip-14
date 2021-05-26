import Observer from '../utils/observer.js';
import { FilterType } from '../utils/const.js';

export default class Filter extends Observer {
  constructor() {
    super();
    this._activeOption = FilterType.EVERYTHING;
  }

  get() {
    return this._activeOption;
  }

  set(updateType, filter) {
    this._activeOption = filter;
    this._notify(updateType, filter);
  }
}
