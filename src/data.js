export const POINT_COUNT = 20;

export const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.', 'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.', 'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.', 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.', 'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.', 'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

export const DESTINATIONS = ['Grosuplje', 'Ljubljana','Maribor', 'Novo Mesto', 'Ptuj', 'Vrhnika'];

export const TYPES = ['taxi', 'bus', 'train', 'ship', 'transport', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const busOptions = [
  {
    id: 1,
    title: 'Add luggage',
    price: 10,
  },
  {
    id: 2,
    title: 'Choose seats',
    price: 5,
  },
  {
    id: 3,
    title: 'Book tickets',
    price: 20,
  },
];

const checkinOptions = [
  {
    id: 4,
    title: 'Add breakfast',
    price: 20,
  },
  {
    id: 5,
    title: 'Add dinner',
    price: 30,
  },
  {
    id: 6,
    title: 'Early check-in',
    price: 50,
  },
  {
    id: 7,
    title: 'Late check-out',
    price: 50,
  },
];

const driveOptions = [
  {
    id: 8,
    title: 'Rent a car',
    price: 200,
  },
  {
    id: 9,
    title: 'Rent a van',
    price: 500,
  },
];

const flightOptions = [
  {
    id: 10,
    title: 'Add luggage',
    price: 30,
  },
  {
    id: 11,
    title: 'Add meal',
    price: 20,
  },
  {
    id: 12,
    title: 'Choose seats',
    price: 10,
  },
  {
    id: 13,
    title: 'Switch to comfort class',
    price: 100,
  },
];

const restaurantOptions = [
  {
    id: 14,
    title: 'Book table 8-10am',
    price: 10,
  },
  {
    id: 15,
    title: 'Book table 5-6pm',
    price: 50,
  },
];

const shipOptions = [
  {
    id: 16,
    title: 'Add beverages',
    price: 20,
  },
  {
    id: 17,
    title: 'Add snacks',
    price: 20,
  },
  {
    id: 18,
    title: 'Choose cabin',
    price: 100,
  },
];

const sightseeingOptions = [
  {
    id: 19,
    title: 'Book tickets',
    price: 50,
  },
  {
    id: 20,
    title: 'Lunch in city',
    price: 30,
  },
];

const taxiOptions = [
  {
    id: 21,
    title: 'Order Uber',
    price: 20,
  },
  {
    id: 22,
    title: 'Choose the radio station',
    price: 10,
  },
  {
    id: 23,
    title: 'Upgrade to a business class',
    price: 100,
  },
];

const trainOptions = [
  {
    id: 24,
    title: 'Add meal',
    price: 20,
  },
  {
    id: 25,
    title: 'Choose seats',
    price: 100,
  },
];

const transportOptions = [
  {
    id: 26,
    title: 'Buy day pass',
    price: 10,
  },
  {
    id: 27,
    title: 'Buy week pass',
    price: 25,
  },
  {
    id: 28,
    title: 'Buy month pass',
    price: 50,
  },
];

export const optionsMap = new Map();
optionsMap
  .set('bus', busOptions)
  .set('check-in', checkinOptions)
  .set('drive', driveOptions)
  .set('flight', flightOptions)
  .set('sightseeing', sightseeingOptions)
  .set('ship', shipOptions)
  .set('restaurant', restaurantOptions)
  .set('taxi', taxiOptions)
  .set('train', trainOptions)
  .set('transport', transportOptions);
