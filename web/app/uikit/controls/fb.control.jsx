<style lang="sass">
  @import '~uikit/theme';
  .fb-control {
    pointer-events: none;

    circle {
      pointer-events: auto;
      cursor: pointer;
      transform: translate(19px, 19px);
    }
    use {
      pointer-events: auto;
      transform-origin: 19px 19px;
      transform: scale(0.8);
      cursor: pointer;
    }
  }
</style>

import React, { Component } from 'react';
import { attachRouterRedux } from 'store/utils';
import PropTypes from 'prop-types';

class FbControl extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg className={`fb-control ${this.props.className || ''}`}
           width="38" height="38"
           onClick={this.click()}>
        <circle r="19" fill="#3b5998"></circle>
        <use xlinkHref='#icon-fb' />
      </svg>
    );
  }
  click() {
    if (typeof this.props.onClick !== 'function')
      return () => { };
    return this.props.onClick;
  }
}

export default attachRouterRedux(FbControl);