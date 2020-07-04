import { Customer, CheckIn, Bill, Room } from '..';

export default {
  CheckIn: {
    customer: async (checkIn) => checkIn.getCustomer(),
    bill: async (checkIn) => checkIn.getBill(),
    rooms: async (checkIn) => Room.find({ _id: checkIn.roomIds }),
  },

  Query: {
    checkIn: async (root, args) => {
      return CheckIn.findById(args.id);
    },
  },

  Mutation: {
    newCheckIn: async (root, args) => {
      let customer: Customer = null;
      if (args.name || args.address || args.contact) {
        const newCustomer = new Customer({
          name: args.name,
          address: args.address,
          contact: args.contact,
        });
        await newCustomer.save();
        customer = newCustomer;
      }
      const newBill = {
        billLog: [
          {
            amount: args.amount,
            createdAt: args.inTime,
          },
        ],
        billPaid: [],
      };
      if (args.payment) {
        newBill.billPaid = {
          ...args.payment,
          createdAt: args.inTime,
        };
      }
      const bill = new Bill(newBill);
      await bill.save();
      const checkin = new CheckIn({
        inTime: args.inTime,
        nOccupants: args.nOccupants,
        roomIds: args.roomIds,
        state: args.state,
        customerId: customer && customer.id,
        billId: bill.id,
      });
      await checkin.save();
      return {
        ...checkin,
        customer,
        bill,
      };
    },
  },
};
