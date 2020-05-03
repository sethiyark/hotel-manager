import React, { PureComponent } from 'react';
import _ from 'lodash';
import './styles/RoomIcon.scss';

class RoomIcon extends PureComponent {
  render() {
    const { size = 200, color = '#f5f5f5', config = {}, roomNo } = this.props;

    const colorMap = {
      iconBorderColor: config.airConditioned ? '#4386cf' : '#000',
      iconShadowColor: config.airConditioned ? '#4386cf' : '#000',
    };

    return (
      <span className="room-block" style={{ width: size * 2, height: size }}>
        <span className="shadow" style={{ color: colorMap.iconShadowColor }}>
          <span
            className="room-block__icon"
            style={{ backgroundColor: colorMap.iconBorderColor }}
          >
            <span
              className="room-block__icon__color"
              style={{ backgroundColor: color }}
            >
              <span className="room-block__icon__door" />

              {config.western ? (
                <span className="room-block__icon__washroom">W</span>
              ) : null}
            </span>
          </span>
        </span>

        {!_.isEmpty(config.priorityCleaned) ? (
          <span className="room-block__priority-cleaning">
            {config.priorityCleaned}
          </span>
        ) : null}

        {!_.isEmpty(roomNo) ? (
          <span className="room-block_room-number">{roomNo}</span>
        ) : null}
      </span>
    );
  }
}

export default RoomIcon;

export { RoomIcon };
