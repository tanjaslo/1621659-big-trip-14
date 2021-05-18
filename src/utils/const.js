export const DATEPICKER_FORMAT = 'd/m/y H:i';

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  ADDING: 'ADDING',
};

export const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const SortType = {
  DAY: 'day',
  PRICE: 'price',
  TIME: 'time',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const MenuItem = {
  TABLE: 'TABLE',
  STATS: 'STATS',
};

export const BLANK_POINT = {
  type: 'taxi',
  offers: [],
  destination: {
    description: '',
    name: '',
    pictures: [],
  },
  dateFrom: new Date(),
  dateTo: new Date(),
  basePrice: '',
  isFavourite: false,
};
