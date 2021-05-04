import Observer from '../utils/observer.js';

export default class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  setFilter(updateType, destinations) {
    this._destinations = destinations.slice();
    this._notify(updateType);
  }

  getDestinations() {
    return this._destinations;
  }
}
