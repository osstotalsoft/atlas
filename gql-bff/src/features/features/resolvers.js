const featureResolvers = {
  Query: {
    features: async (_parent, {}, _context, _info) => {
      return { schedule: process.env.SCHEDULE_URL ? true : false };
    },
  },
};

module.exports = featureResolvers;
