import { getRandomInteger, getRandomArray } from './util.js';

export const WAYPOINT_COUNT = 20;

export const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

export const DESTINATIONS = ['Grosuplje', 'Ljubljana','Maribor', 'Novo Mesto', 'Ptuj', 'Vrhnika'];

export const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const PICTURES = [
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(0, 5)}`,
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(5, 10)}`,
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(10, 15)}`,
  },
  {
    src: `http://picsum.photos/248/152?r=${getRandomInteger(15, 20)}`,
  },
];

const busOptions = [
  {
    title: 'Book tickets',
    price: getRandomInteger(50, 100),
  },
  {
    title: 'Choose seats',
    price: 5,
  },
];

const checkinOptions = [
  {
    title: 'Add breakfast',
    price: 50,
  },
  {
    title: 'Add dinner',
    price: 50,
  },
];

const driveOptions = [
  {
    title: 'Rent a car',
    price: 200,
  },
  {
    title: 'Rent a van',
    price: 500,
  },
];

const flightOptions = [
  {
    title: 'Add luggage',
    price: getRandomInteger(20, 50),
  },
  {
    title: 'Add meal',
    price: getRandomInteger(5, 25),
  },
  {
    title: 'Choose seats',
    price: 10,
  },
  {
    title: 'Switch to comfort class',
    price: getRandomInteger(50, 100),
  },
];

const restaurantOptions = [
  {
    title: 'Book table 8-10am',
    price: 10,
  },
  {
    title: 'Book table 5-6pm',
    price: 50,
  },
];

const shipOptions = [
  {
    title: 'Add beverages',
    price: 20,
  },
  {
    title: 'Add snacks',
    price: 20,
  },
  {
    title: 'Choose cabin',
    price: 100,
  },
];

const sightseeingOptions = [
  {
    title: 'Book tickets',
    price: 50,
  },
  {
    title: 'Lunch in city',
    price: 30,
  },
];

const taxiOptions = [
  {
    title: 'Order Uber',
    price: 20,
  },
  {
    title: 'Choose the radio station',
    price: 10,
  },
  {
    title: 'Upgrade to a business class',
    price: 100,
  },
];

const trainOptions = [
  {
    title: 'Add meal',
    price: 20,
  },
  {
    title: 'Choose seats',
    price: 100,
  },
];

const transportOptions = [
  {
    title: 'Buy day pass',
    price: 10,
  },
  {
    title: 'Buy week pass',
    price: 25,
  },
  {
    title: 'Buy month pass',
    price: 50,
  },
];

export const optionsMap = new Map();
optionsMap
  .set('bus', getRandomArray(busOptions))
  .set('check-in', getRandomArray(checkinOptions))
  .set('drive', getRandomArray(driveOptions))
  .set('flight', getRandomArray(flightOptions))
  .set('sightseeing', getRandomArray(sightseeingOptions))
  .set('ship', getRandomArray(shipOptions))
  .set('restaurant', getRandomArray(restaurantOptions))
  .set('taxi', getRandomArray(taxiOptions))
  .set('train', getRandomArray(trainOptions))
  .set('transport', getRandomArray(transportOptions));
