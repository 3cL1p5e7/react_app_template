<style lang="sass">
  @import '~uikit/theme';
  .vk-control {
    pointer-events: none;

    circle {
      pointer-events: auto;
      cursor: pointer;
      transform: translate(19px, 19px);
    }
    use {
      pointer-events: auto;
      cursor: pointer;
      transform: translate(1px, 1px);
    }
  }
</style>

import React, { Component } from 'react';
import { attachRouterRedux } from 'store/utils';
import PropTypes from 'prop-types';

class VkControl extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <svg className={ `vk-control ${this.props.className || ''}`}
           width="38" height="38"
           onClick={this.click()}>
        <circle r="19" fill="#4d75a3"></circle>
        <use xlinkHref='#icon-vk' />
      </svg>
    );
  }
  click() {
    if (typeof this.props.onClick !== 'function')
      return () => {};
    return this.props.onClick;
  }
}

export default attachRouterRedux(VkControl);