import { Room } from '..';

export default {
  Query: {
    rooms: async () => {
      const allRooms = await Room.find();
      const roomsByFloor = _.groupBy(allRooms, 'floor');
      return _.map(roomsByFloor, (rooms) => {
        const sortedRooms = _.sortBy(rooms, 'displayName');
        const result = [];
        for (let i = 0; i < sortedRooms.length / 2; i++) {
          result.push(sortedRooms[i], sortedRooms[sortedRooms.length - i - 1]);
        }
        if (result.length !== sortedRooms.length) {
          result.pop();
        }
        return result;
      });
    },
  },

  Mutation: {
    addRoom: async (root, args) => {
      const room = new Room(_.pickBy(args, Boolean));
      return room.save();
    },
  },
};
