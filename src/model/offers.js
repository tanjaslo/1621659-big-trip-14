import Observer from '../utils/observer';

export default class Offers extends Observer {
  constructor() {
    super();
    this._offers = new Map();
  }

  get() {
    return this._offers;
  }

  set(offers) {
    offers.forEach((offer) => this._offers.set(offer.type, offer.offers));
  }
}
