const models = require("../models");

const usersController = {
  validateEmail: async (emailId, pwd) => {
    const response = await models.Users.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("email")), "total"]],
      where: {
        email: emailId,
      },
    });
    return response;
  },
  checkDuplicateEmail: async (emailId) => {
      console.log('---=== checkDuplicateEmail ', models);
    const response = await models.Users.findAll({
      attributes: [[sequelize.fn("COUNT", sequelize.col("email")), "total"]],
      where: {
        email: emailId,
      },
    });
    return response;
  },
  fetchAllUsers: async () => {
    return await models.Users.findAll({});
  }
};

module.exports = usersController;
