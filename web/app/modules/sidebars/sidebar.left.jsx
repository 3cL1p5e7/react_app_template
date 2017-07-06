<style lang="sass">
  @import '~uikit/theme';
  .sidebar-left {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    z-index: 3;

    width: $sidebar-left-width;

    background-color: $sidebar-left-background-color;
  }
</style>

import React, { Component } from 'react';
import { attachRouterRedux } from 'store/utils';
import { Router, Route } from 'react-router';
import PropTypes from 'prop-types';

import * as mainActions from 'modules/main/actions';

class SidebarLeft extends Component {
  constructor(props) {
    super(props);
  }
  static routeHandler() {
    return {
      routeParam: 'side',
      handlers: {
        left: (location, match, dispatch) => {
          dispatch(this.mapActions.setActiveSidebar(match.value));
        }
      },
      deactivator: (dispatch) => {
        dispatch(this.mapActions.setActiveSidebar(null));
      }
    };
  }
  static mapState(store) {
    return {
    };
  }
  static mapActions = { ...mainActions }
  render() {
    return (
      <div className={`sidebar-left ${this.props.className || ''}`}>
      </div>
    );
  }
}
SidebarLeft.contextTypes = {
  router: PropTypes.object.isRequired
}

export default attachRouterRedux(SidebarLeft);
