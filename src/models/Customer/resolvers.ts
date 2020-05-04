import { Customer } from '..';

export default {
  Query: {
    customers: async () => {
      return Customer.find({});
    },
  },
};
