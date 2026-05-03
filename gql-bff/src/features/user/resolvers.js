const { globalAdmin, admin, user } = require("./../../constants/identityUserRoles");

const userResolvers = {
  Query: {
    userData: async (_parent, { externalId }, context, _info) => {
      const { dataSources } = context;
      const roles = context.externalUser?.role ?? [];
      const rights = [globalAdmin, admin, user].some(r => roles.includes(r)) ? ["admin"] : [];

      return { rights };
    },
  },
};

module.exports = userResolvers;
