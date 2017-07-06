import createHashHistory from 'history/createHashHistory';
import { matchPath } from 'react-router';
import { getParamByName, changeParam } from 'store/utils';
import store from 'store';

class Stack {
  constructor(max, def) {
    this.stac = new Array();
    if (max && typeof max === 'number')
      this.max = Math.round(max);
    this.default = def;
    this.max = 10;
    this._deacts = {};
  }

  get last() {
    const element = this.stac[this.stac.length - 1];
    return typeof element !== 'undefined' && element !== null ?
            element : Object.assign({}, this.default);
  }

  pop() {
    this.stac.pop();
    while(this.stac.length > this.max) {
      this.stac.pop();
    }
    return this.stac;
  }

  push(item) {
    if (this.stac.length > this.max)
      this.pop();
    if (this.stac.length === this.max)
      this.stac = this.stac.slice(1);
    this.stac.push(item);
    return this.stac;
  }
}

class Routes {
  constructor(history) {
    this._routes = {};
    this._params = {};
    this._default = { routes: [], 'params': [] };
    this._deacts = {};

    this._history = history;
    this._history.pushSearch = function (map, path = null) {
      let search = this.location.search;
      Object.keys(map).forEach(name => {
        search = changeParam(search, name, map[name]);
      });
      this.push({
        pathname: path ? path : this.location.pathname,
        search
      });
    };
    this._history.clear = function () {
      this.push({
        pathname: this.location.pathname,
        search: ''
      });
    };
    this.stack = new Stack(2, { routes: [], 'params': [] });
  }
  get history() {
    return this._history;
  }
  get routes() {
    return this._routes;
  }
  get params() {
    return this._params;
  }
  _buildPath(root, subpath) {
    if (root)
      return `/${root + subpath}`;
    return subpath;
  }
  _execute(handlers, match, extra) {
    handlers.forEach(handler => {
      handler(this._history.location, match, store.dispatch, extra);
    });
    return match;
  }
  _dispatchParam(key, value, handlers, nomatch) {
    const location = this._history.location;
    if (nomatch)
      return this._execute(handlers, nomatch);

    const match = {
      key,
      value,
      result: getParamByName(key,
        location.pathname + location.search)
    };
    match.isMatch = match.result === value;
    if (match.isMatch)
      this._execute(handlers, match);
    return match;
  }
  _dispatchRoute(pathname, _path, handlers, nomatch) {
    if (nomatch)
      return this._execute(handlers, nomatch);
    const match = matchPath(pathname, {
      path: _path,
      strict: false
    });
    if (!match)
      return { isMatch: false };
    this._execute(handlers, match);
    return { ...match, isMatch: true };
  }
  addComponentRoutes(component, router) {
    if (!router)
      return;
    const deactivators = { routes: [], 'params': [] };

    const { routeParam, routeName,
            handlers, routes,
            deactivator } = router;
    this._deacts[component] = deactivator;

    if (routeParam && handlers) {
      const exist = this._params[routeParam] || {};

      this._params[routeParam] = {
        ...exist
      };
      Object.keys(handlers).forEach(value => {
        this._params[routeParam][value] = {
          component,
          handler: handlers[value]
        };

        const match = this._dispatchParam(routeParam, value, [handlers[value]]);
        if(match.isMatch)
          deactivators.params.push(component);
      });
    }
    if ((routeName || routeName === '') && routes) {
      Object.keys(routes).forEach(route => {
        const _route = this._buildPath(routeName, route);

        const exist = this._routes[_route] || {};
        this._routes[_route] = {
          ...exist,
          [component]: routes[route] // handler
        };
        const match = this._dispatchRoute(this._history.location.pathname, _route, [routes[route]]);
        if (match.isMatch)
          deactivators.routes.push(component);
      });
    }

    this.stack.push({
      routes: [...this.stack.last.routes, ...deactivators.routes],
      params: [...this.stack.last.params, ...deactivators.params]
    });
  }
  dispatch(location) {
    let matched = false;

    const deactivators = { routes: [], 'params': [] };

    let activators = [];
    let actComps = [];
    Object.keys(this._params).forEach(key => {
      const locValue = getParamByName(key, location.pathname + location.search);

      Object.keys(this._params[key]).forEach(value => {
        if (value === locValue) {
          activators.push({
            match: { isMatch: true, value },
            handler: this._params[key][value].handler,
            component: this._params[key][value].component
          });
          actComps.push(this._params[key][value].component);
        }
      });
    });
    const { params } = this.stack.last;
    params.forEach(comp => {
      if (!actComps.includes(comp) && typeof this._deacts[comp] === 'function')
        this._deacts[comp](store.dispatch);
    });

    activators.forEach(act => {
      this._dispatchParam(null, null, [act.handler], act.match);
      deactivators.params.push(act.component);
    });
    matched = activators.length > 0;

    activators = [];
    actComps = [];
    Object.keys(this._routes).forEach(route => {
      const match = matchPath(location.pathname, {
        path: route,
        strict: false
      });
      if (!match)
        return;
      Object.keys(this._routes[route]).forEach(comp => {
        activators.push({
          match: { ...match, isMatch: true },
          handler: this._routes[route][comp],
          component: comp
        });
        actComps.push(comp);
      });
    });
    const { routes } = this.stack.last;
    routes.forEach(comp => {
      if (!actComps.includes(comp) && typeof this._deacts[comp] === 'function')
        this._deacts[comp](store.dispatch);
    });

    activators.forEach(act => {
      this._dispatchRoute(null, null, [act.handler], act.match);
      deactivators.routes.push(act.component);
    });

    this.stack.push({
      routes: deactivators.routes,
      params: deactivators.params
    });

    matched = matched || activators.length > 0;
    if (!matched) this._history.goBack();
  }
}
const history = createHashHistory();
const routes = new Routes(history);
history.listen(location => routes.dispatch(location));
export default routes;
