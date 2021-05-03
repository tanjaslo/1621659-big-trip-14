import { isExpiredEvent, isFutureEvent } from './point.js';
import { FilterType } from '../const.js';

const pointsFilter = {
  [FilterType.EVERYTHING]: (points) => {
    return points;
  },
  [FilterType.PAST]: (points) => {
    return points.filter((point) => isExpiredEvent(point));
  },
  [FilterType.FUTURE]: (points) => {
    return points.filter((point) => isFutureEvent(point));
  },
};

export { pointsFilter };
