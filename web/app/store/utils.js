import { connect } from 'react-redux';
import routes from 'plugins/history';
import { withRouter } from 'react-router';
import queryString from 'query-string';

export const attachRouterRedux = (targetClass) => {
  if (typeof targetClass.routeHandler === 'function')
    routes.addComponentRoutes(targetClass.name, targetClass.routeHandler());
  return withRouter(connect(targetClass.mapState, targetClass.mapActions)(targetClass));
};

export const attachReducers = (reducers, defaultState) => {
  return (state = defaultState, action) => {
    if (reducers[action.type])
      return { ...state, ...reducers[action.type](state, action) };
    return state;
  };
};

export const omit = (obj, omitKey) => {
  return Object.keys(obj).reduce((result, key) => {
    if (key !== omitKey) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const getParamByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp(`[?&#]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const changeParam = (search, name, value) => {
  const parsed = queryString.parse(search);
  parsed[name] = value;
  return queryString.stringify(parsed);
};