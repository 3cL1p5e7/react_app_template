import { attachReducers } from 'store/utils';
import {
  SET_ACTIVE,
  REMOVE_ACTIVE,
  SET_ACTIVE_SIDEBAR
} from './actions.js';

const defaultState = {
  active: null,
  activeSidebar: null
};

const reducers = {
  [SET_ACTIVE]: (state, { name }) => {
    return { active: name };
  },
  [REMOVE_ACTIVE]: (state, { name }) => {
    if (!name)
      return { active: null };
    const active = state.active !== name ? state.active : null;
    return { active: active };
  },
  [SET_ACTIVE_SIDEBAR]: (state, { name }) => {
    return { activeSidebar: name };
  },
};

export default attachReducers(reducers, defaultState);
