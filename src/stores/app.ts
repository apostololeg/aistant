import { createStore } from 'justorm/react';

export default createStore('app', {
  models: [],

  setModelsList(models) {
    this.models = models;
  },
});
