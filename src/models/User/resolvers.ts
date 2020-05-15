import { User } from '..';

export default {
  Query: {
    users: async () => {
      return User.find({});
    },
  },
};
