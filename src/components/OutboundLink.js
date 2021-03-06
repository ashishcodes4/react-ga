import React, { Component } from 'react';
import PropTypes from 'prop-types';

import warn from '../utils/console/warn';

const NEWTAB = '_blank';
const MIDDLECLICK = 1;

export default class OutboundLink extends Component {
  static trackLink = () => {
    warn('ga tracking not enabled');
  };

  static propTypes = {
    eventLabel: PropTypes.string.isRequired,
    target: PropTypes.string,
    to: PropTypes.string,
    onClick: PropTypes.func
  };

  static defaultProps = {
    target: null,
    to: null,
    onClick: null
  };

  handleClick = (event) => {
    const { target, eventLabel, to, onClick } = this.props;
    const eventMeta = { label: eventLabel };
    const sameTarget = target !== NEWTAB;
    const normalClick = !(event.ctrlKey || event.shiftKey || event.metaKey || event.button === MIDDLECLICK);

    if (sameTarget && normalClick) {
      event.preventDefault();
      OutboundLink.trackLink(eventMeta, () => {
        window.location.href = to;
      });
    } else {
      OutboundLink.trackLink(eventMeta, () => {});
    }

    if (onClick) {
      onClick(event);
    }
  };

  render() {
    const { to: href, ...oldProps } = this.props;
    const props = {
      ...oldProps,
      href,
      onClick: this.handleClick
    };

    if (this.props.target === NEWTAB) {
      props.rel = 'noopener noreferrer';
    }

    delete props.eventLabel;
    return React.createElement('a', props);
  }
}
