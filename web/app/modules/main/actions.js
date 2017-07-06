export const SET_ACTIVE = 'SET_ACTIVE';
export const REMOVE_ACTIVE = 'REMOVE_ACTIVE';
export const SET_ACTIVE_SIDEBAR = 'SET_ACTIVE_SIDEBAR';

export const setActive = (name) => {
  return { type: SET_ACTIVE, name };
};

export const removeActive = (name) => {
  return { type: REMOVE_ACTIVE, name };
};

export const setActiveSidebar = (name) => {
  return { type: SET_ACTIVE_SIDEBAR, name };
};
