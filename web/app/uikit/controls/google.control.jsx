<style lang="sass">
  @import '~uikit/theme';
  .google-control {
    pointer-events: none;

    circle {
      pointer-events: auto;
      cursor: pointer;
      transform: translate(19px, 19px);
    }
    use {
      pointer-events: auto;
      cursor: pointer;
      transform-origin: 19px 19px;
      transform: scale(0.6);
    }
  }
</style>

import React, { Component } from 'react';
import { attachRouterRedux } from 'store/utils';
import PropTypes from 'prop-types';

class GoogleControl extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg className={ `google-control ${this.props.className || ''}`}
           width="38" height="38"
           onClick={this.click()}>
        <circle r="19" fill="white"></circle>
        <use xlinkHref='#icon-google' />
      </svg>
    );
  }
  click() {
    if (typeof this.props.onClick !== 'function')
      return () => {};
    return this.props.onClick;
  }
}

export default attachRouterRedux(GoogleControl);