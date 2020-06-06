import * as React from 'react';
import _ from 'lodash';
import cx from 'classnames';

import './styles/RoomIcon.scss';

interface RoomIconProps {
  size?: number;
  state?: string;
  config?: {
    airConditioned: boolean;
    western: boolean;
    priorityCleaned: number;
  };
  roomNo: string;
  mirror?: boolean;
  className?: string;
}

class RoomIcon extends React.PureComponent<RoomIconProps> {
  getColor = () => {
    const { state } = this.props;
    switch (state) {
      case 'occupied':
        return '#DEEEDE';
      case 'maintenance':
        return '#B2B2B2';
      case 'cleaning':
        return '#FFFFCC';
      case 'booked':
        return '#E5F1FF';
      default:
        return '#FFCCCC';
    }
  };

  render() {
    const {
      size = 200,
      config = {
        airConditioned: false,
        western: false,
        priorityCleaned: NaN,
      },
      roomNo,
      mirror = false,
      className: classExtend,
    } = this.props;
    const height = size;
    const width = size * (16 / 9);
    const color = this.getColor();

    const className = cx([
      'room-block',
      { [classExtend]: !!classExtend },
      { mirror },
    ]);
    const colorMap = {
      iconBorderColor: config.airConditioned ? '#4386cf' : '#000',
      iconShadowColor: config.airConditioned ? '#4386cf' : '#000',
    };

    return (
      <span className={className} style={{ width, height }}>
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
                <span
                  className="room-block__icon__washroom"
                  style={{
                    left: width / 2 - height / 4,
                    marginTop: -height,
                    fontSize: height / 2,
                    lineHeight: `${height}px`,
                  }}
                >
                  W
                </span>
              ) : null}
            </span>
          </span>
        </span>

        {config.priorityCleaned ? (
          <span
            className="room-block__priority-cleaning"
            style={{
              fontSize: height / 8,
              lineHeight: `${height / 8}px`,
              bottom: -height / 16,
              left: width / 2 - height / 16,
            }}
          >
            P
            <span style={{ fontSize: height / 10 }}>
              {config.priorityCleaned}
            </span>
          </span>
        ) : null}
        {!_.isEmpty(roomNo) ? (
          <span
            className="room-block__room-number"
            style={{
              fontSize: height / 6,
              lineHeight: `${height / 6}px`,
              right: -height / 12,
            }}
          >
            {roomNo}
          </span>
        ) : null}
      </span>
    );
  }
}

export default RoomIcon;

export { RoomIcon };
