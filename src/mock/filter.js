import {isFutureEvent, isExpiredEvent} from '../util';

const pointsToFilterMap = {
  everything: (points) => {
    return points.length;
  },
  future: (points) => {
    return points.filter((point) => isFutureEvent(point)).length;
  },
  past: (points) => {
    return points.filter((point) => isExpiredEvent(point)).length;
  },
};

const generateFilters = (points) => {
  return Object.entries(pointsToFilterMap).map(([filterName, countPoints]) => {
    return {
      name: filterName,
      count: countPoints(points),
    };
  });
};

export { generateFilters, pointsToFilterMap };
