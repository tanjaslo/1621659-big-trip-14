import PointsModel from '../model/points.js';
import { isOnline } from '../utils/common.js';

const createPointsStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, tripPointsStore, offersStore, destinationsStore) {
    this._api = api;
    this._pointsStore = tripPointsStore;
    this._offersStore = offersStore;
    this._destinationsStore = destinationsStore;
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations().then((destinations) => {
        this._destinationsStore.setItems(destinations);
        return destinations;
      });
    }
    return Promise.resolve(this._destinationsStore.getItems());
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers().then((offers) => {
        this._offersStore.setItems(offers);
        return offers;
      });
    }
    return Promise.resolve(this._offersStore.getItems());
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createPointsStoreStructure(points.map(PointsModel.adaptToServer));
          this._pointsStore.setItems(items);
          return points;
        });
    }
    const storePoints = Object.values(this._pointsStore.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._pointsStore.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }
    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });
    }
    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
        .then(() => this._pointsStore.removeItem(point.id));
    }
    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._pointsStore.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);
          const items = createPointsStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);
        });
    }
    return Promise.reject(new Error('Sync data failed'));
  }
}
