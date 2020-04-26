import { Customer } from '..';

export default {
  Query: {
    customers: () => {
      return Customer.find({});
    },
  },
};
