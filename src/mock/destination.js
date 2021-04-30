import {
  DESTINATION_COUNT,
  SENTENCES,
  DESTINATIONS } from '../data.js';
import {
  getDescriptionFromSentences,
  createPhotosArray } from '../utils/point.js';
import { getRandomArrayElement } from '../utils/common.js';

const createDestination = () => {
  const pictures = createPhotosArray();

  const destination = {
    description: getDescriptionFromSentences(SENTENCES),
    name: getRandomArrayElement(DESTINATIONS),
    pictures: pictures,
  };
  return destination;
};

const createDestinations = () => new Array(DESTINATION_COUNT).fill(null).map(createDestination);

const destinations = createDestinations();

export { createDestination, destinations };
