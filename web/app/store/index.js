import { combineReducers, createStore } from 'redux';

import main from 'modules/main/reducers';

const store = createStore(combineReducers({
  main
}));

export default store;
