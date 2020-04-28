import React, { PureComponent } from 'react';

import './styles/RoomIcon.scss';

class RoomIcon extends PureComponent {
  render() {
    const { size = 200, color = '#f5f5f5', borderColor = '#000' } = this.props;
    return (
      <span className="room-block" style={{ width: size * 2, height: size }}>
        <i
          className="room-block__icon"
          style={{ backgroundColor: borderColor }}
        >
          <i
            className="room-block__icon__color"
            style={{ backgroundColor: color }}
          >
            <i className="room-block__icon__door" />
          </i>
        </i>
      </span>
    );
  }
}

export default RoomIcon;

export { RoomIcon };
