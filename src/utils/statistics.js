import { getDuration } from '../utils/point.js';

export const getUniqueTypes = (points) => {
  const typesSet = new Set();

  points.forEach((point) => typesSet.add(point.type.toUpperCase()));

  return [...typesSet]; // Array.from(labelsSet);
};

export const getCostsByType = (points, uniqueTypes) => {
  const costs = [];

  uniqueTypes.forEach((uniqueType) => {
    let cost = 0;

    points.forEach((point) => {
      point.type.toUpperCase() === uniqueType ? cost += +point.basePrice : 0;
    });
    costs.push(cost);
  });
  return costs;
};

export const getAmountOfPointsByType = (points, uniqueTypes) => {
  const amounts = [];

  uniqueTypes.forEach((uniqueType) => {
    let amount = 0;

    points.forEach((point) => {
      point.type.toUpperCase() === uniqueType ? amount += 1 : 0;
    });
    amounts.push(amount);
  });
  return amounts;
};

export const getTimeSpentByType = (points, uniqueTypes) => {
  const durations = [];

  uniqueTypes.forEach((type) => {
    const allPointsTypes = points.filter((point) => point.type.toUpperCase() === type);

    const duration = allPointsTypes.reduce((duration, point) => {
      return duration + getDuration(point.dateFrom, point.dateTo);
    }, 0);
    durations.push(duration);
  });
  return durations;
};
