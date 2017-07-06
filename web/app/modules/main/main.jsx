<style lang="sass">
  @import '~uikit/theme';

  .substrate {
    position: fixed!important;

    left: 0;
    top: 0;
    bottom: 0;
    right: 0;

    z-index: 2!important;
  }

  .modules-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    &--side-btn {
      z-index: 1;
      background-color: grey;
      align-self: center;
      width: 120px;
      height: 50px;
    }
    &--main {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    & > div {
      position: relative;
      z-index: 1;
    }

    &__modules {
      display: flex;
      flex-grow: 1;
    }

    &__sidebar {
      position: absolute!important;
      top: 0;
      bottom: 0;
      z-index: 2!important;

      display: flex;

      &-left {
        top: 0;
        left: 0;

        .sidebar-fade-enter {
          transform: translate3d(-60%, 0, 0);
          opacity: 0.01;
        }
        .sidebar-fade-leave.sidebar-fade-leave-active {
          transition: opacity .4s, transform .4s ease;
          transform: translate3d(-60%, 0, 0);
          opacity: 0.01;
        }
      }
      &-right {
        right: 0;

        .sidebar-fade-enter {
          transform: translate3d(60%, 0, 0);
          opacity: 0.01;
        }
        .sidebar-fade-leave.sidebar-fade-leave-active {
          transition: opacity .4s, transform .4s ease;
          transform: translate3d(60%, 0, 0);
          opacity: 0.01;
        }
      }
    }
  }

  .sidebar-fade-enter.sidebar-fade-enter-active {
    transition: opacity .4s, transform .4s ease;
    will-change: transform;
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  .sidebar-fade-leave {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
</style>

import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import { attachRouterRedux } from 'store/utils';

import Home from 'modules/home/home.jsx';
import SidebarLeft from 'modules/sidebars/sidebar.left.jsx';
import SidebarRight from 'modules/sidebars/sidebar.right.jsx';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import * as actions from './actions';

class Main extends Component {
  constructor(props) {
    super(props);
    this.showSidebar = this.showSidebar.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }
  static mapState(store) {
    return {
      active: store.main.active,
      activeSidebar: store.main.activeSidebar,
      blured: Boolean(store.main.activeSidebar === 'right')
    };
  }
  static mapActions = { ...actions }
  static routeHandler() {
    return {
      routeName: '',
      routes: {
        '/home': (location, match, dispatch) => {
          dispatch(this.mapActions.setActive('home'));
        }
      },
      deactivator: (dispatch) => {
      }
    };
  }
  activeComponent() {
    switch (this.props.active) {
      case 'home':
        return <Home key="home" className="booster" />;
    }
  }
  render() {
    const activeComponent = this.activeComponent();
    const leftSidebar = this.props.activeSidebar === 'left' ?
      <SidebarLeft key="left" /> : null;
    const rightSidebar = this.props.activeSidebar === 'right' ?
      <SidebarRight key="right" /> : null;

    return (
      <div className="modules-container">
        <div className="modules-container--side-btn" onClick={ this.showSidebar('left') }>
          I am left sidebar
        </div>
        <div className="modules-container--side-btn" onClick={ this.showSidebar('right') }>
          I am right sidebar
        </div>
        <div className="modules-container--main"
             style={ {'filter': this.props.blured ? 'blur(5px)' : 'none'} }>
          <Home key="home" className="booster" />
        </div>
        { this.props.activeSidebar ? <div className="substrate" onClick={ this.clearSearch }></div> : null }
        <CSSTransitionGroup className="modules-container__sidebar modules-container__sidebar-left"
                            component="div"
                            transitionName="sidebar-fade"
                            transitionAppear={true}
                            transitionAppearTimeout={300}
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}>
          { leftSidebar }
        </CSSTransitionGroup>
        <CSSTransitionGroup className="modules-container__sidebar modules-container__sidebar-right"
                            component="div"
                            transitionName="sidebar-fade"
                            transitionAppear={true}
                            transitionAppearTimeout={300}
                            transitionEnterTimeout={300}
                            transitionLeaveTimeout={300}>
          { rightSidebar }
        </CSSTransitionGroup>
      </div>
    );
  }
  showSidebar(name) {
    return () => {
      this.context.router.history.pushSearch({ side: name });
    };
  }
  clearSearch() {
    this.context.router.history.clear();
  }
}
Main.contextTypes = {
  router: PropTypes.object.isRequired
}

export default attachRouterRedux(Main);
