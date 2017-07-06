<style lang="sass">
  @import '~uikit/theme';
  .home {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: $modules-body-color;
  }
</style>

import React, { Component } from 'react';
import { attachRouterRedux } from 'store/utils';
import { Router, Route } from 'react-router';
import PropTypes from 'prop-types';

class Home extends Component {
  constructor(props) {
    super(props);
  }
  static routeHandler() {
    return {
      routeName: 'home',
      routes: {
        '/': (location, match, dispatch) => {
          console.log('main-route');
        }
      }
    };
  }
  render() {
    return (
      <div className={`home ${this.props.className || ''}`}>
      </div>
    );
  }
}
Home.contextTypes = {
  router: PropTypes.object.isRequired
}

export default attachRouterRedux(Home);
