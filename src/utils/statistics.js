import { getDuration } from '../utils/point.js';

export const getUniqueTypes = (points) => {
  const typesSet = new Set();

  points.forEach((point) => typesSet.add(point.type.toUpperCase()));

  return [...typesSet];
};

export const getCostsByType = (points, uniqueTypes) => {
  return uniqueTypes.map((uniqueType) => {
    return points.filter((point) => point.type.toUpperCase() === uniqueType)
      .reduce((total, point) => total += +point.basePrice, 0);
  });
};

export const getTimeSpentByType = (points, uniqueTypes) => {
  return uniqueTypes.map((uniqueType) => {
    return points.filter((point) => point.type.toUpperCase() === uniqueType)
      .reduce((total, point) => total + getDuration(point.dateFrom, point.dateTo), 0);
  });
};

export const getAmountOfPointsByType = (points, uniqueTypes) => {
  return uniqueTypes.map((uniqueType) => {
    return points.filter((point) => point.type.toUpperCase() === uniqueType).length;
  });
};

export const getDataMap = (labels, data) => {
  const dataMap = new Map();
  for (let i = 0 ; i < labels.length; i++) {
    dataMap.set(labels[i], data[i]);
  }
  return dataMap;
};

export const getSortedMap = (mapToSort) => {
  const sortedMap = new Map([...mapToSort.entries()]
    .sort((firstEntry, secondEntry) => {
      return secondEntry[1] - firstEntry[1];
    }));
  return sortedMap;
};

