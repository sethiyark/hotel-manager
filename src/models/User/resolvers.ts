import { User } from '..';
import { checkAuth } from '../../utils/auth';

export default {
  Query: {
    users: async (root, args, context) => {
      try {
        await checkAuth(context);
      } catch (e) {
        log.error(`Unauthorized request to access query: Users. ${e.message}`);
        return e;
      }
      return User.find({});
    },
  },

  Mutation: {
    signup: async (root, args) => {
      const user = new User({
        name: args.name,
        email: args.email,
        password: args.password,
        role: args.role,
      });

      try {
        await user.save();
      } catch (e) {
        log.error(`Error while creating user: ${e.message}`);
        return e;
      }

      let token = null;

      try {
        token = await user.generateAuthToken();
      } catch (e) {
        log.error(`Unable to generate JWT token: ${e.message}`);
        return e;
      }

      return {
        user,
        authToken: token,
      };
    },

    login: async (root, args) => {
      const { email, password } = args;

      try {
        const user = await User.findByCredentials(email, password);
        if (!user) {
          return new Error('User not found');
        }

        let token = null;

        try {
          // @ts-ignore
          token = await user.generateAuthToken();
        } catch (e) {
          log.error(`Unable to generate JWT token: ${e.message}`);
          return e;
        }

        return {
          user,
          authToken: token,
        };
      } catch (e) {
        log.error(
          `Error while fetching user details with email ${email}: ${e.message}`
        );
        return e;
      }
    },
  },
};
